import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            I2S
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Insight2Site</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link>
          <Link href="/#demo" className="hover:text-blue-600 transition-colors">Demo</Link>
          <Link href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/app">
            <Button variant="primary" className="py-2 px-4 shadow-sm text-sm">Open App</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
