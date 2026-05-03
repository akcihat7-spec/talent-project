'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

type AuthContextType = {
  user: any | null
  session: any | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(!isLoaded)
  }, [isLoaded])

  const signOut = async () => {
    await clerkSignOut()
  }

  const refreshUser = async () => {
    // Clerk otomatik olarak user'ı günceller
    // Manuel refresh gerekmez
  }

  const value = {
    user,
    session: user, // Clerk'te session yerine user kullanılır
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
