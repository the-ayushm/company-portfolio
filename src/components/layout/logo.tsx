import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/** Brand mark: three connected nodes — three engineers, one system. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7", className)}>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>
      <path d="M16 5 L27 24 L5 24 Z" stroke="url(#lm-g)" strokeWidth="1.4" strokeLinejoin="round" opacity="0.7" />
      <circle cx="16" cy="5.5" r="3.6" fill="var(--fg)" />
      <circle cx="26.5" cy="24" r="3.6" fill="url(#lm-g)" />
      <circle cx="5.5" cy="24" r="3.6" fill="var(--fg)" />
      <circle cx="16" cy="17.6" r="1.6" fill="var(--signal)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:rotate-[120deg]" />
      <span className="text-[1.05rem] font-semibold tracking-[-0.03em]">{siteConfig.brand.name}</span>
    </Link>
  );
}
