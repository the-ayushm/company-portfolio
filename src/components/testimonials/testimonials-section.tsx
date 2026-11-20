import { getTestimonials } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel";
import { ButtonLink } from "@/components/ui/button";
import { MiniBlock } from "@/components/ui/iso-block";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="testimonials-title"
          index="05"
          eyebrow="Client feedback"
          title={["What our clients", { text: "say.", hl: true }]}
          description="We only publish feedback that clients have approved, in their own words."
        />
        {testimonials.length > 0 ? (
          <TestimonialCarousel items={testimonials} />
        ) : (
          <div className="card mt-14 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="flex items-center gap-5">
              <MiniBlock color="lilac" size={34} />
              <p className="max-w-lg font-light text-fg-2">
                Client reviews will appear here once approved. Want to hear about our work directly? We&apos;re happy to
                walk you through past projects on a call.
              </p>
            </div>
            <ButtonLink href="/#contact">Request a consultation</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
