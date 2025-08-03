import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/transactions', '/analytics'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !session) {
    // Redirecionar para o banking app (onde está o login)
    const loginUrl = new URL('/login', request.url);
    loginUrl.port = '3000'; // Porta do banking app
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/transactions/:path*', '/analytics/:path*'],
};
