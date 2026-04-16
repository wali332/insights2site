"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/layout/Navbar';
import { Breadcrumbs } from '../../../components/layout/Breadcrumbs';
import { Card } from '../../../components/ui/Card';
import { WebsitePreview } from '../../../components/preview/WebsitePreview';
import { useGenerate } from '../../../hooks/useGenerate';
import { BarChart3, CircleAlert, FileSpreadsheet, MonitorSmartphone } from 'lucide-react';

export default function RenderPage() {
  const { website, tone, insights, hasCachedResponse, hydrateFromCache } = useGenerate();

  useEffect(() => {
    hydrateFromCache();
  }, [hydrateFromCache]);

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

        {!hasCachedResponse || !website ? (
          <Card className="mt-6 border border-gray-200 bg-white/70 text-center p-10">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <CircleAlert className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">No Render Data Available</h1>
            <p className="text-gray-600 mb-6">
              Go to dashboard, configure your content, and generate site to open HTML render view.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app/dashboard"
                className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Open Dashboard
              </Link>
              <Link
                href="/app"
                className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Go To Upload
              </Link>
            </div>
          </Card>
        ) : (
          <div className="mt-6 min-h-[calc(100vh-9rem)]">
            <WebsitePreview website={website} tone={tone} insights={insights} />
          </div>
        )}
      </div>
    </main>
  );
}
