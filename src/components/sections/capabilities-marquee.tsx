import { capabilities } from "@/config/navigation";
import { MiniBlock, type ClayName } from "@/components/ui/iso-block";
import { cn } from "@/lib/utils/cn";

const tints: { color: ClayName; bg: string }[] = [
  { color: "sage", bg: "bg-sage/35" },
  { color: "lilac", bg: "bg-lilac/40" },
  { color: "apricot", bg: "bg-apricot/35" },
  { color: "white", bg: "bg-card" },
];

function Row({ items, reverse = false, duration, offset = 0 }: { items: string[]; reverse?: boolean; duration: string; offset?: number }) {
  const list = [...items, ...items];
  return (
    <div className="marquee-pause flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul
        className={cn("animate-marquee flex shrink-0 items-center gap-3 pr-3 will-change-transform", reverse && "[animation-direction:reverse]")}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {list.map((item, i) => {
          const tint = tints[(i + offset) % tints.length]!;
          return (
            <li key={`${item}-${i}`} aria-hidden={i >= items.length} className={cn("chip gap-3 py-3 pl-3.5 pr-5 text-[15px]", tint.bg)}>
              <MiniBlock color={tint.color} size={16} />
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CapabilitiesMarquee() {
  return (
    <section id="capabilities" aria-label="Capabilities" className="relative bg-bg-2 py-8">
      <h2 className="sr-only">What we build: {capabilities.join(", ")}</h2>
      <div className="flex flex-col gap-3">
        <Row items={capabilities} duration="52s" />
        <Row items={[...capabilities].reverse()} reverse duration="60s" offset={2} />
      </div>
    </section>
  );
}
