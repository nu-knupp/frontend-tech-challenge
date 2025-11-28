import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookieName, verifyAuthToken } from '@banking/shared-utils';

const PROTECTED_PATHS = ['/transactions', '/analytics'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const payload = token ? await verifyAuthToken(token) : null;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !payload) {
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
