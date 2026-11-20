import { getServices, getSiteSettings } from "@/lib/data/content";
import { HeroCopy } from "@/components/hero/hero-copy";
import { HeroVisual } from "@/components/hero/hero-visual";

export async function Hero() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const tooltips = Object.fromEntries(services.map((s) => [s.slug, s.title]));

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-[104px] pb-16 sm:pt-[120px] lg:pb-24">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-12">
        <HeroCopy availability={settings.availableForProjects ? settings.availabilityText : null} />
        <HeroVisual tooltips={tooltips} />
      </div>
    </section>
  );
}
