# ContentIQ

ContentIQ is a client-side content analysis tool that extracts text from social media screenshots and PDF documents, evaluates structural content signals, and turns the results into an explainable score with actionable feedback.

[Live Demo](https://socialmedia-contentanalyzer.vercel.app/)

---

## Overview

ContentIQ follows a simple processing pipeline:

```text
Image / PDF
     │
     ▼
Text extraction
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
Score + feedback
```

The entire pipeline runs in the browser. Files are processed locally without requiring an application backend or external AI service.

---

## Approach

ContentIQ was built as a client-side processing pipeline focused on keeping content extraction, analysis, and presentation independent.

The application accepts screenshots and PDF documents, validates them locally, and extracts their text using PDF.js for text-based PDFs and Tesseract.js when OCR is required. This also allows scanned PDFs to be handled without introducing a backend service.

The extracted text is passed to a deterministic analysis engine that evaluates five structural signals: hook, clarity, readability, engagement, and call to action. Each metric contributes a weighted score, which is normalized to a 0–100 result. The analyser also generates strengths, improvements, and basic content statistics.

The UI was designed around explicit processing and error states so users can see what the application is doing during extraction and analysis. Keeping the pipeline client-side also means uploaded content does not need to leave the user's device.

The current implementation deliberately uses deterministic heuristics rather than an external LLM, making the scoring transparent and reproducible. The architecture leaves room for more advanced semantic analysis in future iterations.

## Features

- PDF, PNG, JPG, and JPEG support
- Drag-and-drop uploads
- PDF text extraction with PDF.js
- OCR with Tesseract.js
- Automatic OCR fallback for scanned PDFs
- Extraction progress and processing states
- Explainable scoring across five content dimensions
- Targeted strengths and improvement suggestions
- Extracted-text preview with one-click copying
- Client-side processing with no required API keys
- Responsive interface

### Scoring

The analysis engine evaluates five dimensions using weighted scores:

| Metric | Weight |
| --- | ---: |
| Hook | 25% |
| Clarity | 20% |
| Readability | 20% |
| Engagement | 20% |
| Call to action | 15% |

The weighted result is normalized to a `0–100` score.

---

## Tech Stack

- **Next.js** — application framework
- **React** — user interface
- **TypeScript** — type-safe application logic
- **Tailwind CSS** — styling
- **PDF.js** — PDF text extraction
- **Tesseract.js** — browser-based OCR

The analysis engine is deterministic and does not depend on an external AI model.

---

## Architecture

ContentIQ keeps extraction, analysis, and presentation separate so that each part of the pipeline can evolve independently.

### Extraction

`lib/pdf.ts` handles PDF text extraction and determines when scanned content requires OCR.

`lib/ocr.ts` handles OCR for images and scanned documents using Tesseract.js.

### Analysis

`lib/analyser.ts` contains the content scoring engine.

Extracted text is converted into a typed `AnalysisResult` containing:

- overall score
- individual metric scores
- strengths
- improvements
- content statistics

The analysis engine has no dependency on the React UI.

### Presentation

React components handle file selection, processing states, extracted text, and analysis results. They consume the output of the extraction and analysis layers rather than implementing that logic themselves.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Rick7118/social-media-content-analyzer-.git
cd social-media-content-analyzer
npm install
```

### Development

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## How It Works

### 1. Validate

The application validates the uploaded file before processing it, including its format and size.

The maximum supported file size is **10 MB**.

### 2. Extract

Text-based PDFs are processed with PDF.js. Images and scanned PDFs are processed with Tesseract.js when OCR is required.

### 3. Analyze

The extracted text is evaluated for structural signals such as:

- opening and hook patterns
- sentence length
- vague wording
- interaction signals
- call-to-action language

### 4. Score

Each metric contributes to the final score according to its weight:

```text
Overall Score =
    Hook          × 0.25
  + Clarity       × 0.20
  + Readability   × 0.20
  + Engagement    × 0.20
  + CTA           × 0.15
```

### 5. Recommend

Metric scores and detected signals are used to generate specific strengths and improvement suggestions.

---

## Privacy

Content extraction and analysis happen locally in the browser.

Uploaded files do not need to be sent to an application server, and the current analysis engine does not require an external AI API.

---

## Limitations

The current analysis engine is intentionally deterministic. It evaluates structural signals rather than attempting full semantic understanding.

It can identify patterns such as sentence length, questions, CTA language, and interaction signals, but it cannot reliably judge factual accuracy, humor, audience fit, or overall creative quality.

OCR accuracy can also vary with image resolution, text size, contrast, and background complexity.

---

## Roadmap

Potential future improvements include:

- Automated tests for the analysis engine
- More context-aware recommendations
- Platform-specific scoring
- Optional LLM-based semantic analysis
- Version comparison
- Historical score tracking
- Exportable analysis reports

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

This project is provided for evaluation and portfolio purposes.