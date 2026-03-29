import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { slugify } from '@/lib/utils';

export async function GET() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: body.name, slug: slugify(body.name) })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const id = req.nextUrl.searchParams.get('id');
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
