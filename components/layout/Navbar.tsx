import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-gray-900 tracking-tight">Insight2Site</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link>
          <Link href="/#demo" className="hover:text-gray-900 transition-colors">Demo</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/app" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            Open App
          </Link>
        </div>
      </div>
    </nav>
  );
};
