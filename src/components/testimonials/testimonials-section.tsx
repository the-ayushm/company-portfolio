import { MessageSquareQuote } from "lucide-react";
import { getTestimonials } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel";
import { ButtonLink } from "@/components/ui/button";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="testimonials-title"
          index="05"
          eyebrow="Client feedback"
          title={["What Our", { text: "Clients", serif: true }, "Say."]}
          description="We only publish feedback that clients have approved, in their own words."
        />
        {testimonials.length > 0 ? (
          <TestimonialCarousel items={testimonials} />
        ) : (
          <div className="mt-16 flex flex-col items-start gap-6 rounded-[var(--radius-lg)] border border-dashed border-line-strong p-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <MessageSquareQuote className="size-8 text-accent" aria-hidden />
              <p className="max-w-lg text-fg-2">
                Client reviews will appear here once approved. Want to hear about our work directly? We&apos;re happy to
                walk you through past projects on a call.
              </p>
            </div>
            <ButtonLink href="/#contact">Request a Consultation</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
