'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container-page py-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/ad/dashboard" className="card px-3 py-2">Tổng quan</Link>
          <Link href="/ad/dashboard/products" className="card px-3 py-2">Sản phẩm</Link>
          <Link href="/ad/dashboard/categories" className="card px-3 py-2">Danh mục</Link>
          <Link href="/ad/requests" className="card px-3 py-2">Yêu cầu thiết bị</Link>
          <Button
            variant="secondary"
            onClick={async () => {
              await fetch('/api/admin/session', { method: 'DELETE' });
              window.location.href = '/ad';
            }}
          >
            Đăng xuất
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
