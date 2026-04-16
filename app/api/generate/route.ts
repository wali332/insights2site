import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { ColorPaletteOption, DashboardGenerationReasons, GenerateResponse, Insight, InsightType } from '../../../types';

export const runtime = 'nodejs';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
const GEMINI_MODEL_CANDIDATES = [
  GEMINI_MODEL,
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash',
];
const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEWS = 60;
const GENERATION_OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'json');

type GeminiStructuredOutput = {
  strengths?: unknown;
  pain_points?: unknown;
  customer_types?: unknown;
  keywords?: unknown;
  headline?: unknown;
  subheadline?: unknown;
  features?: unknown;
  testimonials?: unknown;
  cta?: unknown;
  why_choose_us?: unknown;
  tone?: unknown;
  preferred_style?: unknown;
  preferred_tone?: unknown;
  preferred_audience?: unknown;
  color_palettes?: unknown;
  preferred_color_palette?: unknown;
  generation_reasons?: unknown;
};

type GeminiErrorPayload = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{
      '@type'?: string;
      retryDelay?: string;
    }>;
  };
};

class GenerateRouteError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GenerateRouteError';
    this.status = status;
  }
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
};

const sanitizeText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const VALID_STYLES = ['Modern SaaS', 'Bold Marketing', 'Minimal Clean'] as const;
const VALID_TONES = ['Professional', 'Friendly', 'Playful'] as const;
const VALID_AUDIENCES = ['Startups', 'Local Business', 'Enterprise'] as const;

const normalizeAllowedValue = (
  value: unknown,
  allowed: readonly string[],
  fallback: string
): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const candidate = value.trim().toLowerCase();
  const match = allowed.find((item) => item.toLowerCase() === candidate);
  return match || fallback;
};

const isValidHexColor = (value: string): boolean => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value);

const normalizeColorPalettes = (value: unknown): ColorPaletteOption[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const palette = item as { name?: unknown; colors?: unknown; description?: unknown };
      const name = sanitizeText(palette.name, `Palette ${index + 1}`);
      const colors = Array.isArray(palette.colors)
        ? palette.colors
            .filter((color): color is string => typeof color === 'string')
            .map((color) => color.trim())
            .filter((color) => isValidHexColor(color))
            .slice(0, 5)
        : [];

      if (colors.length < 3) {
        return null;
      }

      return {
        name,
        colors,
        description: typeof palette.description === 'string' ? palette.description.trim() : undefined,
      } as ColorPaletteOption;
    })
    .filter((item): item is ColorPaletteOption => item !== null)
    .slice(0, 3);
};

const normalizeGenerationReasons = (value: unknown): DashboardGenerationReasons => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const raw = value as Record<string, unknown>;

  return {
    headline: toStringArray(raw.headline).slice(0, 3),
    subheadline: toStringArray(raw.subheadline).slice(0, 3),
    cta: toStringArray(raw.cta).slice(0, 3),
    benefits: toStringArray(raw.benefits).slice(0, 3),
    testimonials: toStringArray(raw.testimonials).slice(0, 3),
    whyChooseUs: toStringArray(raw.why_choose_us || raw.whyChooseUs).slice(0, 3),
  };
};

const extractJsonString = (rawText: string): string => {
  const fencedJsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedJsonMatch && fencedJsonMatch[1]) {
    return fencedJsonMatch[1].trim();
  }

  const firstBraceIndex = rawText.indexOf('{');
  const lastBraceIndex = rawText.lastIndexOf('}');

  if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
    return rawText.slice(firstBraceIndex, lastBraceIndex + 1).trim();
  }

  return rawText.trim();
};

const safeJsonParse = (rawText: string): GeminiStructuredOutput => {
  const candidate = extractJsonString(rawText);

  try {
    const parsed = JSON.parse(candidate);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Gemini output is not a JSON object.');
    }

    return parsed as GeminiStructuredOutput;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse error.';
    throw new Error(`Invalid JSON from Gemini: ${message}`);
  }
};

const cleanAndLimitReviews = (text: string): string[] => {
  const normalizedLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !/^your product reviews\s*:?$/i.test(line))
    .map((line) => line.replace(/^\d+[.)-]?\s+/, '').trim())
    .filter((line) => line.length >= MIN_REVIEW_LENGTH);

  return normalizedLines.slice(0, MAX_REVIEWS);
};

const formatReviewsForPrompt = (reviews: string[]): string => {
  return reviews.map((review, index) => `${index + 1}. ${review}`).join('\n');
};

