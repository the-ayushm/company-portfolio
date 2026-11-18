import { getSiteSettings } from "@/lib/data/content";
import { HeroCopy } from "@/components/hero/hero-copy";
import { HeroVisual } from "@/components/hero/hero-visual";

export async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[72px]"
    >
      {/* Ambient lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />
        <div className="hero-glow absolute -right-[10%] top-[8%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(109,124,255,0.22),transparent_60%)]" />
        <div className="hero-glow-2 absolute -left-[20%] bottom-[-30%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(167,123,255,0.14),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <HeroVisual />

      <HeroCopy
        availability={settings.availableForProjects ? settings.availabilityText : null}
      />
    </section>
  );
}
