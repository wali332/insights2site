import { GenerateResponse } from "../types";

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
