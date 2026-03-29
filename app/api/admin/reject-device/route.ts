import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { requireAdmin } from '@/lib/server/admin-auth';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { request_id } = await req.json();
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('admin_access_requests')
    .update({ status: 'rejected', approved_by: process.env.ADMIN_APPROVAL_EMAIL })
    .eq('id', request_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
