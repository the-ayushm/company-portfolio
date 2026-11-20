import { getFaqs } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { faqLd, JsonLd } from "@/lib/seo/json-ld";

export async function FaqSection() {
  const faqs = await getFaqs();
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y relative">
      <JsonLd data={faqLd(faqs)} />
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            index="07"
            eyebrow="FAQ"
            align="left"
            title={["Questions,", { text: "answered.", hl: true }]}
            description="Can't find what you're looking for? Ask us directly and we'll get back to you."
          />
          <ButtonLink href="/#contact" variant="ghost" className="mt-8">
            Ask a question
          </ButtonLink>
        </div>
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
