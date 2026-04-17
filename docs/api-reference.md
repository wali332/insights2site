# API Reference

## POST /api/upload

Purpose:
- Persist uploaded CSV content.

Request:
{
  "content": "string"
}

Success response:
{
  "ok": true,
  "path": "/public/uploads/product_reviews.csv"
}

Error cases:
- 400 if content missing or empty.
- 500 on filesystem failure.

## POST /api/generate

Purpose:
- Stage 1 AI generation: review text to structured insight/copy JSON.

Request:
{
  "text": "string"
}

Success response:
- GenerateResponse object (see types/index.ts).

Error cases:
- 400 for invalid input or no valid cleaned reviews.
- 429 for quota-related model exhaustion.
- 502 for generation failures.

Behavior details:
- Cleans and limits reviews.
- Generates prompt and calls Gemini.
- Parses strict JSON.
- Normalizes output and applies safe fallbacks.
- Persists cleaned/raw/normalized artifacts.

## POST /api/save-response

Purpose:
- Persist dashboard draft JSON for artifact trail.

Request:
- GenerateResponse object.

Success response:
{
  "ok": true,
  "fileName": "dashboard-timestamp.result.json"
}

Error cases:
- 400 invalid payload.
- 500 write failure.

## POST /api/generate-html

Purpose:
- Stage 2 AI generation: structured payload to final HTML website.

Request:
- GenerateHtmlRequest
  - response: GenerateResponse
  - preferences?: HtmlGenerationPreferences

Success response:
{
  "html": "full html string"
}

Error cases:
- 400 invalid payload.
- 502 generation failure.

Behavior details:
- Builds strict HTML prompt.
- Calls Gemini with model fallback list.
- Validates returned HTML shape.
- Validates image URLs and replaces broken links.
- Persists generated HTML artifacts.

## API Contracts Source of Truth

All shared API data contracts are defined in:
- types/index.ts