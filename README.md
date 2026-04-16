# Insights2Site

Insights2Site turns customer reviews into a generated website. Paste review text or upload a CSV, extract insights, customize the copy on the dashboard, then generate and preview a full HTML landing page.

## What It Does

- Converts raw customer feedback into structured insights.
- Generates homepage copy such as headline, subheadline, benefits, testimonials, CTA, and brand name suggestions.
- Lets you edit the generated draft before final output.
- Produces a complete HTML landing page and lets you download it.
- Persists generated JSON and HTML artifacts locally under `public/uploads`.

## Main Routes

- `/` - Marketing landing page.
- `/app` - Review upload and CSV onboarding flow.
- `/app/dashboard` - AI insights editor and site generator.
- `/api/generate` - Builds structured insight and copy data from reviews.
- `/api/save-response` - Persists the generated dashboard response.
- `/api/generate-html` - Generates the final HTML landing page.

## Requirements

- Node.js 20 or newer.
- A Gemini API key.

## Environment Variables

Create a `.env.local` file in the project root and add:

```bash
GEMINI_API_KEY=your_api_key_here
# Optional
GEMINI_MODEL=gemini-3-flash-preview
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Typical Flow

1. Open `/app` and upload a CSV or paste review data.
2. Generate insights and review the extracted copy.
3. Open `/app/dashboard` to edit the generated content and brand fields.
4. Click `Generate Site` to build the HTML preview.
5. Use `Open Site` to view the generated page in a new tab.
6. Use `Download HTML` to save the generated file locally.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Notes

- The app uses the Next.js App Router.
- Generated JSON is cached in the browser and also written to `public/uploads/json`.
- Generated HTML is written to `public/uploads/html`.
- The dashboard loading state is shown while HTML generation is in progress.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Google Gemini API

## Deployment

This project can be deployed like a standard Next.js app. Make sure the Gemini API key is configured in the target environment.
