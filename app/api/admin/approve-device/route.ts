import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';

export async function POST(req: NextRequest) {
  const { request_id } = await req.json();
  const supabase = createSupabaseServiceClient();

  const { data: request, error: requestError } = await supabase
    .from('admin_access_requests')
    .select('*')
    .eq('id', request_id)
    .single();

  if (requestError || !request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  await supabase.from('approved_devices').upsert({
    device_id: request.device_id,
    approved: true,
    approved_at: new Date().toISOString(),
    note: 'Approved from admin panel'
  });

  await supabase
    .from('admin_access_requests')
    .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: process.env.ADMIN_APPROVAL_EMAIL })
    .eq('id', request_id);

  return NextResponse.json({ ok: true });
}
