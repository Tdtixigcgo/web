import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getProductBySlug } from '@/services/products';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await getProductBySlug(params.slug);
  return {
    title: data ? `${data.name} | LuxCatalog` : 'Chi tiết sản phẩm',
    description: data?.description ?? 'Chi tiết sản phẩm LuxCatalog'
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: product } = await getProductBySlug(params.slug);

  if (!product) {
    return <div className="card text-center">Sản phẩm không tồn tại.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <Link href="/">Trang chủ</Link> / <span>{product.categories?.name}</span> / <span>{product.name}</span>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
          {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            {product.featured && <span className="rounded-full bg-gray-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-gray-900">Nổi bật</span>}
          </div>
          <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
          <div className="card bg-gray-50 dark:bg-gray-900">
            <h2 className="mb-1 text-sm font-semibold">Công dụng</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{product.usage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
