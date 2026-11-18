import type { TestimonialContent } from "@/types/content";

/**
 * ⚠️ SAMPLE TESTIMONIALS — NOT REAL CLIENT FEEDBACK.
 * These exist only to preview the layout. They are always rendered with a visible
 * "Sample" label and are hidden when NEXT_PUBLIC_SHOW_PLACEHOLDERS=false.
 *
 * To publish a real testimonial: /admin → Testimonials → add it, tick
 * "Client approved" and "Published". Only then does it appear without a label.
 */
export const testimonialsConfig: TestimonialContent[] = [
  {
    id: "sample-1",
    clientName: "Client name",
    designation: "Designation",
    company: "Company name",
    avatarUrl: null,
    review:
      "This is placeholder text showing where a genuine, client-approved review will appear. Replace it from the admin panel once the client has given written approval.",
    projectName: "Project name",
    isPlaceholder: true,
  },
  {
    id: "sample-2",
    clientName: "Client name",
    designation: "Designation",
    company: "Company name",
    avatarUrl: null,
    review:
      "Sample testimonial. Real feedback should describe the client's own experience working with the team, in their own words, and be published only with their consent.",
    projectName: "Project name",
    isPlaceholder: true,
  },
  {
    id: "sample-3",
    clientName: "Client name",
    designation: "Designation",
    company: "Company name",
    avatarUrl: null,
    review:
      "Sample testimonial. Keep reviews unedited apart from typos, attribute them accurately, and remove any the client asks you to take down.",
    projectName: "Project name",
    isPlaceholder: true,
  },
];
