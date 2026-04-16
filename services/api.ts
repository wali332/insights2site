import { GenerateHtmlRequest, GenerateResponse } from "../types";

export const generateWebsiteData = async (reviewsText: string): Promise<GenerateResponse> => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: reviewsText }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate data from reviews");
  }

  return res.json();
};

export const persistGeneratedResponse = async (payload: GenerateResponse): Promise<void> => {
  const res = await fetch('/api/save-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error || 'Failed to persist generated response.');
  }
};

export const generateWebsiteHtml = async (payload: GenerateHtmlRequest): Promise<string> => {
  const res = await fetch('/api/generate-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await res.json().catch(() => null)) as { html?: string; error?: string } | null;

  if (!res.ok) {
    throw new Error(responseBody?.error || 'Failed to generate HTML website.');
  }

  const html = typeof responseBody?.html === 'string' ? responseBody.html.trim() : '';
  if (!html) {
    throw new Error('Gemini returned an empty HTML response.');
  }

  return html;
};