const buildPrompt = (formattedReviews: string): string => {
  return [
    'You are a product marketing strategist and UX researcher.',
    'Analyze the customer reviews and return strictly valid JSON only.',
    'Do not include markdown, explanations, or code fences.',
    '',
    'Tasks:',
    '- Analyze reviews deeply.',
    '- Extract strengths, pain_points, customer_types, keywords.',
    '- Generate headline, subheadline, features (3-5), testimonials (2-3), cta, why_choose_us.',
    '- Pick dashboard defaults for style, tone, and audience using ONLY allowed values.',
    '- Generate exactly 3 distinct color palettes (each with 3-5 hex colors).',
    '- For each generated section, provide concise reasons grounded in review evidence explaining why that copy was chosen.',
    '',
    'Output JSON schema:',
    '{',
    '  "strengths": ["..."],',
    '  "pain_points": ["..."],',
    '  "customer_types": ["..."],',
    '  "keywords": ["..."],',
    '  "headline": "...",',
    '  "subheadline": "...",',
    '  "features": ["..."],',
    '  "testimonials": ["..."],',
    '  "cta": "...",',
    '  "why_choose_us": ["..."],',
    '  "tone": "modern",',
    '  "preferred_style": "Modern SaaS | Bold Marketing | Minimal Clean",',
    '  "preferred_tone": "Professional | Friendly | Playful",',
    '  "preferred_audience": "Startups | Local Business | Enterprise",',
    '  "color_palettes": [',
    '    { "name": "...", "description": "...", "colors": ["#111827", "#4F46E5", "#F9FAFB"] },',
    '    { "name": "...", "description": "...", "colors": ["#0F172A", "#06B6D4", "#F8FAFC"] },',
    '    { "name": "...", "description": "...", "colors": ["#1F2937", "#F59E0B", "#FFF7ED"] }',
    '  ],',
    '  "preferred_color_palette": "name of one palette from color_palettes",',
    '  "generation_reasons": {',
    '    "headline": ["..."],',
    '    "subheadline": ["..."],',
    '    "cta": ["..."],',
    '    "benefits": ["..."],',
    '    "testimonials": ["..."],',
    '    "why_choose_us": ["..."]',
    '  }',
    '}',
    '',
    'Allowed values:',
    '- preferred_style: Modern SaaS, Bold Marketing, Minimal Clean',
    '- preferred_tone: Professional, Friendly, Playful',
    '- preferred_audience: Startups, Local Business, Enterprise',
    '',
    'Customer reviews:',
    formattedReviews,
  ].join('\n');
};

const buildInsights = (painPoints: string[], strengths: string[], keywords: string[]): Insight[] => {
  const insights: Insight[] = [];
  let idCounter = 1;

  const appendInsights = (items: string[], type: InsightType, usedIn: string) => {
    for (const item of items) {
      insights.push({
        id: `i${idCounter}`,
        type,
        text: item,
        usedIn,
      });
      idCounter += 1;
    }
  };

  appendInsights(painPoints.slice(0, 3), 'pain', 'benefits');
  appendInsights(strengths.slice(0, 3), 'desire', 'hero');
  appendInsights(keywords.slice(0, 2), 'keyword', 'cta');

  if (insights.length === 0) {
    insights.push(
      {
        id: 'i1',
        type: 'pain',
        text: 'Users report onboarding friction and unclear setup.',
        usedIn: 'benefits',
      },
      {
        id: 'i2',
        type: 'desire',
        text: 'Users want a simple, intuitive product experience.',
        usedIn: 'hero',
      }
    );
  }

  return insights;
};

