'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/public/theme-toggle';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LuxCatalog
        </Link>
        <div className="flex items-center gap-3"><nav className="text-sm text-gray-600 dark:text-gray-300">Sản phẩm chất lượng cao</nav><ThemeToggle /></div>
      </div>
    </header>
  );
}
