import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/server/admin-auth';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/ad/dashboard') || path.startsWith('/ad/requests')) {
    const token = req.cookies.get('ad_session')?.value;
    const parsed = verifyAdminSessionToken(token);
    if (!parsed) {
      return NextResponse.redirect(new URL('/ad', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/ad/dashboard/:path*', '/ad/requests/:path*']
};
