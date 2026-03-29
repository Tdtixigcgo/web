import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { requireAdmin } from '@/lib/server/admin-auth';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('admin_access_requests')
    .select('*')
    .order('requested_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServiceClient();
  const body = await req.json();

  const { data: existed } = await supabase
    .from('admin_access_requests')
    .select('id')
    .eq('device_id', body.device_id)
    .eq('status', 'pending')
    .maybeSingle();

  if (!existed) {
    const { error } = await supabase.from('admin_access_requests').insert({
      device_id: body.device_id,
      device_name: body.device_name,
      browser_info: body.browser_info,
      email_target: process.env.ADMIN_APPROVAL_EMAIL,
      status: 'pending'
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-approval-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: body.device_id,
        device_name: body.device_name,
        browser_info: body.browser_info
      })
    });
  }

  return NextResponse.json({ ok: true });
}
