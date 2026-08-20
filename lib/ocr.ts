import { createWorker } from "tesseract.js";

export type OCRProgress = {
  status: string;
  progress: number;
};

type ProgressCallback = (progress: OCRProgress) => void;

async function createOCRWorker(
  onProgress?: ProgressCallback,
) {
  return createWorker("eng", 1, {
    logger: (message) => {
      onProgress?.({
        status: message.status,
        progress: message.progress,
      });
    },
  });
}

export async function extractTextFromImage(
  file: File,
  onProgress?: ProgressCallback,
): Promise<string> {
  const worker = await createOCRWorker(onProgress);

  try {
    const {
      data: { text },
    } = await worker.recognize(file);

    return text.trim();
  } finally {
    await worker.terminate();
  }
}

export async function extractTextFromCanvas(
  canvas: HTMLCanvasElement,
  onProgress?: ProgressCallback,
): Promise<string> {
  const worker = await createOCRWorker(onProgress);

  try {
    const {
      data: { text },
    } = await worker.recognize(canvas);

    return text.trim();
  } finally {
    await worker.terminate();
  }
}