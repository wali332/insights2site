export type InsightType = "pain" | "desire" | "keyword";

export interface Insight {
  id: string;
  type: InsightType;
  text: string;
  usedIn: string; // E.g., 'hero', 'benefits', 'testimonials', 'cta'
}

export interface WebsiteHero {
  headline: string;
  subheadline: string;
  source?: string;
}

export interface WebsiteBenefits {
  items: string[];
  source?: string;
}

export interface Website {
  hero?: WebsiteHero;
  benefits: string[] | WebsiteBenefits;
  headline: string;
  subheadline: string;
  benefitsList?: string[];
  testimonials: string[];
  cta: string;
  why_choose_us?: string[];
}

export interface GenerateResponse {
  insights: Insight[];
  website: Website;
  tone?: string;
}
