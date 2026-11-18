import { TeamSection } from "@/components/team/team-section";
import { WhySection } from "@/components/sections/why-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TechEcosystem } from "@/components/sections/tech-ecosystem";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";

export const metadata = pageMetadata({
  title: "About Us",
  description: "A collaborative team of three developers building practical, scalable and reliable software for businesses, startups and enterprises.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHeader
        eyebrow="About"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={["A small team.", { text: "Serious engineering.", serif: true, gradient: true }]}
        description="We take projects from initial requirements to development, deployment and ongoing maintenance — working closely with you at every step."
      >
        <ButtonLink href="/#contact" size="lg" className="mt-10">
          Start a Project
        </ButtonLink>
      </PageHeader>
      <TeamSection />
      <ProcessSection />
      <WhySection />
      <TechEcosystem />
    </>
  );
}
