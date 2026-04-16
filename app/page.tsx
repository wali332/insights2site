import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white font-sans text-gray-900">
      <Navbar />

      {/* Subtle Background Blobs (Depth) */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-gray-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-96 left-0 -translate-x-1/3 w-[600px] h-[600px] bg-gray-200/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none z-0"></div>

      {/* Hero Section (Split Layout) */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center animate-fade-in">
        
        {/* Left: Copy & CTAs */}
        <div className="text-left animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-medium tracking-tight text-gray-800 mb-6 leading-[1.1] pr-4">
            Turn Customer Reviews into <br className="hidden xl:block" />
            <span className="font-bold text-gray-900">Conversion-Ready Websites</span>
          </h1>
          
          <p className="mt-2 text-2xl text-gray-600 max-w-xl mb-12 leading-relaxed font-medium">
            Paste reviews. Get insights. Launch your website.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 mb-5">
            <Link href="/app" className="w-full sm:w-auto text-center bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:scale-105 hover:shadow-xl shadow-lg transition-all duration-300 text-lg active:scale-95">
              Start Generating Free
            </Link>
            <Link href="#demo" className="w-full sm:w-auto text-center bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 shadow-sm transition-all duration-300 text-lg">
              View Live Demo
            </Link>
          </div>
          <p className="text-sm text-gray-400 font-medium tracking-wide">
            No setup • Instant results • Built for real businesses
          </p>
        </div>

        {/* Right: Product Preview Mock (Floating UI) */}
        <div className="relative pt-10 lg:pt-0 w-full flex flex-col items-center lg:items-end">
          
          {/* Header Label */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-gray-200/50 text-xs font-bold text-gray-500 uppercase tracking-widest animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span>Insights</span> 
            <svg className="w-3 h-3 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span>Website</span>
          </div>

          <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col sm:flex-row p-2 transition-transform duration-500 hover:-translate-y-2 group animate-float">
            
            {/* Left Side: Insights Mock */}
            <div className="w-full sm:w-2/5 border-b sm:border-b-0 sm:border-r border-gray-100 p-5 bg-white/50 flex flex-col gap-4 rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl">
              
              <div className="opacity-0 animate-fade-in-up p-3 bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gray-500 relative transform transition group-hover:scale-[1.02]" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-xs">⚠️</span>
                  <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full ring-4 ring-white shadow-md hidden sm:block animate-pulse-line"></div>
              </div>
              
              <div className="opacity-0 animate-fade-in-up p-3 bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gray-400" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-xs">❤️</span>
                  <div className="h-1.5 bg-gray-200 rounded-full w-4/5"></div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full w-full"></div>
              </div>
              
              <div className="opacity-0 animate-fade-in-up p-3 bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gray-300" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-xs">🔑</span>
                  <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full w-2/3"></div>
              </div>
            </div>

            {/* Right Side: UI Generation Mock */}
            <div className="w-full sm:w-3/5 bg-gray-50/50 p-5 relative sm:rounded-r-xl opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                </div>
                <span className="text-[9px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-full bg-white">AI Generated Website</span>
              </div>
              
              {/* Connection Line */}
              <div className="absolute top-[84px] -left-3 z-0 hidden sm:block">
                <div className="w-6 border-b-[3px] border-dotted border-gray-300 animate-pulse-line bg-transparent"></div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-5 border border-gray-200 relative animate-glow-highlight">
                 <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                 <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
                 <div className="h-1.5 bg-gray-100 rounded-full w-5/6 mx-auto mb-2"></div>
                 <div className="h-1.5 bg-gray-100 rounded-full w-2/3 mx-auto mb-6"></div>
                 <div className="flex justify-center gap-2">
                   <div className="h-5 bg-gray-900 rounded w-16 text-[8px] flex items-center justify-center text-white/50 shadow-sm">CTA</div>
                   <div className="h-5 bg-white border border-gray-200 rounded w-16"></div>
                 </div>
              </div>

              <div className="bg-white border shadow-sm border-gray-100 rounded-md p-4">
                <div className="h-2 w-1/4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-50 rounded border border-gray-100"></div>
                  <div className="h-10 bg-gray-50 rounded border border-gray-100"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-gray-200/60 max-w-6xl mx-auto relative z-10 mb-8"></div>

      {/* How It Works Section - Minimal Editorial Design */}
      <section id="how-it-works" className="py-24 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20 text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-xl">From messy feedback to a polished layout.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            
            <div className="flex flex-col text-left group">
              <div className="text-5xl font-extrabold text-gray-200 tracking-tighter mb-4 transition-colors group-hover:text-gray-900">01</div>
              <div className="w-full h-px bg-gray-200 mb-6 transition-colors group-hover:bg-gray-900"></div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 tracking-tight">Paste Reviews</h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                Drop raw feedback directly into the engine. It parses anything from Trustpilot reviews to raw interview transcripts.
              </p>
            </div>

            <div className="flex flex-col text-left group">
              <div className="text-5xl font-extrabold text-gray-200 tracking-tighter mb-4 transition-colors group-hover:text-gray-900">02</div>
              <div className="w-full h-px bg-gray-200 mb-6 transition-colors group-hover:bg-gray-900"></div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 tracking-tight">Extract Insights</h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                The semantic engine categorizes sentiment instantly, revealing exactly what users hate and what outcomes they desire.
              </p>
            </div>

            <div className="flex flex-col text-left group">
              <div className="text-5xl font-extrabold text-gray-200 tracking-tighter mb-4 transition-colors group-hover:text-gray-900">03</div>
              <div className="w-full h-px bg-gray-200 mb-6 transition-colors group-hover:bg-gray-900"></div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 tracking-tight">Generate Website</h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                A structured UI is generated dynamically. Every headline and benefit traces directly back to a verified user insight.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Data-driven design, <br/>made simple.</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop designing in the dark. Insight2Site connects actual user friction to UI components directly. You can map pain points to your Hero Section, or desires to your Benefits grid effortlessly.
              </p>
              <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center text-sm font-bold">✓</span> No hardcoding required
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center text-sm font-bold">✓</span> Export-ready Tailwind markup
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center text-sm font-bold">✓</span> Instantly validate copy
               </li>
              </ul>
              <Link href="/app" className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-gray-700 group">
                Try the dashboard
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            
            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-200 p-2 overflow-hidden flex">
              <div className="w-1/2 border-r border-gray-100 p-4 shrink-0 bg-gray-50/50">
                <div className="h-2 w-16 bg-gray-300 rounded mb-4"></div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 mb-2 ring-1 ring-gray-900 scale-[1.02]">
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
                <div className="w-full border-2 border-gray-800 bg-gray-50/50 rounded-md p-4 mb-4 text-center group cursor-pointer transition relative">
                  <div className="absolute top-1 right-2 text-[8px] bg-gray-900 text-white px-1.5 rounded-sm">Linked</div>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Transparent Pricing</h2>
          <p className="text-lg text-gray-500">Simple plans. Upgrade out of the free tier when you&apos;re ready.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition shadow-sm">
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

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-xl relative flex flex-col scale-[1.02] z-10">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-0.5 rounded-full text-xs font-bold tracking-wide">
              PRO
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-gray-700 text-sm font-medium">
              <li className="flex items-start gap-2"><span className="text-gray-900">✓</span> Unlimited generations</li>
              <li className="flex items-start gap-2"><span className="text-gray-900">✓</span> Advanced insights matching</li>
              <li className="flex items-start gap-2"><span className="text-gray-900">✓</span> Tailwind theme exports</li>
              <li className="flex items-start gap-2"><span className="text-gray-900">✓</span> Priority support</li>
            </ul>
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl shadow-md transition transform hover:scale-105 active:scale-95 duration-300">
              Upgrade Now
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-gray-300 transition shadow-sm md:col-span-2 lg:col-span-1">
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
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-gray-900 tracking-tight">Insight2Site</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <Link href="#how-it-works" className="hover:text-gray-900 transition">How It Works</Link>
              <Link href="#demo" className="hover:text-gray-900 transition">Features</Link>
              <Link href="#pricing" className="hover:text-gray-900 transition">Pricing</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Insight2Site Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
