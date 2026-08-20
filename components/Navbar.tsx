import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-[var(--border)]">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label="ContentIQ home"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] transition-transform duration-300 group-hover:scale-125" />

          <span className="text-lg font-bold tracking-tight">
            ContentIQ
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
            Local analysis
          </span>

          <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

          <Link
            href="#how-it-works"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            How it works
          </Link>
        </div>
      </nav>
    </header>
  );
}