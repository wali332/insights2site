# Frontend Workflow

## 1) Review Upload Page

Route:
- /app

Main component:
- components/input/InputSection.tsx

Behavior:
- Upload CSV.
- Parse rows and headers in browser.
- Choose the review column.
- Preview extracted review lines.
- Build review pipeline text.
- Trigger generation and navigate to dashboard.

## 2) Generation Hook Lifecycle

Hook:
- hooks/useGenerate.ts

Responsibilities:
- call /api/generate and /api/generate-html
- cache response and HTML in localStorage
- expose loading and error states
- hydrate dashboard from cache

Cache keys:
- insight2site.generate.response.v1
- insight2site.generated.html.v1

## 3) Dashboard Page

Route:
- /app/dashboard

Main file:
- app/app/dashboard/page.tsx

Behavior:
- Hydrates cached response.
- Shows pain and desire insights.
- Displays editable fields for website content.
- Applies customization controls for style, tone, audience, palette.
- Shows why-generated reasoning when available.
- Sends edited draft to HTML generation route.

## 4) Preview and Download UX

After HTML generation success:
- generatedHtml state is populated.
- Download and Open Site actions become visible.

Actions:
- Open Site:
  - writes generated HTML into a new browser tab.
- Download:
  - creates Blob from HTML and downloads filename based on company name and date.

## 5) Error and Loading UX

- While HTML is being generated, generatingHtml displays progress feedback.
- If generation fails, dashboard shows a clear failure message.
- If popup is blocked, Open Site reports browser popup restrictions.

## 6) User-Controlled Conversion Loop

The platform intentionally keeps users in the loop:

- AI suggests first draft.
- User edits conversion copy.
- AI renders final site from edited draft.

This produces higher trust and better practical usability than fully opaque one-shot generation.