# Data Pipeline

This document describes exact data formats and transformations from input to final site.

## Stage 0: Raw Input

### Source

User uploads CSV in the dashboard intake page.

### Initial shape in frontend memory

CsvUploadState fields in InputSection:
- fileName: string
- rowCount: number
- headers: string[]
- rows: string[][]
- selectedColumnIndex: number
- savedToServer: boolean
- error: string | null
- saving: boolean

## Stage 1: CSV Persistence

Endpoint:
- POST /api/upload

Request body:
{
  "content": "raw,csv,text,..."
}

Response body:
{
  "ok": true,
  "path": "/public/uploads/product_reviews.csv"
}

Stored artifact:
- public/uploads/product_reviews.csv

## Stage 2: Review Text Construction

InputSection converts selected review column values to pipeline text:

Your Product Reviews:
review line 1
review line 2
review line 3
...

This becomes body.text for Stage 1 generation.

## Stage 3: Stage 1 AI Request

Endpoint:
- POST /api/generate

Request body:
{
  "text": "Your Product Reviews:\n..."
}

## Stage 4: Stage 1 Data Cleaning

Server applies:
- line splitting and trimming
- remove empty lines
- remove header-like noise
- minimum review length: 20
- maximum reviews: 60

If no valid lines remain, request fails with 400.

## Stage 5: Stage 1 AI Output (Raw)

Gemini returns JSON matching the requested schema.
Raw object is first parsed, then normalized.

## Stage 6: Stage 1 Normalized Output

Canonical response type: GenerateResponse

Structure:
- insights: Insight[]
  - id: string
  - type: pain | desire | keyword
  - text: string
  - usedIn: string
- website: Website
  - hero: { headline, subheadline, source? }
  - benefits: string[] or { items: string[], source? }
  - headline: string
  - subheadline: string
  - benefitsList?: string[]
  - testimonials: string[]
  - cta: string
  - why_choose_us?: string[]
  - companyName?: string
- tone?: string
- recommendations?:
  - preferredStyle?: string
  - preferredTone?: string
  - preferredAudience?: string
  - colorPalettes?: { name, colors, description? }[]
  - preferredColorPalette?: string
  - generationReasons?:
    - headline?: string[]
    - subheadline?: string[]
    - cta?: string[]
    - benefits?: string[]
    - testimonials?: string[]
    - whyChooseUs?: string[]

## Stage 7: Stage 1 Artifacts Persisted

Files written in public/uploads/json:
- generation-timestamp.reviews.cleaned.json
- generation-timestamp.gemini.raw.json
- generation-timestamp.result.json
- latest.result.json

## Stage 8: Client Cache and Draft Persistence

In useGenerate:
- Write GenerateResponse to localStorage key insight2site.generate.response.v1
- POST same object to /api/save-response for server-side draft persistence

Draft files:
- dashboard-timestamp.result.json
- latest.dashboard.result.json

## Stage 9: Dashboard Editing Layer

User edits:
- companyName
- headline
- subheadline
- cta
- benefits list
- testimonials list
- why_choose_us list
- style, tone, audience, palette selection

Function buildCurrentDraftFromState merges edits into a new GenerateResponse.

## Stage 10: Stage 2 AI Request

Endpoint:
- POST /api/generate-html

Request type: GenerateHtmlRequest

Body:
{
  "response": "GenerateResponse object",
  "preferences": {
    "style": "string",
    "tone": "string",
    "audience": "string",
    "colorPalette": {
      "name": "string",
      "colors": ["#hex", "..."],
      "description": "optional"
    },
    "companyName": "string"
  }
}

## Stage 11: Stage 2 AI Output and Validation

Gemini returns full HTML text.
Server then:
- extracts HTML from response
- checks for valid html/body structure
- scans image URLs in img tags
- sends HEAD validation request per image URL
- replaces broken image URLs with fallback Unsplash URLs

## Stage 12: Stage 2 Artifacts and Client Output

Server writes:
- public/uploads/html/render-timestamp.html
- public/uploads/html/latest.generated.html

Response body:
{
  "html": "<!doctype html>..."
}

Client stores HTML in:
- state: generatedHtml
- localStorage: insight2site.generated.html.v1

UI then enables actions:
- Open Site
- Download

## Pipeline Summary

CSV -> cleaned reviews -> structured insights/copy JSON -> editable draft -> final HTML website -> open/download.