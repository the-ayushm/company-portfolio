import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/** Brand mark: a pine rounded square holding three snapped-together blocks (sage, lilac, lime). */
export function LogoMark({ className, shadow = true }: { className?: string; shadow?: boolean }) {
  return (
    <svg
      viewBox="0 0 86 86"
      aria-hidden
      className={cn("logo-mark size-9 overflow-visible", shadow && "drop-shadow-[0_8px_14px_rgba(14,43,36,0.22)]", className)}
    >
      <rect width="86" height="86" rx="26" fill="#0E2B24" />
      <rect className="lm-a" x="18" y="18" width="22" height="50" rx="9" fill="#A9C8B4" />
      <rect className="lm-b" x="46" y="18" width="22" height="22" rx="9" fill="#C7BEF0" />
      <rect className="lm-c" x="46" y="46" width="22" height="22" rx="9" fill="#C6F432" />
    </svg>
  );
}

/** Lowercase wordmark with the lime full stop. */
export function Wordmark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={cn("font-medium tracking-[-0.05em]", tone === "dark" ? "text-porcelain" : "text-pine", className)}>
      {siteConfig.brand.wordmark}
      <span className="text-lime">.</span>
    </span>
  );
}

export function Logo({ className, tone = "light", descriptor = true }: { className?: string; tone?: "light" | "dark"; descriptor?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark className="size-9" shadow={tone === "light"} />
      <span className="flex flex-col leading-none">
        <Wordmark tone={tone} className="text-[1.55rem] leading-[0.9]" />
        {descriptor && siteConfig.brand.descriptor && (
          <span className={cn("mt-1 font-mono text-[0.5rem] tracking-[0.42em]", tone === "dark" ? "text-porcelain/60" : "text-fg-3")}>
            {siteConfig.brand.descriptor}
          </span>
        )}
      </span>
    </Link>
  );
}
