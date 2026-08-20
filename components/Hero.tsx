import UploadZone from "@/components/UploadZone";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Content analysis, simplified
            </span>
          </div>

          <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
            Analyze your content.
            <br />
            <span className="text-[var(--muted)]">Before you post.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Upload a social media post as an image or PDF. ContentIQ extracts
            your content, evaluates it, and shows you how to make it stronger.
          </p>
        </div>

        <UploadZone />
      </div>
    </section>
  );
}