const normalizeGeminiOutput = (output: GeminiStructuredOutput): GenerateResponse => {
  const strengths = toStringArray(output.strengths);
  const painPoints = toStringArray(output.pain_points);
  const keywords = toStringArray(output.keywords);

  const features = toStringArray(output.features).slice(0, 5);
  const testimonials = toStringArray(output.testimonials).slice(0, 3);

  const safeFeatures = features.length > 0
    ? features
    : ['Easy setup', 'Clear workflows', 'Reliable daily performance'];

  const safeTestimonials = testimonials.length > 0
    ? testimonials
    : ['This solved the problem we were struggling with most.'];

  const whyChooseUsArray = Array.isArray(output.why_choose_us)
    ? toStringArray(output.why_choose_us)
    : typeof output.why_choose_us === 'string' && output.why_choose_us.trim().length > 0
      ? [output.why_choose_us.trim()]
      : [];

  const headline = sanitizeText(output.headline, 'A Simpler Experience Built from Real Customer Feedback');
  const subheadline = sanitizeText(
    output.subheadline,
    'Insight-driven messaging and UX direction powered by what users actually say.'
  );
  const cta = sanitizeText(output.cta, 'Get Started');
  const tone = sanitizeText(output.tone, 'modern');
  const preferredStyle = normalizeAllowedValue(output.preferred_style, VALID_STYLES, 'Modern SaaS');
  const preferredTone = normalizeAllowedValue(output.preferred_tone, VALID_TONES, 'Professional');
  const preferredAudience = normalizeAllowedValue(output.preferred_audience, VALID_AUDIENCES, 'Startups');
  const parsedColorPalettes = normalizeColorPalettes(output.color_palettes);
  const generationReasons = normalizeGenerationReasons(output.generation_reasons);
  const fallbackColorPalettes: ColorPaletteOption[] = [
    {
      name: 'Modern Indigo',
      description: 'Balanced modern palette for SaaS and product pages.',
      colors: ['#111827', '#4F46E5', '#EEF2FF'],
    },
    {
      name: 'Fresh Teal',
      description: 'Friendly and trust-building palette.',
      colors: ['#0F172A', '#0D9488', '#ECFEFF'],
    },
    {
      name: 'Warm Amber',
      description: 'Bold and energetic conversion-oriented palette.',
      colors: ['#1F2937', '#F59E0B', '#FFF7ED'],
    },
  ];
  const colorPalettes = parsedColorPalettes.length === 3 ? parsedColorPalettes : fallbackColorPalettes;
  const preferredColorPalette = sanitizeText(output.preferred_color_palette, colorPalettes[0].name);
  const preferredColorPaletteName = colorPalettes.some((palette) => palette.name === preferredColorPalette)
    ? preferredColorPalette
    : colorPalettes[0].name;

  const insights = buildInsights(painPoints, strengths, keywords);

  return {
    insights,
    website: {
      hero: {
        headline,
        subheadline,
        source: strengths[0] ? `desire: ${strengths[0]}` : 'desire: easy to use',
      },
      benefits: {
        items: safeFeatures.slice(0, 5),
        source: painPoints[0] ? `pain: ${painPoints[0]}` : 'pain: onboarding friction',
      },
      // Flat keys preserved for existing preview components.
      headline,
      subheadline,
      benefitsList: safeFeatures.slice(0, 5),
      testimonials: safeTestimonials,
      cta,
      why_choose_us: whyChooseUsArray,
    },
    tone,
    recommendations: {
      preferredStyle,
      preferredTone,
      preferredAudience,
      colorPalettes,
      preferredColorPalette: preferredColorPaletteName,
      generationReasons,
    },
  };
};

