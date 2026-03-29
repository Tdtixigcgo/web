import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { v4 as uuid } from 'uuid';
import { requireAdmin } from '@/lib/server/admin-auth';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const supabase = createSupabaseServiceClient();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const path = `products/${uuid()}-${file.name}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
