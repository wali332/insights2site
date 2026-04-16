import React from 'react';
import { Card } from '../ui/Card';
import { Website, Insight } from '../../types';
import { HeroSection } from './HeroSection';
import { BenefitsSection } from './BenefitsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';

interface WebsitePreviewProps {
  website: Website | null;
  insights: Insight[];
  selectedInsightId: string | null;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  website, 
  insights, 
  selectedInsightId 
}) => {
  if (!website) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/40 border-dashed border-2 min-h-[600px]">
        <div className="w-24 h-24 mb-6 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
          <span className="text-4xl">🌐</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Live Website Preview</h3>
        <p className="text-gray-500 max-w-sm">
          Upload your CSV reviews and click Generate to see your new landing page structured dynamically from insights.
        </p>
      </Card>
    );
  }

  // Find if there's a selected insight related to the sections
  const getSelectedInsightForLayer = (layerId: string) => {
    if (!selectedInsightId) return undefined;
    const insight = insights.find(i => i.id === selectedInsightId);
    if (insight && insight.usedIn === layerId) return insight.text;
    return undefined;
  };

  return (
    <Card className="bg-gray-100/50 p-2 overflow-hidden border-2 border-gray-200/50 relative shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-8 bg-gray-200/80 rounded-t-xl flex items-center px-4 gap-2 border-b border-gray-300 backdrop-blur-sm z-20">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="ml-4 text-xs font-mono text-gray-500 bg-white/50 px-2 py-0.5 rounded border border-gray-300/50">
          preview.yourwebsite.com
        </div>
      </div>
      
      <div className="pt-10 overflow-y-auto max-h-[calc(100vh-8rem)] rounded-b-xl custom-scrollbar relative z-10 w-full h-full p-2 bg-gray-100/30">
        <HeroSection 
          website={website} 
          isHighlighted={!!getSelectedInsightForLayer('hero')} 
          insightText={getSelectedInsightForLayer('hero')} 
        />
        <BenefitsSection 
          website={website} 
          isHighlighted={!!getSelectedInsightForLayer('benefits')} 
          insightText={getSelectedInsightForLayer('benefits')} 
        />
        <TestimonialsSection 
          website={website} 
          isHighlighted={!!getSelectedInsightForLayer('testimonials')} 
          insightText={getSelectedInsightForLayer('testimonials')} 
        />
        <CTASection 
          website={website} 
          isHighlighted={!!getSelectedInsightForLayer('cta')} 
          insightText={getSelectedInsightForLayer('cta')} 
        />
      </div>
    </Card>
  );
};
