import type { OCRProgress } from "@/lib/ocr";

type ProcessingStateProps = {
  progress: OCRProgress;
};

export default function ProcessingState({
  progress,
}: ProcessingStateProps) {
  const progressPercentage = Math.round(progress.progress * 100);

  return (
    <div className="mt-8 border-t border-[var(--border)] pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Extracting text
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {progress.status}
          </p>
        </div>

        <span className="font-mono text-sm">
          {progressPercentage}%
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-5 space-y-2 font-mono text-[10px] uppercase tracking-wider">
        <p className="text-[var(--accent)]">
          ✓ File validated
        </p>

        <p className="text-[var(--accent)]">
          ✓ Image detected
        </p>

        <p className="text-[var(--foreground)]">
          ◉ Extracting text
        </p>

        <p className="text-[var(--muted)]">
          ○ Analyzing content
        </p>
      </div>
    </div>
  );
}