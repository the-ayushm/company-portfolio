import { Suspense } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/layout/logo";
import { PageLoader } from "@/components/animations/page-loader";
import { SmoothScroll } from "@/components/animations/smooth-scroll";

/** Static stand-in for the navbar while pathname-dependent UI streams in (unknown dynamic routes only). */
function NavbarFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x flex h-[76px] items-center">
        <Logo />
      </div>
    </header>
  );
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grain">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <PageLoader />
      {/* usePathname() is runtime data for params not known at build time, so these stream behind Suspense. */}
      <Suspense>
        <SmoothScroll />
      </Suspense>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
