import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // ✅ Detect Facebook crawler
  const userAgent = req.headers.get('user-agent') || ''
  const isFacebookBot =
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('Facebot')

  // ✅ Allow bots to bypass auth
  if (isFacebookBot) {
    return NextResponse.next()
  }

  const protectedRoutes = ['/messages', '/admin']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/messages/:path*', '/admin/:path*'],
}