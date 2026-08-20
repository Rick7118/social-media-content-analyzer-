import type {
  AnalysisResult,
  ContentMetric,
} from "@/lib/analyser";

type AnalysisResultsProps = {
  result: AnalysisResult;
  onAnalyzeAgain: () => void;
};

type MetricCardProps = {
  name: string;
  metric: ContentMetric;
};

function MetricCard({
  name,
  metric,
}: MetricCardProps) {
  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 transition-colors duration-200 hover:border-[var(--accent)]/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
            {name}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-2xl font-semibold tracking-tight">
              {metric.score}
            </p>

            <span className="font-mono text-[9px] text-[var(--muted)]">
              /100
            </span>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border)] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-[var(--muted)] transition-colors group-hover:border-[var(--accent)]/20 group-hover:text-[var(--accent)]">
          {metric.label}
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{ width: `${metric.score}%` }}
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
        {metric.feedback}
      </p>
    </div>
  );
}

export default function AnalysisResults({
  result,
  onAnalyzeAgain,
}: AnalysisResultsProps) {
  return (
    <section className="mt-8 border-t border-[var(--border)] pt-8">
      {/* Score header */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent)]">
                Content analysis
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Your content score
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-5 text-[var(--muted)]">
              A heuristic assessment based on structure,
              readability, and engagement signals.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-baseline justify-end gap-1">
              <p className="font-mono text-5xl font-semibold tracking-[-0.05em] text-[var(--accent)]">
                {result.score}
              </p>

              <span className="font-mono text-xs text-[var(--muted)]">
                /100
              </span>
            </div>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Overall score
            </p>
          </div>
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-1000 ease-out"
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          name="Hook"
          metric={result.metrics.hook}
        />

        <MetricCard
          name="Clarity"
          metric={result.metrics.clarity}
        />

        <MetricCard
          name="Readability"
          metric={result.metrics.readability}
        />

        <MetricCard
          name="Engagement"
          metric={result.metrics.engagement}
        />

        <MetricCard
          name="Call to action"
          metric={result.metrics.cta}
        />
      </div>

      {/* Score methodology */}
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Score methodology
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              How the overall score is calculated
            </p>
          </div>

          <span className="rounded-full border border-[var(--border)] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-[var(--muted)]">
            100 points
          </span>
        </div>

        <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            ["Hook", "25%"],
            ["Clarity", "20%"],
            ["Readability", "20%"],
            ["Engagement", "20%"],
            ["Call to action", "15%"],
          ].map(([name, weight]) => (
            <div
              key={name}
              className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 sm:last:border-b"
            >
              <span className="text-xs text-[var(--muted)]">
                {name}
              </span>

              <span className="font-mono text-xs text-[var(--foreground)]">
                {weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Content statistics
        </p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--border)]">
          <div className="pr-4">
            <p className="text-xl font-semibold tracking-tight">
              {result.stats.wordCount}
            </p>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-[var(--muted)]">
              Words
            </p>
          </div>

          <div className="px-4">
            <p className="text-xl font-semibold tracking-tight">
              {result.stats.sentenceCount}
            </p>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-[var(--muted)]">
              Sentences
            </p>
          </div>

          <div className="pl-4">
            <p className="text-xl font-semibold tracking-tight">
              {result.stats.averageSentenceLength}
            </p>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-[var(--muted)]">
              Avg. words / sentence
            </p>
          </div>
        </div>
      </div>

      {/* Strengths + improvements */}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/30 text-[10px] text-[var(--accent)]">
              ✓
            </span>

            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">
              Strengths
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {result.strengths.map(
              (strength, index) => (
                <div
                  key={`${strength}-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--accent)]">
                    0{index + 1}
                  </span>

                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {strength}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/30 text-[10px] text-[var(--accent)]">
              →
            </span>

            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">
              Improvements
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {result.improvements.map(
              (improvement, index) => (
                <div
                  key={`${improvement}-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--accent)]">
                    0{index + 1}
                  </span>

                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {improvement}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Analyze again */}
      <button
        type="button"
        onClick={onAnalyzeAgain}
        className="mt-5 w-full rounded-xl border border-[var(--border)] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 hover:text-[var(--accent)]"
      >
        Analyze again
      </button>
    </section>
  );
}