import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <div className="relative">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,8rem)]">
          Lost in the <span className="accent-serif text-gradient">system.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-fg-2">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition-opacity hover:opacity-90">
            Back home
          </Link>
          <Link href="/work" className="rounded-full border border-line-strong px-6 py-3 font-medium transition-colors hover:border-fg/40">
            View our work
          </Link>
        </div>
      </div>
    </main>
  );
}
