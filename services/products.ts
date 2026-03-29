import { createSupabaseServerClient } from '@/supabase/server';

export async function getProducts(params: {
  q?: string;
  category?: string;
  minPrice?: string;
  featured?: string;
  page?: string;
}) {
  const supabase = createSupabaseServerClient();
  const page = Number(params.page ?? '1');
  const pageSize = 9;
  let query = supabase
    .from('products')
    .select('*, categories(id,name,slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (params.q) query = query.ilike('name', `%${params.q}%`);
  if (params.category) query = query.eq('category_id', params.category);
  if (params.minPrice) query = query.gte('price', Number(params.minPrice));
  if (params.featured === '1') query = query.eq('featured', true);

  return query;
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  return supabase
    .from('products')
    .select('*, categories(id,name,slug)')
    .eq('slug', slug)
    .single();
}
