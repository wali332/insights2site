import React from 'react';
import { Website } from '../../types';

interface SectionProps {
  website: Website;
  isHighlighted: boolean;
  insightText?: string;
}

export const TestimonialsSection: React.FC<SectionProps> = ({ website, isHighlighted, insightText }) => {
  return (
    <div className={`relative p-8 rounded-2xl transition-all duration-500 mb-6 
      ${isHighlighted ? 'ring-4 ring-yellow-400 bg-yellow-50/50 scale-[1.01] shadow-xl' : 'bg-white shadow-sm hover:shadow-md'}`}>
      
      {isHighlighted && insightText && (
        <div className="absolute -top-3 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          Generated from Insight
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What People Say</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {website.testimonials.map((testi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
            <span className="text-4xl text-gray-200 absolute top-4 left-4 font-serif">"</span>
            <p className="text-gray-700 italic relative z-10 pt-4 leading-relaxed">{testi}</p>
            <div className="mt-4 font-bold text-gray-900 text-sm">- Verified User</div>
          </div>
        ))}
      </div>

      {isHighlighted && insightText && (
         <div className="mt-8 pt-4 border-t border-yellow-100 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg w-full text-left font-medium">
         <span className="font-bold">Insight:</span> {insightText}
       </div>
      )}
    </div>
  );
};
