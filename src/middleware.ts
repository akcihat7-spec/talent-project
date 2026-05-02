import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Sadece belirli path'lerde authentication kontrolü yap
  const protectedPaths = ['/dashboard']
  const authPaths = ['/login', '/signup']
  const publicPaths = ['/']
  
  // Eğer protected bir path'e erişmeye çalışıyorsa ve environment variables yoksa,
  // doğrudan geçiştir (Vercel'de hata vermemesi için)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Eğer dashboard'a erişmeye çalışıyorsa ve env yoksa login'e yönlendir
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Environment variables varsa normal authentication kontrolü yap
  try {
    const { createServerClient } = await import('@supabase/ssr')
    
    const res = NextResponse.next()
    
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

    // Dashboard protection - giriş yapmamışsa login'e yönlendir
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !session) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Auth routes redirect - giriş yapmışsa dashboard'a yönlendir
    if (authPaths.some(path => req.nextUrl.pathname.startsWith(path)) && session) {
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    // Ana sayfa kontrolü - giriş yapmışsa dashboard'a yönlendir
    if (publicPaths.some(path => req.nextUrl.pathname === path) && session) {
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    return res
  } catch (error) {
    // Supabase client oluşturulamazsa doğrudan geç
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/']
}
