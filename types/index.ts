export type InsightType = "pain" | "desire" | "keyword";

export interface Insight {
  id: string;
  type: InsightType;
  text: string;
  usedIn: string; // E.g., 'hero', 'benefits', 'testimonials', 'cta'
}

export interface Website {
  headline: string;
  subheadline: string;
  benefits: string[];
  testimonials: string[];
  cta: string;
}

export interface GenerateResponse {
  insights: Insight[];
  website: Website;
}
