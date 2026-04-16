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
  companyName?: string;
}

export interface ColorPaletteOption {
  name: string;
  colors: string[];
  description?: string;
}

export interface DashboardGenerationReasons {
  headline?: string[];
  subheadline?: string[];
  cta?: string[];
  benefits?: string[];
  testimonials?: string[];
  whyChooseUs?: string[];
}

export interface DashboardRecommendations {
  preferredStyle?: string;
  preferredTone?: string;
  preferredAudience?: string;
  colorPalettes?: ColorPaletteOption[];
  preferredColorPalette?: string;
  generationReasons?: DashboardGenerationReasons;
}

export interface GenerateResponse {
  insights: Insight[];
  website: Website;
  tone?: string;
  recommendations?: DashboardRecommendations;
  reviews?: string[];
}

export interface HtmlGenerationPreferences {
  style?: string;
  tone?: string;
  audience?: string;
  colorPalette?: ColorPaletteOption;
  companyName?: string;
}

export interface GenerateHtmlRequest {
  response: GenerateResponse;
  preferences?: HtmlGenerationPreferences;
}
