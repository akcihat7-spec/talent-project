import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth()
  
  // Dashboard protection - giriş yapmamışsa login'e yönlendir
  if (isProtectedRoute(req) && !userId) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Auth routes redirect - giriş yapmışsa dashboard'a yönlendir
  if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')) && userId) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Ana sayfa kontrolü - giriş yapmışsa dashboard'a yönlendir
  if (req.nextUrl.pathname === '/' && userId) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/']
}
