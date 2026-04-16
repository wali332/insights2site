import React from 'react';
import { Card } from '../ui/Card';
import { Insight } from '../../types';
import { InsightCard } from './InsightCard';

interface InsightsPanelProps {
  insights: Insight[];
  selectedInsightId: string | null;
  onSelectInsight: (id: string | null) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  insights, 
  selectedInsightId, 
  onSelectInsight 
}) => {
  if (insights.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/60 border-dashed border-2 border-gray-200">
        <div className="text-4xl mb-4 opacity-50">🔍</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Insights Yet</h3>
        <p className="text-gray-500 text-sm">Upload your CSV and click generate to extract actionable insights.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col sticky top-24 max-h-[calc(100vh-8rem)]">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Extracted Insights</h2>
        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {insights.length} Total
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-6 pb-4 border-b border-gray-100 shrink-0">
        Click an insight to see how it shaped the generated website.
      </p>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {insights.map(insight => (
          <InsightCard 
            key={insight.id}
            insight={insight}
            isSelected={selectedInsightId === insight.id}
            onClick={() => onSelectInsight(insight.id === selectedInsightId ? null : insight.id)}
          />
        ))}
      </div>
    </Card>
  );
};
