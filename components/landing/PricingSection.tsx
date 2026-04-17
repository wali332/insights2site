"use client";

import React, { useMemo, useState } from 'react';
import { BadgeCheck, Building2, Crown, Rocket } from 'lucide-react';

type Currency = 'USD' | 'INR';

const INR_PER_USD = 83;

const formatPrice = (usdPrice: number, currency: Currency): string => {
  if (currency === 'USD') {
    return `$${usdPrice}`;
  }

  return `Rs ${Math.round(usdPrice * INR_PER_USD).toLocaleString('en-IN')}`;
};

export const PricingSection = () => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const prices = useMemo(() => {
    return {
      free: formatPrice(0, currency),
      professional: formatPrice(19, currency),
      business: formatPrice(59, currency),
    };
  }, [currency]);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-10">
        <h2 className="inline-flex items-center gap-2 text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          <BadgeCheck className="h-7 w-7 text-gray-700" />
          Transparent Pricing
        </h2>
        <p className="text-lg text-gray-500">Competitive plans for teams moving from feedback to live websites fast.</p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              currency === 'USD' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            USD
          </button>
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              currency === 'INR' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            INR
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition shadow-sm hover:shadow-md">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600 w-fit">
            <BadgeCheck className="h-3.5 w-3.5" /> For starters
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
          <div className="text-3xl font-bold text-gray-900 mb-6">{prices.free}<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-3 mb-8 flex-1 text-gray-600 text-sm">
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Essential insight extraction</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Website generation with editor</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Great for individual projects</li>
          </ul>
          <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 rounded-xl transition">
            Current Plan
          </button>
        </div>

        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-xl relative flex flex-col scale-[1.02] z-10 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-gray-900/5 before:to-transparent before:pointer-events-none">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-0.5 rounded-full text-xs font-bold tracking-wide inline-flex items-center gap-1">
            <Crown className="h-3 w-3" /> PRO
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
          <div className="text-3xl font-bold text-gray-900 mb-6">{prices.professional}<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-3 mb-8 flex-1 text-gray-700 text-sm font-medium">
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-900" />Enhanced generation quality</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-900" />Faster turnaround for active usage</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-900" />Advanced tone and style controls</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-900" />Priority support</li>
          </ul>
          <button className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl shadow-md transition transform hover:scale-105 active:scale-95 duration-300">
            <Rocket className="h-4 w-4" />
            Upgrade Now
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition shadow-sm hover:shadow-md md:col-span-2 lg:col-span-1">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600 w-fit">
            <Building2 className="h-3.5 w-3.5" /> For scale
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
          <div className="text-3xl font-bold text-gray-900 mb-6">{prices.business}<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-3 mb-8 flex-1 text-gray-600 text-sm">
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />High-volume generation workflows</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Team collaboration and shared workspaces</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Admin controls and onboarding support</li>
            <li className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 mt-0.5 text-gray-500" />Priority SLA and support channel</li>
          </ul>
          <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 rounded-xl transition">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
