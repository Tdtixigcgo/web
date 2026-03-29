import { cookies } from 'next/headers';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/supabase/server';

const COOKIE_NAME = 'ad_session';
const MAX_AGE = 60 * 60 * 12;

export type AdminSessionPayload = {
  uid: string;
  email: string;
  deviceId: string;
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret';
}

function sign(data: string) {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('hex');
}

export function createAdminSessionToken(payload: Omit<AdminSessionPayload, 'exp'>) {
  const fullPayload: AdminSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE
  };
  const raw = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = sign(raw);
  return `${raw}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): AdminSessionPayload | null {
  if (!token) return null;
  const [raw, signature] = token.split('.');
  if (!raw || !signature) return null;
  const expected = sign(raw);
  if (expected.length !== signature.length) return null;
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return null;
  try {
    const payload = JSON.parse(Buffer.from(raw, 'base64url').toString()) as AdminSessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabase = createSupabaseServiceClient();
  const [{ data: device }, { data: adminUser }] = await Promise.all([
    supabase.from('approved_devices').select('device_id, approved').eq('device_id', session.deviceId).eq('approved', true).maybeSingle(),
    supabase.from('admin_users').select('email').eq('email', session.email).maybeSingle()
  ]);

  if (!device || !adminUser) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { session };
}

export const adminCookieName = COOKIE_NAME;
export const adminCookieMaxAge = MAX_AGE;
