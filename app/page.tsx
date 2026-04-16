import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white font-sans text-gray-900">
      <Navbar />

      {/* Subtle Background Blobs (Stripe-like soft glowing backdrops) */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-96 left-0 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-50/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm border border-blue-100 shadow-sm">
          <span>✨</span> Now with AI sentiment extraction
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
          Turn reviews into a <br className="hidden md:block" />
          <span className="text-blue-600">converting website.</span>
        </h1>
        
        <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Paste your customer feedback and our AI will extract core pain points and desires to instantly generate a tailored landing page.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/app" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:scale-105 hover:shadow-xl shadow-lg transition-all duration-300 text-lg active:scale-95">
            Start Generating Free
          </Link>
          <Link href="#demo" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 shadow-sm transition-all duration-300 text-lg">
            View Live Demo
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-6 font-medium">
          No credit card required • Instant results
        </p>
      </section>

      {/* Product Mockup Section (Glass Style) */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex justify-center">
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-gray-200/50 p-2">
          
          <div className="w-full md:w-1/3 border-r border-gray-100 p-6 bg-white/50 flex flex-col gap-5 rounded-l-xl">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Extracted Insights</div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 relative">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-3"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-5/6"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-white shadow-sm z-10 hidden md:block"></div>
            </div>
            
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 opacity-60 hover:opacity-100 transition">
              <div className="h-2.5 bg-gray-200 rounded-full w-4/5 mb-3"></div>
              <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
            </div>
            
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400 opacity-60 hover:opacity-100 transition">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-3"></div>
              <div className="h-2.5 bg-gray-100 rounded-full w-2/3"></div>
            </div>
          </div>

          <div className="w-full md:w-2/3 bg-gray-50/50 p-6 relative rounded-r-xl">
            <div className="flex items-center gap-1.5 mb-8">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            
            {/* Connection Line */}
            <div className="absolute top-24 -left-6 z-0 hidden md:block">
              <div className="w-12 border-b-2 border-blue-200"></div>
            </div>

            <div className="bg-white ring-2 ring-blue-500/20 rounded-xl p-10 mb-6 shadow-sm border border-blue-100 relative overflow-hidden transition-all hover:shadow-md">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
               <div className="h-6 bg-blue-100 rounded-full w-3/4 mx-auto mb-6"></div>
               <div className="h-3 bg-gray-100 rounded-full w-5/6 mx-auto mb-3"></div>
               <div className="h-3 bg-gray-100 rounded-full w-2/3 mx-auto mb-8"></div>
               <div className="flex justify-center gap-4">
                 <div className="h-10 bg-gray-900 rounded-lg w-32"></div>
                 <div className="h-10 bg-white border border-gray-200 rounded-lg w-32"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-y border-gray-100 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">How Insight2Site Works</h2>
            <p className="text-lg text-gray-500">From messy reviews to a polished layout in seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-semibold text-2xl mb-6 shadow-sm border border-blue-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Paste Reviews</h3>
              <p className="text-gray-500 leading-relaxed">Gather raw feedback from App Store, Trustpilot, or user interviews and throw them straight into our engine.</p>
            </div>

            <div className="flex flex-col items-center relative">
              <div className="hidden md:block absolute top-8 -left-6 w-12 border-t-2 border-dashed border-gray-200"></div>
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-semibold text-2xl mb-6 shadow-sm border border-purple-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Extract Insights</h3>
              <p className="text-gray-500 leading-relaxed">We automatically analyze sentiment, identifying exactly what users hate and what outcomes they truly desire.</p>
            </div>

            <div className="flex flex-col items-center relative">
               <div className="hidden md:block absolute top-8 -left-6 w-12 border-t-2 border-dashed border-gray-200"></div>
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-semibold text-2xl mb-6 shadow-sm border border-green-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Generate Layout</h3>
              <p className="text-gray-500 leading-relaxed">A full mapped UI is constructed dynamically. Every headline and benefit traces directly back to a real insight.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Data-driven design, <br/>made simple.</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop designing in the dark. Insight2Site connects actual user friction to UI components directly. You can map pain points to your Hero Section, or desires to your Benefits grid effortlessly.
              </p>
              <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span> No hardcoding required
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span> Export-ready Tailwind markup
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span> Instantly validate copy
               </li>
              </ul>
              <Link href="/app" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 group">
                Try the dashboard
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            
            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 p-2 overflow-hidden flex">
              <div className="w-1/2 border-r border-gray-100 p-4 shrink-0 bg-gray-50/50">
                <div className="h-2 w-16 bg-gray-300 rounded mb-4"></div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 mb-2 ring-1 ring-blue-500 scale-[1.02]">
                  <div className="flex gap-2 mb-2 items-center"><span className="text-xs">🔥</span> <span className="h-1.5 w-12 bg-gray-200 rounded"></span></div>
                  <div className="h-2 w-full bg-gray-100 rounded mb-1.5"></div>
                  <div className="h-2 w-full bg-gray-100 rounded"></div>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 mb-2 opacity-60">
                   <div className="flex gap-2 mb-2 items-center"><span className="text-xs">✨</span> <span className="h-1.5 w-12 bg-gray-200 rounded"></span></div>
                  <div className="h-2 w-3/4 bg-gray-100 rounded mb-1.5"></div>
                  <div className="h-2 w-full bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="w-1/2 bg-white p-4 relative shrink-0">
                <div className="w-full border-2 border-blue-400 bg-blue-50/20 rounded-md p-4 mb-4 text-center group cursor-pointer transition relative">
                  <div className="absolute top-1 right-2 text-[8px] bg-blue-500 text-white px-1.5 rounded-sm">Linked</div>
                  <div className="h-2 w-16 bg-gray-300 rounded mx-auto mb-2"></div>
                  <div className="h-1.5 w-full bg-gray-200 rounded mx-auto mb-1.5"></div>
                  <div className="h-1.5 w-10 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="w-full border shadow-sm border-gray-100 rounded-md p-4 text-center">
                  <div className="h-2 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-6 bg-gray-100 rounded"></div>
                    <div className="h-6 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Clean Layout) */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Transparent Pricing</h2>
          <p className="text-lg text-gray-500">Simple plans. Upgrade out of the free tier when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-gray-600 text-sm">
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Limited generations</li>
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Basic insights logic</li>
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Manual input only</li>
            </ul>
            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 rounded-xl transition">
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-xl relative flex flex-col scale-[1.02] z-10">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-0.5 rounded-full text-xs font-bold tracking-wide">
              PRO
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-gray-700 text-sm font-medium">
              <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Unlimited generations</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Advanced insights matching</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Tailwind theme exports</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Priority support</li>
            </ul>
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl shadow-md transition transform hover:scale-105 active:scale-95 duration-300">
              Upgrade Now
            </button>
          </div>

          {/* Business */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-gray-600 text-sm">
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Bulk automated processing</li>
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Native REST API access</li>
              <li className="flex items-start gap-2"><span className="text-gray-400">✓</span> Team workspaces</li>
            </ul>
            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 rounded-xl transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                I2S
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Insight2Site</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <Link href="#how-it-works" className="hover:text-gray-900 transition">How It Works</Link>
              <Link href="#demo" className="hover:text-gray-900 transition">Features</Link>
              <Link href="#pricing" className="hover:text-gray-900 transition">Pricing</Link>
              <Link href="#" className="hover:text-gray-900 transition">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Insight2Site Inc. All rights reserved.</p>
            <p>Designed for conversion.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
