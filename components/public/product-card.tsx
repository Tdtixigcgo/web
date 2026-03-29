import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card block overflow-hidden p-0">
      <div className="relative h-52 w-full bg-gray-100 dark:bg-gray-800">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold">{product.name}</h3>
          {product.featured && <span className="rounded-full bg-gray-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-gray-900">Nổi bật</span>}
        </div>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{product.description}</p>
        <p className="text-sm text-gray-500">Công dụng: {product.usage}</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{formatCurrency(product.price)}</p>
          <span className="text-xs text-gray-500">{product.categories?.name ?? 'Chưa phân loại'}</span>
        </div>
      </div>
    </Link>
  );
}
