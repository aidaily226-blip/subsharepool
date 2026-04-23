import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const userAgent = req.headers.get('user-agent') || ''
  const isFacebookBot =
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('Facebot')

  if (isFacebookBot) {
    return NextResponse.next()
  }

  const protectedRoutes = ['/messages', '/admin']
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}