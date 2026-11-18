import { Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/data/content";
import { TextReveal } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/contact/contact-form";

const nextSteps = [
  "We review your requirements",
  "We schedule a discovery call",
  "You receive a written proposal",
];

export async function ContactSection() {
  const settings = await getSiteSettings();
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="mb-6 flex items-center gap-3" y={12}>
            <span className="font-mono text-xs text-accent">09</span>
            <span className="h-px w-10 bg-line-strong" aria-hidden />
            <span className="eyebrow">Start a project</span>
          </Reveal>
          <TextReveal
            id="contact-title"
            className="display text-[clamp(2.4rem,5vw,4.6rem)] text-balance"
            segments={["Have a Project in Mind?", { text: "Let's Build", serif: true, gradient: true }, "Something Great."]}
          />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-fg-2">
              Tell us about your business, your challenges, and what you want to build. Let&apos;s discuss how we can
              turn your idea into a working solution.
            </p>
            <ol className="mt-10 flex flex-col gap-4">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-xs text-accent">
                    {i + 1}
                  </span>
                  <span className="text-fg-2">{s}</span>
                </li>
              ))}
            </ol>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-line py-2 pl-2 pr-5 transition-colors hover:border-line-strong"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white/[0.05]">
                <Mail className="size-4" aria-hidden />
              </span>
              <span className="text-sm text-fg-2 group-hover:text-fg">{settings.contactEmail}</span>
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={40}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
