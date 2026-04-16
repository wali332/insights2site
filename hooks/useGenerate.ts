import { useCallback, useEffect, useState } from 'react';
import { GenerateResponse, Insight, Website } from '../types';
import { generateWebsiteData, persistGeneratedResponse } from '../services/api';

const GENERATE_CACHE_KEY = 'insight2site.generate.response.v1';

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

export const useGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedResponse, setHasCachedResponse] = useState(false);
  const [cachedResponse, setCachedResponse] = useState<GenerateResponse | null>(null);

  useEffect(() => {
    const cached = readCachedResponse();
    setHasCachedResponse(Boolean(cached));
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
    return cached;
  }, [applyResponse]);

  const generate = useCallback(async (text: string): Promise<GenerateResponse | null> => {
    if (!text.trim()) return null;

    setLoading(true);
    setError(null);
    setSelectedInsightId(null);

    try {
      const data = await generateWebsiteData(text);
      await saveDraftResponse(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [saveDraftResponse]);

  return {
    loading,
    insights,
    website,
    tone,
    cachedResponse,
    selectedInsightId,
    setSelectedInsightId,
    error,
    hasCachedResponse,
    saveDraftResponse,
    hydrateFromCache,
    generate,
  };
};
