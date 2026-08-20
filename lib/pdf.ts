import { extractTextFromCanvas, OCRProgress } from "@/lib/ocr";

type ProgressCallback = (progress: OCRProgress) => void;

export async function extractTextFromPDF(
  file: File,
  onProgress?: ProgressCallback,
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  onProgress?.({
    status: "Reading PDF",
    progress: 0.05,
  });

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const textPages: string[] = [];
  let hasEmbeddedText = false;

  onProgress?.({
    status: "Checking document text",
    progress: 0.1,
  });

  /*
   * First pass:
   * Try to extract normal embedded PDF text.
   */
  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => {
        if ("str" in item) {
          return item.str;
        }

        return "";
      })
      .join(" ")
      .trim();

    if (pageText) {
      hasEmbeddedText = true;
      textPages.push(pageText);
    }

    onProgress?.({
      status: `Reading page ${pageNumber} of ${pdf.numPages}`,
      progress:
        0.1 +
        (pageNumber / pdf.numPages) * 0.2,
    });
  }

  /*
   * Normal text-based PDF.
   */
  if (hasEmbeddedText) {
    onProgress?.({
      status: "Text extracted",
      progress: 1,
    });

    return textPages.join("\n\n").trim();
  }

  /*
   * Scanned/image-only PDF.
   *
   * No embedded text was found, so we render
   * each PDF page to a canvas and send that
   * canvas through Tesseract.js.
   */
  const ocrPages: string[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page = await pdf.getPage(pageNumber);

    onProgress?.({
      status: `Rendering page ${pageNumber} of ${pdf.numPages}`,
      progress:
        0.3 +
        ((pageNumber - 1) / pdf.numPages) * 0.7,
    });

    const viewport = page.getViewport({
      scale: 1.5,
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Could not create a canvas for PDF OCR.",
      );
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const pageText = await extractTextFromCanvas(
      canvas,
      (ocrProgress) => {
        const pageStart =
          0.3 +
          ((pageNumber - 1) / pdf.numPages) * 0.7;

        const pageRange =
          0.7 / pdf.numPages;

        onProgress?.({
          status: `Extracting text from page ${pageNumber} of ${pdf.numPages}`,
          progress:
            pageStart +
            ocrProgress.progress * pageRange,
        });
      },
    );

    if (pageText) {
      ocrPages.push(pageText);
    }

    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.({
    status: "Text extracted",
    progress: 1,
  });

  return ocrPages.join("\n\n").trim();
}