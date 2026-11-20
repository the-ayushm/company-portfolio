"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { mainNav } from "@/config/navigation";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { IsoBlock, IsoScene } from "@/components/ui/iso-block";
import { useActiveSection } from "@/hooks/use-active-section";
import { scrollToId, getLenis } from "@/lib/utils/scroll";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(
    mainNav.map((n) => n.id),
    isHome,
  );
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 600 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (isHome && scrollToId(id)) e.preventDefault();
  };

  // Highlight "Work" on project pages.
  const current = isHome ? (active ?? "home") : pathname.startsWith("/work") ? "work" : null;

  return (
    <>
      <motion.header
        className={cn("fixed inset-x-0 top-0 z-50", open && "on-pine")}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            open
              ? "bg-transparent"
              : scrolled
                ? "bg-[rgba(243,242,238,0.8)] shadow-[0_1px_0_var(--line)] backdrop-blur-xl backdrop-saturate-150"
                : "bg-transparent",
          )}
        >
          <nav aria-label="Main" className="container-x flex h-[76px] items-center justify-between gap-6">
            <Logo className="relative z-10" tone={open ? "dark" : "light"} />

            <ul className="hidden items-center gap-1 lg:flex">
              {mainNav.map((item) => {
                const isActive = current === item.id;
                return (
                  <li key={item.id} className="relative">
                    <Link
                      href={item.href}
                      onClick={(e) => onNav(e, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className="relative block px-3.5 py-2 text-[15px] text-pine transition-opacity duration-300 hover:opacity-70"
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          aria-hidden
                          className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-lime ring-1 ring-lime-deep/60"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <span className="hidden sm:block">
                <ButtonLink href="/#contact" onClick={(e) => onNav(e, "contact")} variant={open ? "lime" : "primary"}>
                  Book a free audit
                </ButtonLink>
              </span>
              <button
                type="button"
                className={cn(
                  "relative z-10 grid size-12 place-items-center rounded-full lg:hidden",
                  open ? "bg-porcelain/10 text-porcelain" : "bg-pine text-porcelain",
                )}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                      open && "translate-y-[5px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                      open && "-translate-y-[5px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="on-pine fixed inset-0 z-40 flex flex-col overflow-hidden bg-[radial-gradient(120%_90%_at_55%_40%,#1B463B_0%,#0E2B24_60%,#0A211B_100%)] px-[var(--gutter)] pb-10 pt-28 text-porcelain lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 46px) 38px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 46px) 38px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 46px) 38px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(198,244,50,0.13)_1.2px,transparent_1.3px)] [background-size:26px_26px]" />
            <IsoScene width={180} height={180} className="absolute -right-6 bottom-32 opacity-90">
              <IsoBlock x={0} y={0} w={80} d={80} h={14} color="sage" float phase={0} />
              <IsoBlock x={96} y={0} w={80} d={80} h={22} color="lilac" float phase={1.2} />
              <IsoBlock x={0} y={96} w={80} d={80} h={10} color="apricot" float phase={2.1} />
              <IsoBlock x={96} y={96} w={84} d={84} h={34} color="lime" float phase={0.6} />
            </IsoScene>
            <ul className="relative flex flex-col gap-1">
              {mainNav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href} onClick={(e) => onNav(e, item.id)} className="flex items-baseline gap-4 py-1.5">
                      <span className="font-mono text-xs text-porcelain/50">0{i + 1}</span>
                      <span
                        className={cn(
                          "display text-[clamp(2.4rem,11vw,4rem)]",
                          current === item.id ? "text-lime" : "text-porcelain",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="relative mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <ButtonLink href="/#contact" onClick={(e) => onNav(e, "contact")} size="lg" variant="lime" className="w-full">
                Book a free audit
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
