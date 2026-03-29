'use client';

import { useEffect, useState } from 'react';
import { Product, Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/product-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | undefined>();

  const load = async () => {
    const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
    setProducts((await pRes.json()).data || []);
    setCategories((await cRes.json()).data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (!res.ok) return toast.error('Xóa thất bại');
    toast.success('Đã xóa sản phẩm');
    load();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
      <ProductForm product={editing} categories={categories} onDone={() => { setEditing(undefined); load(); }} />
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Tên</th><th>Giá</th><th>Nổi bật</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="py-2">{p.name}</td>
                <td>{p.price}</td>
                <td>{p.featured ? 'Yes' : 'No'}</td>
                <td className="space-x-2 text-right">
                  <Button variant="secondary" onClick={() => setEditing(p)}>Sửa</Button>
                  <Button variant="danger" onClick={() => remove(p.id)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
