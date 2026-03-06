import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/i/', '/welcome']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(?:ico|png|jpg|jpeg|webp|svg|gif|css|js|woff2?|ttf|otf|map)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  const hasAuthIndicator = request.cookies.get('lovepostal_auth')

  if (!hasAuthIndicator) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/welcome', request.url))
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|placeholder|opengraph|twitter|robots|sitemap).*)',
  ],
}
