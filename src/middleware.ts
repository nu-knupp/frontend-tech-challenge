import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/transactions', '/analytics']

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/transactions/:path*', '/analytics/:path*'],
}
