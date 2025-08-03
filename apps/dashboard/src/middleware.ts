import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard/transactions', '/dashboard/analytics'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !session) {
    const loginUrl = new URL('http://localhost:3000/login');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/transactions/:path*', '/dashboard/analytics/:path*'],
};
