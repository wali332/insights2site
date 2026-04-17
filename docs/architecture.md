# Architecture

## 1) System Overview

Insights2Site is a Next.js application that transforms unstructured customer reviews into a conversion-focused one-page website.

Core design choice:
- Use two AI stages instead of one.
- Keep intermediate output structured and editable.

This improves controllability, debugging, and final output quality.

## 2) Top-Level Components

### Frontend

- app/page.tsx
  - Public marketing landing page.
- app/app/page.tsx
  - Review ingestion entry point.
- app/app/dashboard/page.tsx
  - Insight visualization, content editing, design preference selection, and site generation trigger.
- components/input/InputSection.tsx
  - CSV upload, parsing, column selection, review pipeline text construction.
- hooks/useGenerate.ts
  - Client orchestration and cache state manager.
- services/api.ts
  - Typed API client wrappers.

### Backend Routes

- app/api/upload/route.ts
  - Persists uploaded CSV to disk.
- app/api/generate/route.ts
  - Stage 1 AI: review analysis and structured output generation.
- app/api/save-response/route.ts
  - Persists dashboard draft artifacts.
- app/api/generate-html/route.ts
  - Stage 2 AI: website HTML generation and image URL validation.

### Shared Types

- types/index.ts
  - Canonical contracts shared across frontend and backend.

## 3) Two-Stage AI Architecture

### Stage 1: Intelligence and Copy Structuring

Input: cleaned review text.
Output: GenerateResponse JSON with:
- insight clusters
- website copy primitives
- recommendations for style, tone, audience, palette
- generation reasons

### Stage 2: Website Rendering

Input: edited GenerateResponse plus user preferences.
Output: complete HTML page string.

## 4) Persistence Layers

### Browser Persistence

localStorage keys:
- insight2site.generate.response.v1
- insight2site.generated.html.v1

Used for:
- dashboard resume
- generated site actions (open/download)

### Server Persistence

Filesystem locations:
- public/uploads/product_reviews.csv
- public/uploads/json/*.json
- public/uploads/html/*.html

Purpose:
- reproducibility
- auditability
- debugging

## 5) Model Strategy

Model fallback chain is implemented for resiliency. If one model fails, another candidate is attempted.

Generation endpoints return typed error messages with status-aware behavior.

## 6) Why This Architecture Works

- Separates reasoning stage from rendering stage.
- Allows human-in-the-loop edits before final HTML generation.
- Maintains transparent artifacts for demo and troubleshooting.
- Enables reproducible transformations across every stage.