import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** primary = pine pill · ghost = pine outline · lime = lime pill (on pine) · onDark = porcelain outline (on pine) */
type Variant = "primary" | "ghost" | "lime" | "onDark" | "subtle";
type Size = "md" | "lg";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.01em] " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-out)] " +
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary: "bg-pine text-porcelain hover:bg-pine-2 shadow-[0_10px_24px_-12px_rgba(14,43,36,0.6)]",
  ghost: "border-[1.5px] border-pine text-pine hover:text-porcelain",
  lime: "bg-lime text-pine hover:bg-[#d3fa55] shadow-[0_10px_24px_-12px_rgba(198,244,50,0.6)]",
  onDark: "border-[1.5px] border-porcelain/30 text-porcelain hover:border-porcelain/60 hover:bg-porcelain/10",
  subtle: "text-fg-2 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-12 pl-6 pr-6 text-[0.92rem] has-[.btn-arrow]:pr-3",
  lg: "h-[60px] pl-7 pr-7 text-[1rem] has-[.btn-arrow]:pr-4",
};

function Inner({ children, icon, variant }: { children: ReactNode; icon?: boolean; variant: Variant }) {
  return (
    <>
      {variant === "ghost" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left scale-x-0 bg-pine transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:scale-x-100"
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <span
          className={cn(
            "btn-arrow relative grid size-[26px] shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-snap)] group-hover/btn:translate-x-1",
            variant === "lime" ? "bg-pine text-lime" : variant === "onDark" ? "bg-porcelain text-pine" : "bg-lime text-pine",
          )}
        >
          <ArrowRight aria-hidden className="size-3.5" strokeWidth={2.4} />
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
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
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
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}
