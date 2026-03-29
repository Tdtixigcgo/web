import { ProductCard } from '@/components/public/product-card';
import { ProductFilters } from '@/components/public/product-filters';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/services/categories';
import { getProducts } from '@/services/products';

export default async function Home({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const [{ data: categories }, { data: products, count }] = await Promise.all([
    getCategories(),
    getProducts(searchParams)
  ]);

  const page = Number(searchParams.page ?? '1');
  const hasMore = (count ?? 0) > page * 9;

  return (
    <div className="space-y-6">
      <section className="card space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Product Catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight">Trưng bày sản phẩm hiện đại, chuyên nghiệp</h1>
        <p className="mx-auto max-w-2xl text-gray-500">Khám phá các sản phẩm chất lượng cao với thiết kế tối giản, sang trọng và trải nghiệm mượt mà trên mọi thiết bị.</p>
      </section>

      <ProductFilters categories={categories ?? []} />

      {!products?.length ? (
        <div className="card text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <a href={`/?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`}>
            <Button variant="secondary">Load more</Button>
          </a>
        </div>
      )}
    </div>
  );
}
