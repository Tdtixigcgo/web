import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { requireAdmin } from '@/lib/server/admin-auth';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const supabase = createSupabaseServiceClient();
  const [{ count: products }, { count: categories }, { count: featured }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true)
  ]);

  return NextResponse.json({
    totalProducts: products ?? 0,
    totalCategories: categories ?? 0,
    featuredProducts: featured ?? 0
  });
}
