import { createWorker } from "tesseract.js";

export type OCRProgress = {
  status: string;
  progress: number;
};

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: OCRProgress) => void,
): Promise<string> {
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      onProgress?.({
        status: message.status,
        progress: message.progress,
      });
    },
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(file);

    return text.trim();
  } finally {
    await worker.terminate();
  }
}