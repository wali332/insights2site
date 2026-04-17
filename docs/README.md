# Insights2Site Documentation

This documentation set explains the system end to end, from raw customer reviews to generated website output.

## Documentation Map

- architecture.md
  - High-level system architecture and component responsibilities.
- data-pipeline.md
  - Full data lifecycle with structures at each stage.
- api-reference.md
  - Route-by-route API contracts, request/response schemas, and failure modes.
- prompts.md
  - Prompt engineering design for both Gemini stages.
- frontend-workflow.md
  - User journey and frontend state flow.
- problem-statement-mapping.md
  - Mapping between hackathon requirements and implementation.
- operations-security.md
  - Runtime behavior, persistence, logging, and security checklist.

## Quick Start for Readers

If you want to understand this project fast, read in this order:

1. architecture.md
2. data-pipeline.md
3. prompts.md
4. problem-statement-mapping.md

## Scope of the Platform

Insights2Site implements a two-stage AI pipeline:

1. Stage 1: Review intelligence extraction and conversion-oriented copy generation.
2. Stage 2: Full one-page website generation from structured output.

This architecture is intentionally designed to separate reasoning-heavy analysis from layout-heavy rendering.