# Problem Statement Mapping

Hackathon problem:
- Build a system that transforms raw reviews into a high-converting one-page website.
- Demonstrate pipeline from raw data to structured insights to final output.
- Emphasize reasoning, pattern recognition, and practical usability.

## Requirement-to-Implementation Mapping

### 1) Raw customer reviews as input

Implemented by:
- CSV upload and parsing in InputSection.
- Explicit review-column selection to avoid schema assumptions.

### 2) Extract motivations, strengths, weaknesses, recurring patterns

Implemented by Stage 1 prompt and normalization:
- strengths
- pain_points
- keywords
- customer_types

Plus mapped Insight objects with typed categories:
- pain
- desire
- keyword

### 3) Generate structured website content

Implemented outputs include:
- headline
- subheadline
- benefits/features
- testimonials (social proof)
- cta
- why_choose_us
- company name suggestion

### 4) Convert insights into final one-page site

Implemented by Stage 2 prompt and HTML route:
- required major sections
- conversion-oriented copy rules
- mobile-first semantic structure
- image inclusion and validation

### 5) Show pipeline clarity from raw data to final output

Implemented through:
- clear API stage separation
- artifacts persisted at each step
- dashboard as transparent editable middle layer
- documentation and traceable type contracts

### 6) Reasoning and usability over one-shot generation

Implemented through two-stage architecture:
- stage 1 reasoning and structuring
- human edit checkpoint
- stage 2 rendering from edited structured data

This gives practical control while preserving AI speed.

## What Makes This Production-Grade for Demo

- Typed contracts across frontend and backend.
- Error handling with model fallback behavior.
- Cached state to avoid repeated work.
- Artifact persistence for audits and explanation.
- Explicit UX actions for preview and download.