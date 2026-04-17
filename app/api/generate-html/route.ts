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

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1519389950559-0d2936ba7f23?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
];

const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 3000 });
    return response.ok;
  } catch {
    return false;
  }
};

const sanitizeAndValidateImages = async (html: string): Promise<string> => {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const matches = Array.from(html.matchAll(imgRegex));
  
  let validatedHtml = html;
  let imageIndex = 0;

  for (const match of matches) {
    const fullTag = match[0];
    const originalUrl = match[1];
    
    // Validate the URL
    const isValid = await validateImageUrl(originalUrl);
    
    if (!isValid) {
      // Replace with working fallback
      const fallbackUrl = DEFAULT_FALLBACK_IMAGES[imageIndex % DEFAULT_FALLBACK_IMAGES.length];
      validatedHtml = validatedHtml.replace(fullTag, fullTag.replace(originalUrl, fallbackUrl));
    }
    
    imageIndex++;
  }

  return validatedHtml;
};

const buildPrompt = (payload: GenerateHtmlRequest): string => {
  const preferences = payload.preferences || {};
  const currentYear = new Date().getFullYear();

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
    '- Write a full, content-rich landing page. Do not produce a minimal shell.',
    '- Aim for at least 450 visible words across the page.',
    '- Use at least 5 distinct visible sections before the footer when possible.',
    '- Every major section should have a short heading, supporting body copy, and a clear purpose.',
    '- Hero section must contain a headline, a 2-sentence subheadline, and 2 CTA buttons.',
    '- Benefits section must contain 4 meaningful cards or items with at least 1-2 sentences each.',
    '- Include at least one additional context section such as FAQs, process, metrics, or feature comparison if the content allows it.',
    '- Testimonials section must contain at least 3 distinct testimonials with realistic attribution if available.',
    '- CTA section must include persuasive supporting copy, not just a button.',
    '- Footer must include company name plus at least one short support or trust line.',
    '- Do not leave any section visually empty; if a section is included, it must have real copy and a clear reason for existing.',
    '',
    'IMAGE RULES:',
    '- Include at least 2 real images in the final page (not placeholders).',
    '- Use one strong hero image and at least one supporting image in another section.',
    '- Use real stock image URLs from Unsplash: https://images.unsplash.com/photo-ID?w=WIDTH&h=HEIGHT&fit=crop',
    '- Generate realistic Unsplash URLs with valid photo IDs (e.g., 1519389950559-0d2936ba7f23, 1552664730-d307ca884978).',
    '- Examples: https://images.unsplash.com/photo-1519389950559-0d2936ba7f23?w=1200&h=700&fit=crop',
    '- Choose images relevant to the company/industry (tech, business, lifestyle, etc. as appropriate).',
    '- Every image must include meaningful alt text that matches the page context and company.',
    '',
    'QUALITY RULES:',
    '- Mobile-first responsive layout.',
    '- Semantic HTML tags where appropriate (header, section, footer, main).',
    '- Accessible contrast and readable typography.',
    '- Keep content grounded in provided insights and website copy.',
    `- Footer copyright MUST include the current year (${currentYear}).`,
    '- If company name is provided, use it consistently in nav/branding, hero context, metadata title, and image captions where relevant.',
    '- Images should support the company/topic rather than feeling generic or decorative.',
    '',
    'CUSTOMIZATION HINTS:',
    `- Preferred style: ${preferences.style || 'Modern SaaS'}`,
    `- Preferred tone: ${preferences.tone || 'Professional'}`,
    `- Preferred audience: ${preferences.audience || 'General'}`,
    `- Preferred color palette: ${preferences.colorPalette?.name || 'Not specified'}`,
    `- Preferred colors: ${(preferences.colorPalette?.colors || []).join(', ') || 'Not specified'}`,
    `- Palette note: ${preferences.colorPalette?.description || 'Not specified'}`,
    `- Company name: ${preferences.companyName || payload.response.website.companyName || 'Not specified'}`,
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

    // Validate and fix broken image URLs
    const validatedHtml = await sanitizeAndValidateImages(html);

    try {
      await persistHtmlArtifact(validatedHtml);
    } catch (persistError) {
      console.error('Failed to persist generated HTML artifact', persistError);
    }

    return NextResponse.json({ html: validatedHtml });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.';
    console.error('Generate HTML error', error);
    return NextResponse.json({ error: `HTML generation failed: ${message}` }, { status: 502 });
  }
};
