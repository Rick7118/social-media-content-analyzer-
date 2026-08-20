import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Hero />

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-5xl px-6 pb-24 pt-20"
      >
        <div className="border-t border-[var(--border)] pt-10">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent)]">
              How it works
            </p>
          </div>

          <div className="mt-4 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              From content to clarity.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              ContentIQ extracts your content, evaluates its structure,
              and turns the result into practical feedback.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <span className="font-mono text-[9px] text-[var(--accent)]">
                01
              </span>

              <h3 className="mt-4 text-base font-semibold">
                Upload
              </h3>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Upload a social media screenshot or PDF. Files are
                processed locally in your browser.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <span className="font-mono text-[9px] text-[var(--accent)]">
                02
              </span>

              <h3 className="mt-4 text-base font-semibold">
                Extract
              </h3>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                ContentIQ extracts text using PDF.js and Tesseract.js
                when OCR is required.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <span className="font-mono text-[9px] text-[var(--accent)]">
                03
              </span>

              <h3 className="mt-4 text-base font-semibold">
                Analyze
              </h3>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Your content is evaluated across hook, clarity,
                readability, engagement, and CTA signals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}