import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { GenerateHtmlRequest } from '../../../types';

export const runtime = 'nodejs';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
const GEMINI_MODEL_CANDIDATES = [
  GEMINI_MODEL,
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
];
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'html');

const normalizeModelName = (modelName: string): string => modelName.replace(/^models\//, '').trim();

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

const extractHtml = (rawText: string): string => {
  const fencedHtmlMatch = rawText.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
  if (fencedHtmlMatch?.[1]) {
    return fencedHtmlMatch[1].trim();
  }

  const htmlStart = rawText.search(/<!doctype html>|<html/i);
  if (htmlStart !== -1) {
    return rawText.slice(htmlStart).trim();
  }

  return rawText.trim();
};

const buildPrompt = (payload: GenerateHtmlRequest): string => {
  const preferences = payload.preferences || {};

  return [
    'You are an expert frontend engineer and CRO-focused web designer.',
    'Generate a complete HTML landing page using Tailwind CSS.',
    '',
    'CONTEXT DATA (JSON):',
    JSON.stringify(payload, null, 2),
    '',
    'STRICT RULES:',
    '- Use proper HTML structure (<html>, <head>, <body>)',
    '- Include Tailwind CDN',
    '- Sections MUST include:',
    '  - Hero',
    '  - Benefits',
    '  - Testimonials',
    '  - CTA',
    '  - Footer',
    '- Use clean, modern layout',
    '- No inline styles',
    '- No broken HTML',
    '- Return ONLY HTML code (no explanation)',
    '',
    'IMAGE RULES:',
    '- Use placeholder images only.',
    '- Use URLs like https://placehold.co/1200x700?text=Hero+Image and similar.',
    '- Every image must include meaningful alt text.',
    '',
    'QUALITY RULES:',
    '- Mobile-first responsive layout.',
    '- Semantic HTML tags where appropriate (header, section, footer, main).',
    '- Accessible contrast and readable typography.',
    '- Keep content grounded in provided insights and website copy.',
    '',
    'CUSTOMIZATION HINTS:',
    `- Preferred style: ${preferences.style || 'Modern SaaS'}`,
    `- Preferred tone: ${preferences.tone || 'Professional'}`,
    `- Preferred audience: ${preferences.audience || 'General'}`,
  ].join('\n');
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

const callGeminiForHtml = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY (or GOOGLE_API_KEY).');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = uniqueModels(GEMINI_MODEL_CANDIDATES);
  const errors: string[] = [];

  for (const model of modelsToTry) {
    try {
      const sdkResponse = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      });

      const rawText = typeof sdkResponse.text === 'string' ? sdkResponse.text : '';
      const html = extractHtml(rawText);

      if (!html || !/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) {
        errors.push(`${model}: missing complete HTML document in response`);
        continue;
      }

      return html;
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      const message = error instanceof Error ? error.message : 'Unknown Gemini SDK error.';
      errors.push(`${model} (${statusCode ?? 'unknown'}): ${message}`);
      continue;
    }
  }

  throw new Error(`Gemini HTML generation failed: ${errors.join(' | ')}`);
};

const persistHtmlArtifact = async (html: string) => {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `render-${timestamp}.html`;

  await Promise.all([
    writeFile(path.join(OUTPUT_DIR, fileName), html, 'utf8'),
    writeFile(path.join(OUTPUT_DIR, 'latest.generated.html'), html, 'utf8'),
  ]);

  return fileName;
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as GenerateHtmlRequest;

    if (!body?.response || !body.response.website || !Array.isArray(body.response.insights)) {
      return NextResponse.json({ error: 'Invalid payload. response.website and response.insights are required.' }, { status: 400 });
    }

    const prompt = buildPrompt(body);
    const html = await callGeminiForHtml(prompt);

    try {
      await persistHtmlArtifact(html);
    } catch (persistError) {
      console.error('Failed to persist generated HTML artifact', persistError);
    }

    return NextResponse.json({ html });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.';
    console.error('Generate HTML error', error);
    return NextResponse.json({ error: `HTML generation failed: ${message}` }, { status: 502 });
  }
};
