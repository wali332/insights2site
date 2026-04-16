"use client";

import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { InputSection } from '../../components/input/InputSection';
import { InsightsPanel } from '../../components/insights/InsightsPanel';
import { WebsitePreview } from '../../components/preview/WebsitePreview';
import { useGenerate } from '../../hooks/useGenerate';

export default function AppPage() {
  const { 
    loading, 
    insights, 
    website, 
    selectedInsightId, 
    setSelectedInsightId, 
    generate 
  } = useGenerate();

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Navbar />
      
      <div className="mt-8">
        <InputSection onGenerate={generate} loading={loading} />
        
        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-24rem)] min-h-[600px]">
          {/* LEFT: Insights Panel */}
          <div className="lg:col-span-4 h-full">
            <InsightsPanel 
              insights={insights}
              selectedInsightId={selectedInsightId}
              onSelectInsight={setSelectedInsightId}
            />
          </div>
          
          {/* RIGHT: Website Preview */}
          <div className="lg:col-span-8 h-full">
            <WebsitePreview 
              website={website}
              insights={insights}
              selectedInsightId={selectedInsightId}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
