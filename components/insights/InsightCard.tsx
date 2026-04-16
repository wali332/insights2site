import React from 'react';
import { Insight } from '../../types';

interface InsightCardProps {
  insight: Insight;
  isSelected: boolean;
  onClick: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, isSelected, onClick }) => {
  const typeStyles = {
    pain: "border-red-500 text-red-700 bg-red-50",
    desire: "border-green-500 text-green-700 bg-green-50",
    keyword: "border-yellow-500 text-yellow-700 bg-yellow-50"
  };

  const typeConfig = {
    pain: { icon: "🔥", label: "Pain Point" },
    desire: { icon: "✨", label: "Desire" },
    keyword: { icon: "🔑", label: "Keyword" }
  };

  const currentType = typeConfig[insight.type];

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
        ${typeStyles[insight.type]} 
        ${isSelected ? 'ring-4 ring-blue-400 scale-[1.02] bg-white' : 'hover:bg-white'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span>{currentType.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{currentType.label}</span>
      </div>
      <p className="text-gray-800 text-sm font-medium">{insight.text}</p>
    </div>
  );
};
