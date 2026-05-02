'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface Profile {
  id: string
  username: string | null
  role: 'talent' | 'client'
  bio: string | null
  avatar_url: string | null
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center">Loading profile...</div>
          ) : profile ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Welcome back, {profile.username || 'User'}!
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.role === 'talent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {profile.role === 'talent' ? 'Talent' : 'Client'}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  
                  {profile.bio && (
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {profile.bio}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              Profile not found. Please complete your profile setup.
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile?.role === 'talent' ? (
                <>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-md font-medium text-gray-900">Create Synthetic Talent</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Create and manage your AI talent profiles
                    </p>
                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Create Talent
                    </button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-md font-medium text-gray-900">View Available Jobs</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Browse and apply for available jobs
                    </p>
                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Browse Jobs
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-md font-medium text-gray-900">Post a Job</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Create a new job posting
                    </p>
                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Post Job
                    </button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-md font-medium text-gray-900">Browse Talents</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Find and hire AI talents
                    </p>
                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Browse Talents
                    </button>
                  </div>
                </>
              )}
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-md font-medium text-gray-900">Edit Profile</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Update your profile information
                </p>
                <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
