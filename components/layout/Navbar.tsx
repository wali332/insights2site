import React from 'react';
import Link from 'next/link';
import { CircleHelp, Eye, Menu, Rocket, Sparkles, Tag } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto h-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-gray-700" />
          <span className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight truncate">Insight2Site</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <Link href="/#how-it-works" className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors"><CircleHelp className="h-3.5 w-3.5" />How It Works</Link>
          <Link href="/#demo" className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Eye className="h-3.5 w-3.5" />Demo</Link>
          <Link href="/#pricing" className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Tag className="h-3.5 w-3.5" />Pricing</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/app" className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            <Rocket className="h-3.5 w-3.5" />
            Open App
          </Link>
        </div>

        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 inline-flex items-center gap-1.5">
            <Menu className="h-3.5 w-3.5" />
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            <Link href="/#how-it-works" className="inline-flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><CircleHelp className="h-3.5 w-3.5" />How It Works</Link>
            <Link href="/#demo" className="inline-flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Eye className="h-3.5 w-3.5" />Demo</Link>
            <Link href="/#pricing" className="inline-flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Tag className="h-3.5 w-3.5" />Pricing</Link>
            <Link href="/app" className="mt-1 inline-flex w-full items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"><Rocket className="h-3.5 w-3.5" />Open App</Link>
          </div>
        </details>
      </div>
    </nav>
  );
};
