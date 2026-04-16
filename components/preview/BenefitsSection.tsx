import React from 'react';
import { Website } from '../../types';

interface SectionProps {
  website: Website;
  isHighlighted: boolean;
  insightText?: string;
}

export const BenefitsSection: React.FC<SectionProps> = ({ website, isHighlighted, insightText }) => {
  return (
    <div className={`relative p-8 rounded-2xl transition-all duration-500 mb-6 
      ${isHighlighted ? 'ring-4 ring-green-500 bg-green-50/50 scale-[1.01] shadow-xl' : 'bg-white shadow-sm hover:shadow-md'}`}>
      
      {isHighlighted && insightText && (
        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          Generated from Insight
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {website.benefits.map((benefit, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              {i + 1}
            </div>
            <p className="text-gray-800 font-medium">{benefit}</p>
          </div>
        ))}
      </div>

      {isHighlighted && insightText && (
         <div className="mt-8 pt-4 border-t border-green-100 text-sm text-green-800 bg-green-50 p-3 rounded-lg w-full text-left font-medium">
         <span className="font-bold">Insight:</span> {insightText}
       </div>
      )}
    </div>
  );
};
