/**
 * Seeds the database from src/config/* (only into EMPTY tables, so it never
 * overwrites edits made in the admin panel) and creates the first admin user.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { pgConfig } from "../src/lib/db/connection";
import { projectsConfig } from "../src/config/projects";
import { servicesConfig } from "../src/config/services";
import { teamConfig } from "../src/config/team";
import { testimonialsConfig } from "../src/config/testimonials";
import { faqsConfig } from "../src/config/faqs";
import { socialDefaults } from "../src/config/contact";

const prisma = new PrismaClient({ adapter: new PrismaPg(pgConfig(process.env.DATABASE_URL!)) });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("• Skipping admin user (ADMIN_EMAIL / ADMIN_PASSWORD not set)");
    return;
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`• Admin ${email} already exists (use npm run admin:create to reset the password)`);
    return;
  }
  await prisma.adminUser.create({
    data: { email, name: process.env.ADMIN_NAME || "Admin", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ Created admin ${email}`);
}

async function main() {
  await seedAdmin();

  if ((await prisma.service.count()) === 0) {
    for (const [i, s] of servicesConfig.entries()) {
      await prisma.service.create({ data: { ...s, order: i } });
    }
    console.log(`✓ Seeded ${servicesConfig.length} services`);
  }

  if ((await prisma.project.count()) === 0) {
    for (const [i, p] of projectsConfig.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip non-column field
      const { images, serviceSlugs, updatedAt: _u, ...data } = p;
      await prisma.project.create({
        data: {
          ...data,
          order: i,
          images: { create: images.map((img, j) => ({ ...img, order: j })) },
          services: { connect: serviceSlugs.map((slug) => ({ slug })) },
        },
      });
    }
    console.log(`✓ Seeded ${projectsConfig.length} projects`);
  }

  if ((await prisma.teamMember.count()) === 0) {
    for (const [i, m] of teamConfig.entries()) await prisma.teamMember.create({ data: { ...m, order: i } });
    console.log(`✓ Seeded ${teamConfig.length} team members`);
  }

  if ((await prisma.testimonial.count()) === 0) {
    for (const [i, t] of testimonialsConfig.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip config-only id
      const { id: _id, ...data } = t;
      // Samples are clearly flagged and never marked as client-approved.
      await prisma.testimonial.create({ data: { ...data, isPlaceholder: true, clientApproved: false, published: true, order: i } });
    }
    console.log(`✓ Seeded ${testimonialsConfig.length} SAMPLE testimonials (flagged as placeholders)`);
  }

  if ((await prisma.faq.count()) === 0) {
    for (const [i, f] of faqsConfig.entries()) await prisma.faq.create({ data: { ...f, order: i } });
    console.log(`✓ Seeded ${faqsConfig.length} FAQs`);
  }

  if ((await prisma.socialLink.count()) === 0) {
    for (const [i, s] of socialDefaults.entries()) await prisma.socialLink.create({ data: { ...s, order: i } });
    console.log(`✓ Seeded ${socialDefaults.length} social links (placeholder URLs — update in admin)`);
  }

  await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  console.log("✓ Site settings ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
