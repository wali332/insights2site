"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ColorPaletteOption, DashboardGenerationReasons, GenerateResponse, Insight, Website } from '../../../types';
import { useGenerate } from '../../../hooks/useGenerate';
import { BrainCircuit, CircleAlert, FileSpreadsheet, WandSparkles, LayoutTemplate, Layers, Sparkles, MessageSquare, Target, Users, AlertTriangle, Heart, Download, LoaderCircle } from 'lucide-react';

const FALLBACK_COLOR_PALETTES: ColorPaletteOption[] = [
  {
    name: 'Modern Indigo',
    description: 'Balanced modern palette for SaaS and product pages.',
    colors: ['#111827', '#4F46E5', '#EEF2FF'],
  },
  {
    name: 'Fresh Teal',
    description: 'Friendly and trust-building palette.',
    colors: ['#0F172A', '#0D9488', '#ECFEFF'],
  },
  {
    name: 'Warm Amber',
    description: 'Bold and energetic conversion-oriented palette.',
    colors: ['#1F2937', '#F59E0B', '#FFF7ED'],
  },
];

const getBenefits = (website: Website): string[] => {
  if (Array.isArray(website.benefits)) {
    return website.benefits;
  }

  if (website.benefits && typeof website.benefits === 'object' && Array.isArray(website.benefits.items)) {
    return website.benefits.items;
  }

  if (Array.isArray(website.benefitsList)) {
    return website.benefitsList;
  }

  return [];
};

const buildDraftFromEditor = (
  source: GenerateResponse,
  companyName: string,
  headline: string,
  subheadline: string,
  cta: string,
  benefitsText: string,
  testimonialsText: string,
  whyChooseUsText: string
): GenerateResponse => {
  const benefits = benefitsText
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const testimonials = testimonialsText
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const whyChooseUs = whyChooseUsText
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return {
    ...source,
    website: {
      ...source.website,
      companyName,
      hero: {
        ...(source.website.hero || { headline: '', subheadline: '' }),
        headline,
        subheadline,
      },
      headline,
      subheadline,
      cta,
      benefits: source.website.benefits && !Array.isArray(source.website.benefits)
        ? {
            ...source.website.benefits,
            items: benefits,
          }
        : benefits,
      benefitsList: benefits,
      testimonials,
      why_choose_us: whyChooseUs,
    },
  };
};

const normalizeReasonLines = (value?: string[]): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);
};

const buildFallbackReasonsFromInsights = (insights: Insight[]): DashboardGenerationReasons => {
  const collectByUsedIn = (usedInValues: string[]): string[] => {
    return insights
      .filter((insight) => usedInValues.includes(insight.usedIn))
      .map((insight) => insight.text)
      .slice(0, 3);
  };

  return {
    headline: collectByUsedIn(['hero']),
    subheadline: collectByUsedIn(['hero']),
    cta: collectByUsedIn(['cta']),
    benefits: collectByUsedIn(['benefits']),
    testimonials: collectByUsedIn(['testimonials', 'social_proof']),
    whyChooseUs: collectByUsedIn(['benefits', 'value', 'why_choose_us']),
  };
};

const GENERATE_CACHE_KEY = 'insight2site.generate.response.v1';

