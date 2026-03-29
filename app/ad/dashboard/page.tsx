import { createSupabaseServiceClient } from '@/supabase/server';

export default async function DashboardPage() {
  const supabase = createSupabaseServiceClient();
  const [{ count: totalProducts }, { count: totalCategories }, { count: featuredProducts }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true)
  ]);

  const cards = [
    { title: 'Tổng sản phẩm', value: totalProducts ?? 0 },
    { title: 'Tổng danh mục', value: totalCategories ?? 0 },
    { title: 'Sản phẩm nổi bật', value: featuredProducts ?? 0 }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((item) => (
        <div key={item.title} className="card">
          <p className="text-sm text-gray-500">{item.title}</p>
          <p className="mt-2 text-3xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
