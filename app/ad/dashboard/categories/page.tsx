'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  const load = async () => {
    const res = await fetch('/api/categories');
    setCategories((await res.json()).data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const res = await fetch('/api/categories', { method: 'POST', body: JSON.stringify({ name }) });
    if (!res.ok) return toast.error('Thêm danh mục thất bại');
    toast.success('Đã thêm danh mục');
    setName('');
    load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    if (!res.ok) return toast.error('Xóa thất bại');
    toast.success('Đã xóa danh mục');
    load();
  };

  return (
    <div className="card space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Tên danh mục" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={add}>Thêm</Button>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-800">
            <span>{cat.name}</span>
            <Button variant="danger" onClick={() => remove(cat.id)}>Xóa</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
