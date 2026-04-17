# Prompt Design

Insights2Site uses two prompts with different goals.

## Prompt 1: Structured Insight and Copy Generation

Location:
- app/api/generate/route.ts
- buildPrompt(formattedReviews)

### Role and Objective

- Role: product marketing strategist and UX researcher.
- Objective: convert review text into strict JSON only.

### Prompt Content (Conceptual)

Instructions include:
- Analyze reviews deeply.
- Extract strengths, pain points, customer types, and keywords.
- Generate website copy primitives:
  - headline
  - subheadline
  - features
  - testimonials
  - cta
  - why_choose_us
- Suggest a company name.
- Select defaults for style, tone, and audience from fixed allowed values.
- Generate exactly three color palettes with hex colors.
- Provide generation reasons per section.

### Required JSON Output Fields

- strengths
- pain_points
- customer_types
- keywords
- headline
- subheadline
- features
- testimonials
- cta
- why_choose_us
- company_name
- tone
- preferred_style
- preferred_tone
- preferred_audience
- color_palettes
- preferred_color_palette
- generation_reasons

### Why This Prompt Works

- Forces schema output to reduce parsing ambiguity.
- Encodes conversion-focused content requirements.
- Produces both content and rationale for dashboard explainability.

## Prompt 2: Full HTML Site Generation

Location:
- app/api/generate-html/route.ts
- buildPrompt(payload)

### Role and Objective

- Role: frontend engineer + CRO web designer.
- Objective: produce complete final HTML page from structured payload.

### Prompt Content (Conceptual)

The prompt includes:
- Full payload JSON as context data.
- Strict structural constraints:
  - complete html/head/body
  - tailwind CDN
  - required sections: hero, benefits, testimonials, cta, footer
- Quality and density constraints:
  - content-rich page
  - minimum visible word count target
  - at least one additional context section when possible
  - non-empty meaningful section copy
- Image constraints:
  - real image URLs
  - minimum image count
  - contextual alt text
- Accessibility and semantic requirements.
- Dynamic customization hints:
  - style, tone, audience, palette, companyName

### Output Contract

- Response must contain only HTML text.
- Server validates HTML shape and image URL health after generation.

## Design Rationale for Two-Prompt Strategy

Prompt 1 and Prompt 2 are intentionally separated:

- Prompt 1 focuses on extracting structured intent from noisy language.
- Prompt 2 focuses on rendering that intent into layout and visual output.

This avoids overloading one prompt and gives better control in a production UX where users can edit between stages.

## Common Failure Protection

### Stage 1

- Invalid JSON output is trapped and surfaced clearly.
- Fallback defaults are applied when optional content is missing.

### Stage 2

- HTML document shape is validated.
- Broken image links are replaced with reliable fallback images.

## Prompt Tuning Notes

To tune quality in the future, adjust:

- Prompt 1:
  - stricter evidence extraction rules
  - richer reason-generation guidance
- Prompt 2:
  - layout density requirements
  - section-specific constraints
  - image sourcing strategy

Always keep schema compatibility with types/index.ts when modifying prompt 1.