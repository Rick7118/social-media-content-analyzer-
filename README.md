# ContentIQ

ContentIQ is a client-side content analysis tool that extracts text from social media screenshots and PDF documents, evaluates the content using an explainable heuristic scoring engine, and provides actionable feedback on structure, readability, engagement, and calls to action.

---

## Overview

ContentIQ provides a simple workflow:

```text
Image / PDF
     │
     ▼
Content extraction
     │
     ├── PDF.js
     └── Tesseract.js
     │
     ▼
Extracted text
     │
     ▼
Content analysis
     │
     ├── Hook
     ├── Clarity
     ├── Readability
     ├── Engagement
     └── Call to action
     │
     ▼
Score + recommendations
```

Everything is processed locally in the browser. Uploaded files and extracted text do not need to be sent to a backend service.

---

## Features

- Upload PDF, PNG, JPG, and JPEG files
- Drag-and-drop file input
- PDF text extraction with PDF.js
- OCR using Tesseract.js
- OCR fallback for scanned PDFs
- Real-time extraction progress
- Explainable content scoring
- Actionable strengths and improvements
- Extracted-text preview with copy functionality
- Client-side processing with no required API keys
- Responsive dark interface

### Scoring

Content is evaluated across five dimensions:

| Metric | Weight |
| --- | ---: |
| Hook | 25% |
| Clarity | 20% |
| Readability | 20% |
| Engagement | 20% |
| Call to action | 15% |

The final score is normalized to a `0–100` range.

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **PDF.js**
- **Tesseract.js**

The current analysis engine is deterministic and does not require an external AI model.

---

## Architecture

The application separates extraction, analysis, and presentation.

```text
app/
└── Application entry points

components/
├── UploadZone.tsx
├── ProcessingState.tsx
├── ExtractedText.tsx
└── AnalysisResults.tsx

lib/
├── pdf.ts
├── ocr.ts
└── analyser.ts
```

### Extraction

`lib/pdf.ts` handles PDF text extraction and scanned-document fallback.

`lib/ocr.ts` handles OCR-based extraction from images and scanned content.

### Analysis

`lib/analyser.ts` contains the deterministic scoring engine.

It converts extracted text into a typed `AnalysisResult` containing:

- overall score
- metric scores
- strengths
- improvements
- content statistics

The analyser is independent from the UI.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <your-repository-url>
cd social-media-content-analyzer
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

---

## How It Works

### 1. Validate

The application checks the file type and size before processing.

Maximum file size: **10 MB**.

### 2. Extract

PDFs are processed with PDF.js. Image content and scanned documents use Tesseract.js when OCR is required.

### 3. Analyze

The extracted text is evaluated for structural signals including:

- opening/hook patterns
- sentence length
- vague wording
- interaction signals
- call-to-action language

### 4. Score

The five metrics are combined using their respective weights:

```text
Overall Score =
    Hook          × 0.25
  + Clarity       × 0.20
  + Readability   × 0.20
  + Engagement    × 0.20
  + CTA           × 0.15
```

### 5. Recommend

Metric thresholds are used to generate strengths and targeted improvement suggestions.

---

## Design

ContentIQ uses a minimal visual system:

- dark graphite background
- electric blue accent
- Manrope for interface text
- JetBrains Mono for technical metadata

The interface prioritizes hierarchy and clarity over decorative elements.

---

## Privacy

Content extraction and analysis currently happen locally in the browser.

No application backend is required to receive uploaded documents, and no external AI API is required for the analysis engine.

---

## Limitations

The current analyser is deterministic and focuses on structural signals rather than semantic understanding.

It can evaluate things such as sentence length, questions, CTA language, and interaction signals, but it cannot reliably determine whether content is factually correct, humorous, or appropriate for a specific audience.

OCR accuracy may also vary depending on image quality, resolution, contrast, and background complexity.

---

## Roadmap

Potential future improvements:

- Automated tests for the analysis engine
- More context-aware recommendations
- Platform-specific scoring
- Optional LLM-based semantic analysis
- Version comparison
- Historical score tracking
- Exportable reports

---

## Project Structure

```text
social-media-content-analyzer/
│
├── app/
├── components/
├── lib/
├── public/
│
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## Status

ContentIQ is currently functional and production-build ready.

```text
Upload
  → Extract
  → Analyze
  → Explain
  → Improve
```

---

## License

This project is currently provided for evaluation and portfolio purposes.