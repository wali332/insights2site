import React from 'react';
import { Website } from '../../types';

interface SectionProps {
  website: Website;
  isHighlighted: boolean;
  insightText?: string;
}

export const HeroSection: React.FC<SectionProps> = ({ website, isHighlighted, insightText }) => {
  return (
    <div className={`relative p-8 rounded-2xl transition-all duration-500 mb-6 flex flex-col items-center text-center 
      ${isHighlighted ? 'ring-4 ring-blue-500 bg-blue-50/50 scale-[1.01] shadow-xl' : 'bg-white shadow-sm hover:shadow-md'}`}>
      
      {isHighlighted && insightText && (
        <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-fade-in-down">
          Generated from Insight
        </div>
      )}

      <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 inline-block">
        New Product Launch
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 mt-2">
        {website.headline}
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        {website.subheadline}
      </p>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Get Started
        </button>
        <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
          Watch Demo
        </button>
      </div>

      {isHighlighted && insightText && (
        <div className="mt-8 pt-4 border-t border-blue-100 text-sm text-blue-800 bg-blue-50 p-3 rounded-lg w-full text-left font-medium">
          <span className="font-bold">Insight:</span> {insightText}
        </div>
      )}
    </div>
  );
};
