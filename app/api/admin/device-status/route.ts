import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get('device_id');
  if (!deviceId) return NextResponse.json({ approved: false, pending: false });

  const supabase = createSupabaseServiceClient();
  const [{ data: approved }, { data: pending }] = await Promise.all([
    supabase.from('approved_devices').select('id').eq('device_id', deviceId).eq('approved', true).maybeSingle(),
    supabase
      .from('admin_access_requests')
      .select('id')
      .eq('device_id', deviceId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  return NextResponse.json({ approved: !!approved, pending: !!pending });
}
