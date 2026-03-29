import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/ad/dashboard') || path.startsWith('/ad/requests')) {
    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/ad', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/ad/dashboard/:path*', '/ad/requests/:path*']
};