const normalizeModelName = (modelName: string): string => {
  return modelName.replace(/^models\//, '').trim();
};

const uniqueModels = (models: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const model of models) {
    const normalized = normalizeModelName(model);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

const RETRYABLE_GEMINI_STATUSES = new Set([404, 408, 409, 429, 500, 502, 503, 504]);

const parseGeminiErrorPayload = (errorText: string): GeminiErrorPayload | null => {
  try {
    return JSON.parse(errorText) as GeminiErrorPayload;
  } catch {
    return null;
  }
};

const extractRetryDelaySeconds = (errorText: string): number | null => {
  const payload = parseGeminiErrorPayload(errorText);
  const retryDetail = payload?.error?.details?.find((detail) => detail['@type']?.includes('RetryInfo'));
  const retryDelay = retryDetail?.retryDelay;

  if (typeof retryDelay === 'string') {
    const delayMatch = retryDelay.match(/([\d.]+)s/i);
    if (delayMatch?.[1]) {
      const delayValue = Number(delayMatch[1]);
      if (Number.isFinite(delayValue)) {
        return Math.ceil(delayValue);
      }
    }
  }

  const textMatch = errorText.match(/retry in\s+([\d.]+)s/i);
  if (textMatch?.[1]) {
    const delayValue = Number(textMatch[1]);
    if (Number.isFinite(delayValue)) {
      return Math.ceil(delayValue);
    }
  }

  return null;
};

const getErrorStatusCode = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const maybeStatus = (error as { status?: unknown }).status;
  if (typeof maybeStatus === 'number') {
    return maybeStatus;
  }

  const message = (error as { message?: unknown }).message;
  if (typeof message === 'string') {
    const match = message.match(/\b(4\d\d|5\d\d)\b/);
    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
};

const callGemini = async (prompt: string): Promise<GeminiStructuredOutput> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY (or GOOGLE_API_KEY).');
  }

  const ai = new GoogleGenAI({ apiKey });
  const configuredCandidates = uniqueModels(GEMINI_MODEL_CANDIDATES);
  const modelsToTry = configuredCandidates;

  const errors: string[] = [];
  let sawQuotaError = false;
  let suggestedRetryDelaySeconds: number | null = null;

  for (const model of modelsToTry) {
    try {
      const sdkResponse = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const rawText = typeof sdkResponse.text === 'string' ? sdkResponse.text : '';

      if (!rawText) {
        errors.push(`${model}: empty response text`);
        continue;
      }

      return safeJsonParse(rawText);
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown Gemini SDK error.';
      errors.push(`${model} (${statusCode ?? 'unknown'}): ${errorMessage}`);

      if (statusCode === 429 || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        sawQuotaError = true;
        const parsedDelay = extractRetryDelaySeconds(errorMessage);
        if (parsedDelay !== null) {
          suggestedRetryDelaySeconds = Math.max(suggestedRetryDelaySeconds ?? 0, parsedDelay);
        }
      }

      if (statusCode !== null && RETRYABLE_GEMINI_STATUSES.has(statusCode)) {
        continue;
      }

      if (errorMessage.includes('not found') || errorMessage.includes('NOT_FOUND')) {
        continue;
      }

      throw new Error(`Gemini SDK failure using ${model}: ${errorMessage}`);
    }
  }

  if (sawQuotaError) {
    const retryHint = suggestedRetryDelaySeconds !== null
      ? ` Retry in about ${suggestedRetryDelaySeconds}s.`
      : '';
    throw new GenerateRouteError(
      `Gemini quota exceeded across available models.${retryHint} Check plan/billing and rate limits in Google AI Studio.`,
      429
    );
  }

  throw new Error(`Gemini API failure after trying models: ${errors.join(' | ')}`);
};

const persistGenerationArtifacts = async (
  cleanedReviews: string[],
  geminiOutput: GeminiStructuredOutput,
  normalizedResponse: GenerateResponse
) => {
  await mkdir(GENERATION_OUTPUT_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = `generation-${timestamp}`;

  const cleanedReviewsPayload = {
    count: cleanedReviews.length,
    reviews: cleanedReviews,
  };

  await Promise.all([
    writeFile(
      path.join(GENERATION_OUTPUT_DIR, `${baseName}.reviews.cleaned.json`),
      JSON.stringify(cleanedReviewsPayload, null, 2),
      'utf8'
    ),
    writeFile(
      path.join(GENERATION_OUTPUT_DIR, `${baseName}.gemini.raw.json`),
      JSON.stringify(geminiOutput, null, 2),
      'utf8'
    ),
    writeFile(
      path.join(GENERATION_OUTPUT_DIR, `${baseName}.result.json`),
      JSON.stringify(normalizedResponse, null, 2),
      'utf8'
    ),
    writeFile(
      path.join(GENERATION_OUTPUT_DIR, 'latest.result.json'),
      JSON.stringify(normalizedResponse, null, 2),
      'utf8'
    ),
  ]);
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as { text?: unknown };

    if (typeof body.text !== 'string' || body.text.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid input: reviews text is required.' }, { status: 400 });
    }

    const cleanedReviews = cleanAndLimitReviews(body.text);

    if (cleanedReviews.length === 0) {
      return NextResponse.json(
        {
          error: `No valid reviews after cleaning. Ensure reviews are at least ${MIN_REVIEW_LENGTH} characters long.`,
        },
        { status: 400 }
      );
    }

    const formattedReviews = formatReviewsForPrompt(cleanedReviews);
    const prompt = buildPrompt(formattedReviews);

    const geminiOutput = await callGemini(prompt);
    const response = normalizeGeminiOutput(geminiOutput);

    try {
      await persistGenerationArtifacts(cleanedReviews, geminiOutput, response);
    } catch (persistError) {
      console.error('Artifact persistence error', persistError);
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.';
    console.error('Generate error', error);

    const status = error instanceof GenerateRouteError ? error.status : 502;

    return NextResponse.json(
      {
        error: message.includes('Invalid JSON from Gemini') ? message : `Generation failed: ${message}`,
      },
      { status }
    );
  }
};
