import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Para desenvolvimento, apenas continue - os rewrites no next.config.js cuidarão do roteamento
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Para produção, você pode adicionar lógica específica aqui
  return NextResponse.next();
}

export const config = {
  matcher: ['/transactions/:path*', '/analytics/:path*'],
};
