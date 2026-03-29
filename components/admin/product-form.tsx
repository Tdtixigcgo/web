'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Category, Product } from '@/lib/types';
import { toast } from 'sonner';

type Props = { product?: Product; categories: Category[]; onDone: () => void };

export function ProductForm({ product, categories, onDone }: Props) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    usage: product?.usage ?? '',
    price: String(product?.price ?? 0),
    category_id: product?.category_id ?? categories[0]?.id ?? '',
    featured: product?.featured ?? false,
    image_url: product?.image_url ?? ''
  });

  const [preview, setPreview] = useState(form.image_url);

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.set('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body });
    if (!res.ok) return toast.error('Upload ảnh thất bại');
    const payload = await res.json();
    setForm((prev) => ({ ...prev, image_url: payload.url }));
    setPreview(payload.url);
  };

  const onSubmit = async () => {
    const method = product ? 'PUT' : 'POST';
    const res = await fetch('/api/products', {
      method,
      body: JSON.stringify({ ...form, id: product?.id })
    });

    if (!res.ok) return toast.error('Lưu sản phẩm thất bại');
    toast.success(product ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công');
    onDone();
  };

  return (
    <div className="card space-y-3">
      <Input placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Textarea placeholder="Công dụng" value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })} />
      <Input type="number" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <select
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        value={form.category_id}
        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <label className="text-sm">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Nổi bật
      </label>
      <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
      {preview && <img src={preview} alt="preview" className="h-32 w-32 rounded-xl object-cover" />}
      <Button onClick={onSubmit}>Lưu</Button>
    </div>
  );
}
