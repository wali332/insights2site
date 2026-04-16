"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface InputSectionProps {
  onGenerate: (text: string) => void;
  loading: boolean;
}

const SAMPLE_REVIEWS = `I was struggling to organize my clinic's schedule, it was a mess. 
This new automation tool literally saved my sanity! It's so easy to use and automatically 
sends WhatsApp reminders to patients, which reduced our no-shows by 50%. 
I just wish there was a darker theme for the dashboard, but overall it's a lifesaver.
Highly recommend for any healthcare provider feeling overwhelmed with admin tasks!`;

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, loading }) => {
  const [text, setText] = useState("");

  const handleSample = () => {
    setText(SAMPLE_REVIEWS);
  };

  const handleGenerate = () => {
    onGenerate(text);
  };

  return (
    <Card className="mb-8 overflow-hidden relative">
      {/* Decorative gradient blur inside card */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">1. Paste Customer Reviews</h2>
          <Button variant="outline" onClick={handleSample} className="py-1.5 px-3 text-sm">
            Load Sample Reviews
          </Button>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste real customer feedback, app store reviews, or testimonials here..."
          className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-inner text-gray-800"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerate} 
            disabled={!text.trim() || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing reviews...
              </>
            ) : (
              "Generate Website ✨"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
