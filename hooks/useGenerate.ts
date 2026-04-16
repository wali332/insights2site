import { useCallback, useEffect, useState } from 'react';
import { GenerateHtmlRequest, GenerateResponse, Insight, Website } from '../types';
import { generateWebsiteData, generateWebsiteHtml, persistGeneratedResponse } from '../services/api';

const GENERATE_CACHE_KEY = 'insight2site.generate.response.v1';
const GENERATED_HTML_CACHE_KEY = 'insight2site.generated.html.v1';

const readCachedResponse = (): GenerateResponse | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(GENERATE_CACHE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as GenerateResponse;
    if (!parsed || !Array.isArray(parsed.insights) || !parsed.website) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeCachedResponse = (data: GenerateResponse) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GENERATE_CACHE_KEY, JSON.stringify(data));
};

const readCachedHtml = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(GENERATED_HTML_CACHE_KEY);
  if (!rawValue || rawValue.trim().length === 0) {
    return null;
  }

  return rawValue;
};

const writeCachedHtml = (html: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GENERATED_HTML_CACHE_KEY, html);
};

const clearCachedHtml = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(GENERATED_HTML_CACHE_KEY);
};

export const useGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedResponse, setHasCachedResponse] = useState(false);
  const [cachedResponse, setCachedResponse] = useState<GenerateResponse | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatingHtml, setGeneratingHtml] = useState(false);

  useEffect(() => {
    const cached = readCachedResponse();
    setHasCachedResponse(Boolean(cached));
    setGeneratedHtml(readCachedHtml());
  }, []);

  const applyResponse = useCallback((data: GenerateResponse) => {
    setInsights(data.insights);
    setWebsite(data.website);
    setTone(data.tone || 'modern');
    setCachedResponse(data);
  }, []);

  const saveDraftResponse = useCallback(async (data: GenerateResponse) => {
    applyResponse(data);
    writeCachedResponse(data);
    setHasCachedResponse(true);

    await persistGeneratedResponse(data);
  }, [applyResponse]);

  const saveGeneratedHtml = useCallback((html: string) => {
    setGeneratedHtml(html);
    writeCachedHtml(html);
  }, []);

  const clearGeneratedHtml = useCallback(() => {
    setGeneratedHtml(null);
    clearCachedHtml();
  }, []);

  const hydrateFromCache = useCallback((): GenerateResponse | null => {
    const cached = readCachedResponse();

    if (!cached) {
      setError('No cached JSON response found yet. Generate once to create it.');
      setHasCachedResponse(false);
      return null;
    }

    setError(null);
    setSelectedInsightId(null);
    applyResponse(cached);
    setHasCachedResponse(true);
    setGeneratedHtml(readCachedHtml());
    return cached;
  }, [applyResponse]);

  const generateHtml = useCallback(async (payload: GenerateHtmlRequest): Promise<string | null> => {
    setGeneratingHtml(true);
    setError(null);

    try {
      const html = await generateWebsiteHtml(payload);
      saveGeneratedHtml(html);
      return html;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate HTML website.';
      setError(message);
      return null;
    } finally {
      setGeneratingHtml(false);
    }
  }, [saveGeneratedHtml]);

  const generate = useCallback(async (text: string): Promise<GenerateResponse | null> => {
    if (!text.trim()) return null;

    setLoading(true);
    setError(null);
    setSelectedInsightId(null);

    try {
      const data = await generateWebsiteData(text);
      clearGeneratedHtml();
      await saveDraftResponse(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearGeneratedHtml, saveDraftResponse]);

  return {
    loading,
    insights,
    website,
    tone,
    generatedHtml,
    generatingHtml,
    cachedResponse,
    selectedInsightId,
    setSelectedInsightId,
    error,
    hasCachedResponse,
    saveDraftResponse,
    saveGeneratedHtml,
    clearGeneratedHtml,
    hydrateFromCache,
    generateHtml,
    generate,
  };
};
