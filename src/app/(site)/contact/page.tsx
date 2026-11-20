import { ContactSection } from "@/components/contact/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Start a Project",
  description: "Tell us about your business and what you want to build. Request a consultation for custom software, ERP, CRM, WhatsApp automation or e-commerce.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pt-[76px]">
      <ContactSection />
      <FaqSection />
    </div>
  );
}
