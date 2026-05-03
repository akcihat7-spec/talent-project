'use client'

import { SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in and redirect to dashboard
    const timer = setTimeout(() => {
      window.location.assign('/dashboard')
    }, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Sign in with your preferred provider
            </p>
            <div className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <SignInButton 
                mode="modal"
                fallbackRedirectUrl="/dashboard"
              >
                Continue with Google
              </SignInButton>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <SignInButton 
                mode="modal"
                fallbackRedirectUrl="/dashboard"
              >
                Continue with Email
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
