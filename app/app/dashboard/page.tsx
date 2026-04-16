"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { GenerateResponse, Website } from '../../../types';
import { getTemplateName } from '../../../utils/templates';
import { useGenerate } from '../../../hooks/useGenerate';
import { BarChart3, BrainCircuit, CircleAlert, FileSpreadsheet, MonitorSmartphone, Save, WandSparkles } from 'lucide-react';

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

export default function DashboardPage() {
  const router = useRouter();
  const {
    cachedResponse,
    hasCachedResponse,
    hydrateFromCache,
    saveDraftResponse,
  } = useGenerate();

  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [cta, setCta] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [testimonialsText, setTestimonialsText] = useState('');
  const [whyChooseUsText, setWhyChooseUsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    hydrateFromCache();
  }, [hydrateFromCache]);

  useEffect(() => {
    if (!cachedResponse?.website) {
      return;
    }

    const website = cachedResponse.website;
    const benefits = getBenefits(website);

    setHeadline(website.hero?.headline || website.headline || '');
    setSubheadline(website.hero?.subheadline || website.subheadline || '');
    setCta(website.cta || 'Get Started');
    setBenefitsText(benefits.join('\n'));
    setTestimonialsText((website.testimonials || []).join('\n'));
    setWhyChooseUsText((website.why_choose_us || []).join('\n'));
  }, [cachedResponse]);

  const insightGroups = useMemo(() => {
    const insights = cachedResponse?.insights || [];

    return {
      pain: insights.filter((item) => item.type === 'pain'),
      desire: insights.filter((item) => item.type === 'desire'),
      keyword: insights.filter((item) => item.type === 'keyword'),
    };
  }, [cachedResponse]);

  const kpi = useMemo(() => {
    if (!cachedResponse) {
      return [];
    }

    const insights = cachedResponse.insights;

    return [
      { label: 'Tone', value: cachedResponse.tone || 'modern' },
      { label: 'Template', value: getTemplateName(cachedResponse.tone) },
      { label: 'Insights', value: `${insights.length}` },
      { label: 'Pain Points', value: `${insightGroups.pain.length}` },
      { label: 'Desires', value: `${insightGroups.desire.length}` },
      { label: 'Keywords', value: `${insightGroups.keyword.length}` },
      { label: 'Headline Length', value: `${headline.length} chars` },
      { label: 'Subheadline Length', value: `${subheadline.length} chars` },
      { label: 'Benefits', value: `${benefitsText.split('\n').filter(Boolean).length}` },
      { label: 'Testimonials', value: `${testimonialsText.split('\n').filter(Boolean).length}` },
    ];
  }, [cachedResponse, insightGroups, headline, subheadline, benefitsText, testimonialsText]);

  const handleSaveDraft = async () => {
    if (!cachedResponse) {
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const draft = buildDraftFromEditor(
        cachedResponse,
        headline,
        subheadline,
        cta,
        benefitsText,
        testimonialsText,
        whyChooseUsText
      );

      await saveDraftResponse(draft);
      setSaveMessage('Draft saved in browser cache and on server JSON files.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save draft.';
      setSaveMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSite = async () => {
    if (!cachedResponse) {
      return;
    }

    await handleSaveDraft();
    router.push('/app/render');
  };

  if (!hasCachedResponse || !cachedResponse) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white text-gray-900">
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <Navbar />
          <Breadcrumbs
            className="mt-8"
            items={[
              { label: 'Upload Reviews', href: '/app', icon: FileSpreadsheet },
              { label: 'Review KPI', href: '/app/dashboard', icon: BarChart3 },
              { label: 'Render Site', href: '/app/render', icon: MonitorSmartphone },
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white text-gray-900">
      <div className="absolute top-0 right-0 -translate-y-10 translate-x-1/3 w-[720px] h-[520px] bg-gray-100/50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-72 left-0 -translate-x-1/3 w-[560px] h-[560px] bg-gray-200/40 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Navbar />

        <Breadcrumbs
          className="mt-8"
          items={[
            { label: 'Upload Reviews', href: '/app', icon: FileSpreadsheet },
            { label: 'Review KPI', href: '/app/dashboard', icon: BarChart3 },
            { label: 'Render Site', href: '/app/render', icon: MonitorSmartphone },
          ]}
        />

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
          <Card className="bg-white/70 border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2 inline-flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-gray-700" />Business Understanding</h2>
            <p className="text-sm text-gray-500 mb-5">Explore the key customer sentiment groups extracted from your review data.</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {kpi.map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 break-words">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 max-h-[38rem] overflow-auto pr-1">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Pain Points</h3>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  {insightGroups.pain.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Desires</h3>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  {insightGroups.desire.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Keywords</h3>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  {insightGroups.keyword.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="bg-white/70 border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2 inline-flex items-center gap-2"><BarChart3 className="h-5 w-5 text-gray-700" />KPI and Content Review</h2>
            <p className="text-sm text-gray-500 mb-6">
              Configure and edit landing page fields before rendering HTML. This draft is saved to cache and physically on the server.
            </p>

            <div className="grid gap-4">
              <label className="text-sm font-medium text-gray-700">
                Headline
                <input
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Subheadline
                <textarea
                  value={subheadline}
                  onChange={(event) => setSubheadline(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                CTA
                <input
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </label>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Benefits (one per line)
                  <textarea
                    value={benefitsText}
                    onChange={(event) => setBenefitsText(event.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Testimonials (one per line)
                  <textarea
                    value={testimonialsText}
                    onChange={(event) => setTestimonialsText(event.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700">
                Why Choose Us (one per line)
                <textarea
                  value={whyChooseUsText}
                  onChange={(event) => setWhyChooseUsText(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <Button variant="secondary" onClick={handleSaveDraft} disabled={saving}>
                <span className="inline-flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving Draft...' : 'Save Draft'}
                </span>
              </Button>
              <Button onClick={handleGenerateSite} disabled={saving}>
                <span className="inline-flex items-center gap-1.5">
                  <WandSparkles className="h-4 w-4" />
                  Generate Site
                </span>
              </Button>
            </div>

            {saveMessage ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {saveMessage}
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </main>
  );
}
