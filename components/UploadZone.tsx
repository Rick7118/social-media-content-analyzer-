"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";
import { extractTextFromImage, OCRProgress } from "@/lib/ocr";
import ExtractedText from "@/components/ExtractedText";
import ProcessingState from "@/components/ProcessingState";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type ProcessingStatus = "idle" | "processing" | "complete" | "error";

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingState, setProcessingState] =
    useState<ProcessingStatus>("idle");

  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({
    status: "Starting OCR",
    progress: 0,
  });

  const [extractedText, setExtractedText] = useState("");

  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Unsupported file. Use PDF, PNG, or JPG.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10 MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setProcessingState("idle");
      setExtractedText("");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setProcessingState("idle");
    setExtractedText("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    if (processingState !== "processing") {
      inputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAnalyze = async () => {
    if (!file) {
      return;
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setError(
        "PDF processing isn't connected yet. Image OCR is ready to test.",
      );
      return;
    }

    setError(null);
    setExtractedText("");
    setProcessingState("processing");

    try {
      const text = await extractTextFromImage(file, (progress) => {
        setOcrProgress(progress);
      });

      if (!text) {
        throw new Error("No text could be detected in this image.");
      }

      setExtractedText(text);
      setProcessingState("complete");
    } catch (ocrError) {
      console.error("OCR failed:", ocrError);

      setError(
        ocrError instanceof Error
          ? ocrError.message
          : "We couldn't extract text from this image.",
      );

      setProcessingState("error");
    }
  };

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleInputChange}
        className="hidden"
      />

      {!file ? (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                openFilePicker();
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group cursor-pointer rounded-3xl border border-dashed p-2 transition-all duration-300 ${
              isDragging
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-hover)]"
            }`}
          >
            <div
              className={`flex min-h-[300px] flex-col items-center justify-center rounded-[1.25rem] border px-6 py-12 text-center transition-colors ${
                isDragging
                  ? "border-[var(--accent)]/30"
                  : "border-[var(--border)] group-hover:border-[var(--accent)]/20"
              }`}
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border bg-[var(--background)] transition-all duration-300 ${
                  isDragging
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] group-hover:-translate-y-1"
                }`}
              >
                <span className="text-2xl font-light">
                  {isDragging ? "↓" : "+"}
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight">
                {isDragging ? "Drop it here" : "Drop your content here"}
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                or click anywhere to browse your files
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {["PDF", "PNG", "JPG", "JPEG"].map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="font-mono text-xs text-red-400">{error}</p>

              <button
                type="button"
                onClick={() => setError(null)}
                className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Local processing
            </span>

            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Nothing uploaded
            </span>

            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
              10 MB max
            </span>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] font-mono text-xs text-[var(--accent)]">
                {file.type === "application/pdf" ? "PDF" : "IMG"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {file.name}
                </p>

                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              disabled={processingState === "processing"}
              className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>

          {processingState === "processing" && (
            <ProcessingState progress={ocrProgress} />
          )}

          {processingState === "complete" && (
            <ExtractedText
              text={extractedText}
              onAnalyzeAgain={handleAnalyze}
            />
          )}

          {processingState === "error" && error && (
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-400">
                  Extraction failed
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {error}
                </p>
              </div>
            </div>
          )}

          {processingState === "idle" && (
            <button
              type="button"
              onClick={handleAnalyze}
              className="mt-6 w-full rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Analyze Content
            </button>
          )}
        </div>
      )}
    </div>
  );
}