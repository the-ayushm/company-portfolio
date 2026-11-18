import { capabilities } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

function Row({ items, reverse = false, duration }: { items: string[]; reverse?: boolean; duration: string }) {
  const list = [...items, ...items];
  return (
    <div className="marquee-pause flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <ul
        className={cn("animate-marquee flex shrink-0 items-center gap-10 pr-10 will-change-transform", reverse && "[animation-direction:reverse]")}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {list.map((item, i) => (
          <li key={`${item}-${i}`} aria-hidden={i >= items.length} className="flex items-center gap-10">
            <span
              className={cn(
                "whitespace-nowrap text-[clamp(1.8rem,4.2vw,3.6rem)] tracking-[-0.04em]",
                i % 2 === 1 ? "accent-serif text-fg-2" : "font-medium text-fg",
              )}
            >
              {item}
            </span>
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-accent" aria-hidden>
              <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CapabilitiesMarquee() {
  return (
    <section id="capabilities" aria-label="Capabilities" className="relative border-y border-line bg-bg-2/60 py-10">
      <h2 className="sr-only">What we build: {capabilities.join(", ")}</h2>
      <div className="flex flex-col gap-4">
        <Row items={capabilities} duration="48s" />
        <Row items={[...capabilities].reverse()} reverse duration="56s" />
      </div>
    </section>
  );
}
