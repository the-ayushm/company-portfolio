import { getSiteSettings } from "@/lib/data/content";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description: `How ${siteConfig.brand.name} handles information submitted through this website.`,
  path: "/privacy",
});

/**
 * Plain-language privacy notice. Review it with your own legal advisor before launch
 * (e.g. against India's Digital Personal Data Protection Act, 2023, and GDPR if relevant).
 */
export default async function PrivacyPage() {
  const { contactEmail } = await getSiteSettings();
  const analytics = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || process.env.NEXT_PUBLIC_GA_ID);

  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "What we collect",
      body: (
        <>
          When you submit the project form we collect the details you enter: your name, email, phone/WhatsApp number
          (optional), company name (optional), project type, budget range, timeline and project description. For abuse
          prevention we also store a one-way hash of your IP address (not the IP itself) and your browser&apos;s user-agent.
        </>
      ),
    },
    {
      title: "Why we collect it",
      body: "Only to respond to your inquiry, discuss your project and prepare a proposal. We do not sell your information or use it for unrelated marketing.",
    },
    {
      title: "Legal basis & consent",
      body: "We process this information based on the consent you give by ticking the consent box when you submit the form. You can withdraw consent at any time by contacting us.",
    },
    {
      title: "Where it is stored",
      body: "Inquiries are stored in our database and may be forwarded to our team's email inbox. Access is limited to our team members who handle inquiries.",
    },
    {
      title: "How long we keep it",
      body: "We keep inquiry details for as long as needed to respond and, if we work together, for the duration of the engagement and any legal record-keeping requirements. You can ask us to delete your inquiry at any time.",
    },
    {
      title: "Analytics & cookies",
      body: analytics
        ? "We use privacy-friendly analytics to understand aggregate site usage. The admin area uses a strictly necessary session cookie for signed-in administrators only."
        : "This site does not use tracking or advertising cookies. The admin area uses a strictly necessary session cookie for signed-in administrators only.",
    },
    {
      title: "Your rights",
      body: (
        <>
          You can ask to access, correct or delete the information you submitted, or withdraw your consent, by emailing{" "}
          <a href={`mailto:${contactEmail}`} className="text-fg underline underline-offset-4 hover:text-accent">
            {contactEmail}
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy notice" }]}
        title={["Privacy", { text: "notice.", serif: true }]}
        description={`How ${siteConfig.brand.name} handles the information you share with us through this website.`}
      />
      <section className="container-x pb-[var(--section-y)]">
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {sections.map((s, i) => (
            <div key={s.title} className="grid gap-4 py-10 sm:grid-cols-[auto_1fr] sm:gap-10">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-medium tracking-[-0.02em]">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-fg-2">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
