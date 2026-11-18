import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "subtle";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-out)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(109,124,255,0.55)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_16px_50px_-8px_rgba(109,124,255,0.75)]",
  ghost: "border border-line-strong text-fg hover:border-fg/40 bg-white/[0.02] backdrop-blur-sm",
  subtle: "text-fg-2 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-14 px-7 text-[0.98rem]",
};

/** Label that rolls upward on hover (two stacked copies). */
function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

function Inner({ children, icon, variant }: { children: ReactNode; icon?: boolean; variant: Variant }) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-y-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-y-0"
        />
      )}
      <span className={cn("relative z-10", variant === "primary" && "group-hover/btn:text-white transition-colors duration-500")}>
        <RollLabel>{children}</RollLabel>
      </span>
      {icon && (
        <span
          className={cn(
            "relative z-10 grid size-6 place-items-center overflow-hidden rounded-full transition-colors duration-500",
            variant === "primary" ? "bg-bg text-fg group-hover/btn:bg-white group-hover/btn:text-bg" : "bg-white/10",
          )}
        >
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4"
          />
          <ArrowUpRight
            aria-hidden
            className="absolute size-3.5 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
          />
        </span>
      )}
    </>
  );
}

type CommonProps = { variant?: Variant; size?: Size; icon?: boolean; className?: string; children: ReactNode };

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon = true,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "children" | "className">) {
  return (
    <Link data-cursor="hover" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon = false,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button data-cursor="hover" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}
