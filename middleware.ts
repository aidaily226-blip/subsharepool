import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Block non-admins from admin routes
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedRoutes = ['/messages', '/admin']
        const isProtected = protectedRoutes.some(r => req.nextUrl.pathname.startsWith(r))
        if (isProtected) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/messages/:path*', '/admin/:path*'],
}
