import { createSupabaseServerClient } from '@/supabase/server';

export async function getCategories() {
  const supabase = createSupabaseServerClient();
  return supabase.from('categories').select('*').order('name');
}
