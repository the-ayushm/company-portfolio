import { Mail } from "lucide-react";
import { getSiteSettings, getSocialLinks } from "@/lib/data/content";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { TextReveal } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { IndexLabel } from "@/components/ui/section-heading";
import { IsoBlock, IsoScene } from "@/components/ui/iso-block";

const nextSteps = ["We review your requirements", "We schedule a discovery call", "You receive a written proposal"];

export async function ContactSection() {
  const [settings, social] = await Promise.all([getSiteSettings(), getSocialLinks()]);
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative bg-bg-2">
      <div className="container-x grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="pine-panel on-pine flex min-h-[560px] flex-col p-8 sm:p-10">
            <IndexLabel index="08" eyebrow="Start a project" className="text-porcelain/60" />
            <TextReveal
              id="contact-title"
              className="h-section mt-6 max-w-md text-balance text-porcelain"
              segments={["Let's automate", { text: "your business.", hl: true }]}
            />
            <p className="mt-6 max-w-sm font-light leading-relaxed text-porcelain/75">
              Tell us about your business, what slows your team down and what you want to build. We&apos;ll show you how
              the pieces snap together.
            </p>
            <ol className="mt-8 flex flex-col gap-3">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-porcelain/85">
                  <span className="grid size-7 place-items-center rounded-[9px] bg-porcelain/10 font-mono text-xs text-lime">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-wrap gap-2 pt-10">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="group inline-flex items-center gap-2.5 rounded-full bg-porcelain py-2 pl-2 pr-5 text-sm text-pine transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-lime">
                  <Mail className="size-4" aria-hidden />
                </span>
                {settings.contactEmail}
              </a>
              {social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-porcelain py-2 pl-2 pr-5 text-sm text-pine transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-lime">
                    <WhatsappIcon className="size-4" />
                  </span>
                  {s.label || "WhatsApp"}
                </a>
              ))}
            </div>
            <IsoScene width={150} height={150} className="pointer-events-none absolute bottom-8 right-2 hidden opacity-95 sm:grid">
              <IsoBlock x={0} y={0} w={64} d={64} h={12} color="sage" float phase={0} />
              <IsoBlock x={76} y={10} w={64} d={64} h={20} color="apricot" float phase={1.4} />
              <IsoBlock x={30} y={82} w={70} d={70} h={28} color="lime" float phase={2.2} />
            </IsoScene>
          </div>
        </Reveal>
        <Reveal delay={0.1} y={24}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
