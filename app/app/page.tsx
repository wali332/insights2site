"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import dynamic from 'next/dynamic';
import { useGenerate } from '../../hooks/useGenerate';
import { Card } from '../../components/ui/Card';
import { BarChart3, BrainCircuit, FileSpreadsheet, MonitorSmartphone } from 'lucide-react';

const InputSection = dynamic(
  () => import('../../components/input/InputSection').then((module) => module.InputSection),
  { ssr: false }
);

export default function AppPage() {
  const router = useRouter();
  const { loading, generate, hasCachedResponse, hydrateFromCache } = useGenerate();

  const handleGenerateAndOpenDashboard = async (text: string) => {
    const response = await generate(text);

    if (response) {
      router.push('/app/dashboard');
    }
  };

  const handleUseCached = () => {
    const cached = hydrateFromCache();

    if (cached) {
      router.push('/app/dashboard');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white text-gray-900">
      <div className="absolute top-0 right-0 -translate-y-10 translate-x-1/3 w-[720px] h-[520px] bg-gray-100/50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-72 left-0 -translate-x-1/3 w-[560px] h-[560px] bg-gray-200/40 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Navbar />

        <div className="mt-8 flex flex-1 flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Review Upload', href: '/app', icon: FileSpreadsheet },
              { label: 'AI Insights', href: '/app/dashboard', icon: BrainCircuit },
              { label: 'Website Preview', href: '/app/render', icon: MonitorSmartphone },
            ]}
          />

          <InputSection
            onGenerate={handleGenerateAndOpenDashboard}
            onUseCached={handleUseCached}
            hasCachedData={hasCachedResponse}
            loading={loading}
          />

          <Card className="border border-gray-200 bg-white/60">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-gray-700" />Dashboard Flow</h2>
            <p className="text-sm text-gray-600">
              After generation, you will be redirected to a dedicated dashboard at /app/dashboard where you can inspect KPI,
              preview the website, and download HTML without re-calling Gemini unless you generate again.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
