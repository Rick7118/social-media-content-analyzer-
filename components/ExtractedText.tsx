"use client";

import { useState } from "react";

type ExtractedTextProps = {
  text: string;
  onAnalyzeAgain: () => void;
};

export default function ExtractedText({
  text,
  onAnalyzeAgain,
}: ExtractedTextProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy extracted text:", error);
    }
  };

  return (
    <div className="mt-8 border-t border-[var(--border)] pt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent)]">✓</span>

          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Extracted content
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-all hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)]"
        >
          <span>{isCopied ? "✓" : "□"}</span>
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
        <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
          {text}
        </p>
      </div>

      <button
        type="button"
        onClick={onAnalyzeAgain}
        className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
      >
        Analyze Again
      </button>
    </div>
  );
}