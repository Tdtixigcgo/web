import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { slugify } from '@/lib/utils';

export async function GET() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const body = await req.json();
  const payload = { ...body, slug: slugify(body.name), price: Number(body.price) };
  const { data, error } = await supabase.from('products').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const body = await req.json();
  const { id, ...rest } = body;
  const payload = { ...rest, slug: slugify(rest.name), price: Number(rest.price) };
  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const id = req.nextUrl.searchParams.get('id');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
