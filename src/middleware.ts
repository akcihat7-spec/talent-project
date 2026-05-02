import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res.headers.append('Set-Cookie', req.cookies.toString())
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If accessing dashboard and not authenticated, redirect to login
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes and already authenticated, redirect to dashboard
  if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')) && session) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
