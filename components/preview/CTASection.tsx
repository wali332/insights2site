import React from 'react';
import { Website } from '../../types';

interface SectionProps {
  website: Website;
  isHighlighted: boolean;
  insightText?: string;
}

export const CTASection: React.FC<SectionProps> = ({ website, isHighlighted, insightText }) => {
  return (
    <div className={`relative p-10 rounded-2xl transition-all duration-500 text-center
      ${isHighlighted ? 'ring-4 ring-purple-500 bg-purple-50 scale-[1.01] shadow-xl' : 'bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-lg'}`}>
      
      {isHighlighted && insightText && (
        <div className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          Generated from Insight
        </div>
      )}

      <h2 className={`text-3xl font-bold mb-6 ${isHighlighted ? 'text-gray-900' : 'text-white'}`}>
        Ready to take the next step?
      </h2>
      <button className={`${isHighlighted ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-white text-indigo-900 hover:bg-gray-100'} px-8 py-4 rounded-xl font-bold text-lg transition shadow-md`}>
        {website.cta}
      </button>

      {isHighlighted && insightText && (
         <div className="mt-8 pt-4 border-t border-purple-200 text-sm text-purple-800 bg-purple-100 p-3 rounded-lg w-full text-left font-medium">
         <span className="font-bold">Insight:</span> {insightText}
       </div>
      )}
    </div>
  );
};
