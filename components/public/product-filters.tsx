'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';
import { Input } from '@/components/ui/input';

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/?${next.toString()}`);
  };

  return (
    <div className="card grid gap-3 md:grid-cols-4">
      <Input
        placeholder="Tìm kiếm sản phẩm..."
        defaultValue={params.get('q') ?? ''}
        onBlur={(e) => setParam('q', e.target.value)}
      />
      <select
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        defaultValue={params.get('category') ?? ''}
        onChange={(e) => setParam('category', e.target.value)}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((cat) => (
          <option value={cat.id} key={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <Input
        type="number"
        placeholder="Giá từ"
        defaultValue={params.get('minPrice') ?? ''}
        onBlur={(e) => setParam('minPrice', e.target.value)}
      />
      <label className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">
        <input
          type="checkbox"
          defaultChecked={params.get('featured') === '1'}
          onChange={(e) => setParam('featured', e.target.checked ? '1' : '')}
        />
        Chỉ sản phẩm nổi bật
      </label>
    </div>
  );
}
