# Operations and Security

## Runtime and Dependencies

- Framework: Next.js 16
- UI: React 19 + Tailwind CSS 4
- AI SDK: @google/genai
- Runtime target for API routes: nodejs

## Environment Configuration

Required:
- GEMINI_API_KEY

Optional:
- GEMINI_MODEL

Guidelines:
- Keep real secrets in .env.local only.
- Track .env.example as template.
- Never commit .env.local.

## Artifact Management

Generated artifacts are useful for debugging but can contain sensitive user-derived content.

Typical artifact locations:
- public/uploads/product_reviews.csv
- public/uploads/json/*.json
- public/uploads/html/*.html

Recommendation:
- keep public/uploads ignored in git for public repos.

## Error Handling Strategy

### Stage 1 generation route

- 400 for invalid/empty input.
- 429 for quota exhaustion conditions.
- 502 for downstream generation errors.

### Stage 2 generation route

- 400 for invalid payload shape.
- 502 for model or output extraction failures.

## Reliability Controls

- Model fallback candidate list for AI calls.
- JSON parsing hardening for Stage 1.
- HTML shape validation for Stage 2.
- Broken image URL fallback replacement.

## Data Privacy Notes

Potentially sensitive content:
- uploaded customer reviews
- generated insights and rationale
- generated websites with business context

For public releases:
- verify tracked files exclude all upload artifacts.
- validate no real secrets exist in source files.

## Suggested Pre-Publish Checklist

1. Confirm .env.local is not tracked.
2. Confirm only .env.example is tracked for env templates.
3. Confirm public/uploads is ignored and untracked.
4. Run targeted grep scan for secret patterns.
5. Review git status before pushing.

## Local Verification Commands

- Check tracked env files:
  git ls-files .env* 

- Check tracked upload artifacts:
  git ls-files | grep '^public/uploads/'

- Quick secret pattern scan:
  grep -RIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git -E 'GEMINI_API_KEY|GOOGLE_API_KEY|BEGIN (RSA|OPENSSH|PRIVATE) KEY|ghp_' .

## Operational Note

This system is optimized for hackathon and demo velocity with strong explainability. For production hardening, add:
- auth and per-user tenancy
- object storage instead of public folder artifacts
- retention policies
- audit logs and PII governance