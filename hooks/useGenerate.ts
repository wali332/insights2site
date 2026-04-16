import { useState } from 'react';
import { GenerateResponse, Insight, Website } from '../types';
import { generateWebsiteData } from '../services/api';

export const useGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (text: string) => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setSelectedInsightId(null);
    
    try {
      const data = await generateWebsiteData(text);
      setInsights(data.insights);
      setWebsite(data.website);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    insights,
    website,
    selectedInsightId,
    setSelectedInsightId,
    error,
    generate
  };
};
