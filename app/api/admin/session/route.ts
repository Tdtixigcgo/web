import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';
import { adminCookieMaxAge, adminCookieName, createAdminSessionToken, verifyAdminSessionToken } from '@/lib/server/admin-auth';

export async function POST(req: NextRequest) {
  const { access_token, device_id } = await req.json();
  if (!access_token || !device_id) {
    return NextResponse.json({ error: 'Missing access_token or device_id' }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const [{ data: userInfo }, { data: device }, { data: adminUser }] = await Promise.all([
    supabase.auth.getUser(access_token),
    supabase.from('approved_devices').select('device_id,approved').eq('device_id', device_id).eq('approved', true).maybeSingle(),
    supabase.from('admin_users').select('email').limit(1)
  ]);

  const email = userInfo.user?.email;
  if (!email || !device) return NextResponse.json({ error: 'Unauthorized device or user' }, { status: 401 });

  const isAllowed = !!adminUser?.find((u) => u.email === email);
  if (!isAllowed) return NextResponse.json({ error: 'User is not in admin_users' }, { status: 403 });

  const token = createAdminSessionToken({
    uid: userInfo.user!.id,
    email,
    deviceId: device_id
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: adminCookieMaxAge
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(adminCookieName)?.value;
  const parsed = verifyAdminSessionToken(token);
  const res = NextResponse.json({ ok: true, hadSession: !!parsed });
  res.cookies.set(adminCookieName, '', { path: '/', maxAge: 0 });
  return res;
}
