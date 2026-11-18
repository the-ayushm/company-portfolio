"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { mainNav } from "@/config/navigation";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
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
  const current = isHome ? active ?? "home" : pathname.startsWith("/work") ? "work" : null;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || open
              ? "border-b border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent",
          )}
        >
          <nav aria-label="Main" className="container-x flex h-[72px] items-center justify-between gap-6">
            <Logo className="relative z-10" />

            <ul className="hidden items-center gap-1 rounded-full border border-line bg-white/[0.02] p-1 lg:flex">
              {mainNav.map((item) => {
                const isActive = current === item.id;
                return (
                  <li key={item.id} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      onClick={(e) => onNav(e, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-4 py-2 text-[0.85rem] transition-colors duration-300",
                        isActive ? "text-fg" : "text-fg-2 hover:text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <span className="hidden sm:block">
                <ButtonLink href="/#contact" onClick={(e) => onNav(e, "contact")}>
                  Let&apos;s Talk
                </ButtonLink>
              </span>
              <button
                type="button"
                className="relative z-10 grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-px w-full bg-fg transition-transform duration-500 ease-[var(--ease-out)]",
                      open && "translate-y-1.5 rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full bg-fg transition-transform duration-500 ease-[var(--ease-out)]",
                      open && "-translate-y-1.5 -rotate-45",
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
            className="fixed inset-0 z-40 flex flex-col bg-bg px-[var(--gutter)] pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <ul className="relative flex flex-col gap-1">
              {mainNav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => onNav(e, item.id)}
                      className="flex items-baseline gap-4 py-1.5"
                    >
                      <span className="font-mono text-xs text-fg-3">0{i + 1}</span>
                      <span
                        className={cn(
                          "display text-[clamp(2.4rem,11vw,4rem)]",
                          current === item.id ? "text-fg" : "text-fg-2",
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
              <ButtonLink href="/#contact" onClick={(e) => onNav(e, "contact")} size="lg" className="w-full">
                Start a Project
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
