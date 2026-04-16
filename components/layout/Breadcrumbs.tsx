"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const pathname = usePathname();

  if (!items.length) {
    return null;
  }

  const normalizedPathname = pathname?.replace(/\/+$/, '') || '/';

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500">
        {items.map((item, index) => {
          const normalizedHref = item.href ? (item.href.replace(/\/+$/, '') || '/') : '';
          const isActive = Boolean(normalizedHref) && normalizedPathname === normalizedHref;
          const Icon = item.icon;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isActive ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 rounded px-2 py-1 ${isActive ? 'bg-gray-900 text-white font-semibold' : 'text-gray-700 font-medium'}`}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  <span>{item.label}</span>
                </span>
              )}

              {index < items.length - 1 ? <ChevronRight className="h-3.5 w-3.5 text-gray-300" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
