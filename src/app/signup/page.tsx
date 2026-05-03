'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already signed in and redirect to dashboard
    const timer = setTimeout(() => {
      window.location.assign('/dashboard')
    }, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">TH</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              Sign up with your preferred provider
            </p>
            <div className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <SignUpButton 
                mode="modal"
                fallbackRedirectUrl="/dashboard"
              >
                Continue with Google
              </SignUpButton>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-950 text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full flex justify-center py-3 px-4 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <SignUpButton 
                mode="modal"
                fallbackRedirectUrl="/dashboard"
              >
                Continue with Email
              </SignUpButton>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="#" className="text-blue-400 hover:text-blue-300">Terms</Link>{' '}
            and{' '}
            <Link href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
