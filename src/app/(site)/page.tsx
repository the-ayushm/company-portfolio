import { Hero } from "@/components/hero/hero";
import { CapabilitiesMarquee } from "@/components/sections/capabilities-marquee";
import { ServicesSection } from "@/components/services/services-section";
import { WorkSection } from "@/components/projects/work-section";
import { ProcessSection } from "@/components/sections/process-section";
import { WhySection } from "@/components/sections/why-section";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { TechEcosystem } from "@/components/sections/tech-ecosystem";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/contact/contact-section";
import { getServices, getSiteSettings, getSocialLinks } from "@/lib/data/content";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/" });

export default async function HomePage() {
  const [services, social, settings] = await Promise.all([getServices(), getSocialLinks(), getSiteSettings()]);
  return (
    <>
      <JsonLd data={organizationLd(social, services, settings.contactEmail)} />
      <JsonLd data={websiteLd()} />
      <Hero />
      <CapabilitiesMarquee />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <WhySection />
      <TestimonialsSection />
      <TechEcosystem />
      <FaqSection />
      <ContactSection />
    </>
  );
}
