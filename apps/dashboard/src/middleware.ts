import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/transactions', '/analytics'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !session) {
    // Redirecionar para o banking app (onde está o login) usando o domínio correto
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const loginUrl = new URL('/login', `${protocol}://${host}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/transactions/:path*', '/analytics/:path*'],
};