const readInitialResponse = (): GenerateResponse | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(GENERATE_CACHE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as GenerateResponse;
    if (!parsed?.website) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const getInitialDashboardValues = () => {
  const cached = readInitialResponse();
  const website = cached?.website;
  const benefits = website ? getBenefits(website) : [];

  return {
    headline: website?.hero?.headline || website?.headline || '',
    subheadline: website?.hero?.subheadline || website?.subheadline || '',
    cta: website?.cta || 'Get Started',
    companyName: website?.companyName || '',
    benefitsText: benefits.join('\n'),
    testimonialsText: (website?.testimonials || []).join('\n'),
    whyChooseUsText: (website?.why_choose_us || []).join('\n'),
    style: cached?.recommendations?.preferredStyle || 'Modern SaaS',
    tone: cached?.recommendations?.preferredTone || 'Professional',
    audience: cached?.recommendations?.preferredAudience || 'Startups',
    selectedPaletteName: cached?.recommendations?.preferredColorPalette || 'Modern Indigo',
  };
};

function GenerationReasonSource({ reasons }: { reasons?: string[] }) {
  const normalizedReasons = normalizeReasonLines(reasons);

  if (normalizedReasons.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-violet-400" /> Why Gemini generated this
      </p>
      <ul className="space-y-1.5 rounded-lg border border-gray-200/70 bg-gray-50 px-3 py-2.5">
        {normalizedReasons.map((reason, i) => (
          <li key={`${reason}-${i}`} className="text-xs text-gray-600 leading-relaxed flex items-start gap-1.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const OptionCard = ({ label, selected, onClick }: OptionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
      selected 
        ? 'bg-amber-50 border-amber-200 text-amber-800 border-2' 
        : 'bg-white border-gray-200 text-gray-600 border hover:bg-gray-50 border-2 border-transparent hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

interface PaletteCardProps {
  palette: ColorPaletteOption;
  selected: boolean;
  onClick: () => void;
}

const PaletteCard = ({ palette, selected, onClick }: PaletteCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-xl p-3 text-left border-2 transition-all shadow-sm ${
      selected
        ? 'bg-cyan-50 border-cyan-200 ring-2 ring-cyan-100'
        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="text-sm font-semibold text-gray-800">{palette.name}</div>
    {palette.description ? <p className="mt-1 text-xs text-gray-500 line-clamp-2">{palette.description}</p> : null}
    <div className="mt-2 flex items-center gap-1.5">
      {palette.colors.slice(0, 5).map((color) => (
        <span
          key={`${palette.name}-${color}`}
          className="h-5 w-5 rounded-md border border-black/10"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  </button>
);

const buildCurrentDraftFromState = ({
  source,
  companyName,
  headline,
  subheadline,
  cta,
  benefitsText,
  testimonialsText,
  whyChooseUsText,
  style,
  tone,
  audience,
  colorPalettes,
  selectedPaletteName,
}: {
  source: GenerateResponse;
  companyName: string;
  headline: string;
  subheadline: string;
  cta: string;
  benefitsText: string;
  testimonialsText: string;
  whyChooseUsText: string;
  style: string;
  tone: string;
  audience: string;
  colorPalettes: ColorPaletteOption[];
  selectedPaletteName: string;
}): GenerateResponse => {
  const next = buildDraftFromEditor(
    source,
    companyName,
    headline,
    subheadline,
    cta,
    benefitsText,
    testimonialsText,
    whyChooseUsText
  );

  return {
    ...next,
    recommendations: {
      preferredStyle: style,
      preferredTone: tone,
      preferredAudience: audience,
      colorPalettes,
      preferredColorPalette: selectedPaletteName,
      generationReasons: source.recommendations?.generationReasons,
    },
  };
};

export default function DashboardPage() {
  const {
    cachedResponse,
    hasCachedResponse,
    hydrateFromCache,
    saveDraftResponse,
    generateHtml,
    generatedHtml,
    generatingHtml,
  } = useGenerate();

  const initialDashboardValues = useMemo(() => getInitialDashboardValues(), []);

  const [headline, setHeadline] = useState(initialDashboardValues.headline);
  const [subheadline, setSubheadline] = useState(initialDashboardValues.subheadline);
  const [cta, setCta] = useState(initialDashboardValues.cta);
  const [companyName, setCompanyName] = useState(initialDashboardValues.companyName);
  const [benefitsText, setBenefitsText] = useState(initialDashboardValues.benefitsText);
  const [testimonialsText, setTestimonialsText] = useState(initialDashboardValues.testimonialsText);
  const [whyChooseUsText, setWhyChooseUsText] = useState(initialDashboardValues.whyChooseUsText);

  // Customization state
  const [style, setStyle] = useState(initialDashboardValues.style);
  const [tone, setTone] = useState(initialDashboardValues.tone);
  const [audience, setAudience] = useState(initialDashboardValues.audience);
  const [selectedPaletteName, setSelectedPaletteName] = useState(initialDashboardValues.selectedPaletteName);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    hydrateFromCache();
  }, [hydrateFromCache]);

  const insightGroups = useMemo(() => {
    const insights = cachedResponse?.insights || [];

    return {
      pain: insights.filter((item) => item.type === 'pain'),
      desire: insights.filter((item) => item.type === 'desire'),
    };
  }, [cachedResponse]);

  const generationReasons = useMemo(() => {
    const modelReasons = cachedResponse?.recommendations?.generationReasons;

    const normalizedFromModel: DashboardGenerationReasons = {
      headline: normalizeReasonLines(modelReasons?.headline),
      subheadline: normalizeReasonLines(modelReasons?.subheadline),
      cta: normalizeReasonLines(modelReasons?.cta),
      benefits: normalizeReasonLines(modelReasons?.benefits),
      testimonials: normalizeReasonLines(modelReasons?.testimonials),
      whyChooseUs: normalizeReasonLines(modelReasons?.whyChooseUs),
    };

    const hasModelReasons = Object.values(normalizedFromModel).some(
      (items) => Array.isArray(items) && items.length > 0
    );

    if (hasModelReasons) {
      return normalizedFromModel;
    }

    const fallback = buildFallbackReasonsFromInsights(cachedResponse?.insights || []);

    return {
      headline: normalizeReasonLines(fallback.headline),
      subheadline: normalizeReasonLines(fallback.subheadline),
      cta: normalizeReasonLines(fallback.cta),
      benefits: normalizeReasonLines(fallback.benefits),
      testimonials: normalizeReasonLines(fallback.testimonials),
      whyChooseUs: normalizeReasonLines(fallback.whyChooseUs),
    };
  }, [cachedResponse]);

  const colorPalettes = useMemo(() => {
    const palettes = cachedResponse?.recommendations?.colorPalettes;
    if (Array.isArray(palettes) && palettes.length === 3) {
      return palettes;
    }

    return FALLBACK_COLOR_PALETTES;
  }, [cachedResponse]);

  const selectedPalette = useMemo(() => {
    return colorPalettes.find((palette) => palette.name === selectedPaletteName) || colorPalettes[0];
  }, [colorPalettes, selectedPaletteName]);

  const handleDownloadHtml = () => {
    if (!generatedHtml) {
      setSaveMessage('No generated site available. Generate first.');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([generatedHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName || 'website'}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSaveMessage('HTML file downloaded successfully.');
  };

  const handleGenerateSite = async () => {
    if (!cachedResponse) {
      return;
    }

    setSaveMessage(null);

    const draft = buildCurrentDraftFromState({
      source: cachedResponse,
      companyName,
      headline,
      subheadline,
      cta,
      benefitsText,
      testimonialsText,
      whyChooseUsText,
      style,
      tone,
      audience,
      colorPalettes,
      selectedPaletteName,
    });

    await saveDraftResponse(draft);

    const html = await generateHtml({
      response: draft,
      preferences: {
        style,
        tone,
        audience,
        colorPalette: selectedPalette,
        companyName,
      },
    });

    if (!html) {
      setSaveMessage('Failed to generate HTML. Please try again.');
      return;
    }

    setSaveMessage('Site created. Click Open Site to preview it.');
  };

  const handleOpenHtml = () => {
    if (!generatedHtml) {
      setSaveMessage('No generated site available. Generate first.');
      return;
    }

    const previewTab = window.open('about:blank', '_blank');
    if (!previewTab) {
      setSaveMessage('Popup blocked. Please allow popups for this site and try again.');
      return;
    }

    previewTab.document.open();
    previewTab.document.write(generatedHtml);
    previewTab.document.close();
    setSaveMessage('Opening generated site in a new tab.');
  };

  if (!hasCachedResponse || !cachedResponse) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white text-gray-900">
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <Navbar />
          <Breadcrumbs
            className="mt-8"
            items={[
              { label: 'Review Upload', href: '/app', icon: FileSpreadsheet },
              { label: 'AI Insights', href: '/app/dashboard', icon: BrainCircuit },
            ]}
          />
          <Card className="mt-8 border border-gray-200 bg-white/70 text-center p-10">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <CircleAlert className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">No Cached Dashboard Data</h1>
            <p className="text-gray-600 mb-6">
              Generate once from the upload page to store JSON locally, then this dashboard will load from cached data.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Go To Upload Page
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const reviewCount = cachedResponse?.reviews?.length || 60; // fallback if not available

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] text-gray-900">
      <div className="absolute top-72 left-0 -translate-x-1/3 w-[560px] h-[560px] bg-cyan-100/50 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Navbar />

        <Breadcrumbs
          className="mt-8"
          items={[
            { label: 'Review Upload', href: '/app', icon: FileSpreadsheet },
            { label: 'AI Insights', href: '/app/dashboard', icon: BrainCircuit },
          ]}
        />

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]">
          {/* LEFT COLUMN: Insights & Customization */}
          <div className="flex flex-col gap-6">
            
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                <BrainCircuit className="h-5 w-5 text-cyan-700" />
                Insights Summary
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {cachedResponse?.insights?.length || 0} insights extracted from {reviewCount} reviews
              </p>
            </div>

            {/* Pain Points Card */}
            <Card className="bg-red-50/60 border border-red-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300">
              <h3 className="text-sm font-semibold text-red-900 mb-4 inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Top Pain Points
              </h3>
              <ul className="space-y-3">
                {insightGroups.pain.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm text-red-800 flex items-start gap-2.5">
                     <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                     <span className="leading-snug">{item.text}</span>
                  </li>
                ))}
                {insightGroups.pain.length === 0 && (
                  <li className="text-red-400 italic text-sm">No pain points found.</li>
                )}
              </ul>
            </Card>

            {/* Desires Card */}
            <Card className="bg-emerald-50/60 border border-emerald-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300">
              <h3 className="text-sm font-semibold text-emerald-900 mb-4 inline-flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-600" /> Top Desires
              </h3>
              <ul className="space-y-3">
                {insightGroups.desire.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm text-emerald-800 flex items-start gap-2.5">
                     <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                     <span className="leading-snug">{item.text}</span>
                  </li>
                ))}
                {insightGroups.desire.length === 0 && (
                  <li className="text-emerald-400 italic text-sm">No desires found.</li>
                )}
              </ul>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300 mt-2">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                  <LayoutTemplate className="h-5 w-5 text-amber-700" />
                  Customize Website
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">
                  Defaults are suggested by Gemini and can be customized before final generation.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Design Style</p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Modern SaaS', 'Bold Marketing', 'Minimal Clean'].map(opt => (
                      <OptionCard key={opt} label={opt} selected={style === opt} onClick={() => setStyle(opt)} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tone & Voice</p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Professional', 'Friendly', 'Playful'].map(opt => (
                      <OptionCard key={opt} label={opt} selected={tone === opt} onClick={() => setTone(opt)} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Target Audience</p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Startups', 'Local Business', 'Enterprise'].map(opt => (
                      <OptionCard key={opt} label={opt} selected={audience === opt} onClick={() => setAudience(opt)} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Color Palette</p>
                  <div className="grid gap-2.5">
                    {colorPalettes.map((palette) => (
                      <PaletteCard
                        key={palette.name}
                        palette={palette}
                        selected={selectedPalette?.name === palette.name}
                        onClick={() => setSelectedPaletteName(palette.name)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: Edit Content */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-24 z-20 bg-[#fafafa]/80 backdrop-blur-md py-4 -mt-4 border-b border-transparent">
              <div>
                <h2 className="flex items-center gap-2.5 whitespace-nowrap text-xl font-bold text-gray-900 lg:text-2xl">
                  <Layers className="h-6 w-6 text-violet-700" />
                  Content Editor
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review and adapt the AI-generated copy.
                </p>
              </div>
              <div className="flex w-full justify-end">
                <div className="flex w-full max-w-[760px] flex-wrap justify-end gap-3">
                  {generatedHtml ? (
                    <Button
                      variant="secondary"
                      onClick={handleDownloadHtml}
                      aria-label="Download"
                      title="Download"
                      className="h-12 min-w-[132px] justify-center rounded-xl px-4 whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800">
                        <Download className="h-4 w-4 text-gray-500" />
                        Download
                      </span>
                    </Button>
                  ) : null}
                  {generatedHtml ? (
                    <Button variant="secondary" onClick={handleOpenHtml} className="h-12 min-w-[116px] justify-center rounded-xl px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800">
                        <WandSparkles className="h-4 w-4 text-gray-500" />
                        Open Site
                      </span>
                    </Button>
                  ) : null}
                  <Button onClick={handleGenerateSite} disabled={generatingHtml} className="h-12 min-w-[148px] justify-center rounded-xl bg-gray-900 px-4 text-white shadow-md transition hover:bg-gray-800 hover:shadow-lg whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium">
                      <WandSparkles className="h-4 w-4 text-gray-200" />
                      Generate Site
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {generatingHtml ? (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 flex items-center gap-2 font-medium shadow-sm">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating your site. This can take a few moments.
                </div>
              ) : null}

              {/* BRAND DETAILS & COPY CARD */}
              <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-6 inline-flex items-center gap-2.5">
                  <MessageSquare className="h-5 w-5 text-violet-600" />
                  Brand Details
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Company Name</span>
                      <input
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        placeholder="Acme Co"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all font-semibold"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Headline</span>
                      <input
                        value={headline}
                        onChange={(event) => setHeadline(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all font-semibold"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.headline} />
                  </div>

                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Subheadline</span>
                      <textarea
                        value={subheadline}
                        onChange={(event) => setSubheadline(event.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all resize-none"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.subheadline} />
                  </div>

                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Call to Action (CTA)</span>
                      <input
                        value={cta}
                        onChange={(event) => setCta(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.cta} />
                  </div>
                </div>
              </Card>

              {/* VALUE PROPS CARD */}
              <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-6 inline-flex items-center gap-2.5">
                  <Target className="h-5 w-5 text-amber-600" />
                  Value Proposition
                </h3>
                
                <div className="space-y-6 grid lg:grid-cols-2 lg:space-y-0 gap-6">
                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Key Benefits (one per line)</span>
                      <textarea
                        value={benefitsText}
                        onChange={(event) => setBenefitsText(event.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all leading-relaxed"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.benefits} />
                  </div>

                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Why Choose Us (one per line)</span>
                      <textarea
                        value={whyChooseUsText}
                        onChange={(event) => setWhyChooseUsText(event.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all leading-relaxed"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.whyChooseUs} />
                  </div>
                </div>
              </Card>

              {/* SOCIAL PROOF CARD */}
              <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-6 inline-flex items-center gap-2.5">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Social Proof
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      <span className="mb-2">Testimonials (one per line)</span>
                      <textarea
                        value={testimonialsText}
                        onChange={(event) => setTestimonialsText(event.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all leading-relaxed"
                      />
                    </label>
                    <GenerationReasonSource reasons={generationReasons.testimonials} />
                  </div>
                </div>
              </Card>
            </div>

            {saveMessage ? (
              <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center justify-center font-medium shadow-sm animate-in fade-in slide-in-from-bottom-2">
                {saveMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}


