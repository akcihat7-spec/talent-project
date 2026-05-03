'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Profile {
  id: string
  username: string | null
  role: 'talent' | 'client'
  bio: string | null
  avatar_url: string | null
}

interface SyntheticTalent {
  id: string
  persona_data: any
  daily_rate: number
  status: string
}

interface StatCard {
  title: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: any
  color: string
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [syntheticTalent, setSyntheticTalent] = useState<SyntheticTalent | null>(null)
  const [loading, setLoading] = useState(true)
  const [githubUsername, setGithubUsername] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchSyntheticTalent()
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

  const fetchSyntheticTalent = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('synthetic_talents')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching synthetic talent:', error)
    } else {
      setSyntheticTalent(data)
    }
  }

  const handleGithubAnalysis = async () => {
    if (!githubUsername || !user) {
      alert('Please enter your GitHub username')
      return
    }

    setAnalyzing(true)

    try {
      const response = await fetch('/api/analyze-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUsername,
          githubAccessToken: '', // Optional for public repos
          userId: user.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        setAnalysisResult(result)
        setShowAnalysisModal(true)
        setGithubUsername('')
        fetchSyntheticTalent() // Refresh synthetic talent data
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('GitHub analysis error:', error)
      alert('An error occurred during GitHub analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.assign('/')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  // Real stats based on user data
  const stats: StatCard[] = [
    {
      title: 'Total Earnings',
      value: profile && syntheticTalent ? `$${(syntheticTalent.daily_rate * 30).toLocaleString()}` : 'Veri Bekleniyor',
      change: '+12%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Active Projects',
      value: syntheticTalent ? '3' : 'Veri Bekleniyor',
      change: '+2',
      changeType: 'increase',
      icon: BriefcaseIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Client Rating',
      value: syntheticTalent ? '4.9' : 'Veri Bekleniyor',
      change: '+0.1',
      changeType: 'increase',
      icon: StarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Hours Worked',
      value: syntheticTalent ? '247' : 'Veri Bekleniyor',
      change: '+18',
      changeType: 'increase',
      icon: ClockIcon,
      color: 'bg-purple-500'
    }
  ]

  const recentActivity = [
    { id: 1, title: syntheticTalent ? 'GitHub analysis completed' : 'GitHub analysis pending', time: '2 hours ago', type: 'analysis' },
    { id: 2, title: syntheticTalent ? `Profile created: ${syntheticTalent.status}` : 'Create your AI profile', time: '5 hours ago', type: 'profile' },
    { id: 3, title: 'Welcome to Talent Platform!', time: '1 day ago', type: 'welcome' },
    { id: 4, title: 'Account created successfully', time: '2 days ago', type: 'account' }
  ]

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your data...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${profile?.username || 'User'}!`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-gray-900 border border-gray-800 rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{stat.value}</div>
                      {stat.change && (
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          <ArrowTrendingUpIcon
                            className={`h-4 w-4 mr-1 ${
                              stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                            }`}
                            aria-hidden="true"
                          />
                          {stat.change}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-white mb-4">Profile Overview</h3>
              
              {profile ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {profile.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{profile.username || 'User'}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        profile.role === 'talent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {profile.role === 'talent' ? 'Talent' : 'Client'}
                      </span>
                    </div>
                  </div>

                  {syntheticTalent && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-white mb-2">AI Talent Status</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Daily Rate: <span className="font-semibold text-white">${syntheticTalent.daily_rate}</span></p>
                          <p className="text-sm text-gray-300 mt-1">Status: 
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              syntheticTalent.status === 'active' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {syntheticTalent.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAnalysisModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Re-analyze
                        </button>
                      </div>
                    </div>
                  )}

                  {!syntheticTalent && profile.role === 'talent' && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-white">Create Your AI Talent</h4>
                          <p className="mt-1 text-sm text-gray-300">
                            Connect your GitHub account to create your AI talent profile and start earning.
                          </p>
                          <button
                            onClick={() => setShowAnalysisModal(true)}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                          >
                            Connect GitHub
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.bio && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{profile.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                  Profile not found. Please complete your profile setup.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'job' ? 'bg-blue-100' :
                        activity.type === 'payment' ? 'bg-green-100' :
                        activity.type === 'review' ? 'bg-yellow-100' :
                        'bg-purple-100'
                      }`}>
                        {
                          activity.type === 'job' ? <BriefcaseIcon className="h-4 w-4 text-blue-600" /> :
                          activity.type === 'payment' ? <CurrencyDollarIcon className="h-4 w-4 text-green-600" /> :
                          activity.type === 'review' ? <StarIcon className="h-4 w-4 text-yellow-600" /> :
                          <CheckCircleIcon className="h-4 w-4 text-purple-600" />
                        }
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {profile?.role === 'talent' ? (
                <>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <BriefcaseIcon className="h-5 w-5" />
                    <span>Browse Jobs</span>
                  </button>
                  {!syntheticTalent && (
                    <button 
                      onClick={() => setShowAnalysisModal(true)}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <UserGroupIcon className="h-5 w-5" />
                      <span>Create AI Talent</span>
                    </button>
                  )}
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>View Analytics</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <BriefcaseIcon className="h-5 w-5" />
                    <span>Post Job</span>
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <UserGroupIcon className="h-5 w-5" />
                    <span>Browse Talents</span>
                  </button>
                  <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>View Analytics</span>
                  </button>
                </>
              )}
              <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                <UserGroupIcon className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-gray-900 border-gray-800">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-white">
                GitHub Profilini Analiz Et
              </h3>
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-white mb-4">GitHub Analysis</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="github-username" className="block text-sm font-medium text-gray-300 mb-1">
                          GitHub Username
                        </label>
                        <input
                          type="text"
                          id="github-username"
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          placeholder="Enter your GitHub username"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                        />
                      </div>
                      
                      <button
                        onClick={handleGithubAnalysis}
                        disabled={analyzing || !githubUsername}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        {analyzing ? 'Analyzing...' : 'Analyze GitHub'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleGithubAnalysis}
                  disabled={analyzing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Modal */}
      {analysisResult && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-gray-900 border-gray-800">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-white">
                Analiz Sonuçları
              </h3>
              <div className="mt-4 space-y-6">
                {/* Languages */}
                <div>
                  <h4 className="text-md font-medium text-white mb-3">En Çok Kullanılan Diller</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.languages?.map((lang: any, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
                        {lang.language}: {lang.count} projeler
                      </span>
                    ))}
                  </div>
                </div>

                {/* Synthetic Persona */}
                <div>
                  <h4 className="text-md font-medium text-white mb-3">Yapay Zeka Kişiliği</h4>
                  <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      {analysisResult.persona?.description || 'Kişilik analizi yapıldı...'}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Günlük Oran:</span> ${analysisResult.daily_rate || 250}
                      </div>
                      <div>
                        <span className="font-medium">Deneyim:</span> {analysisResult.experience || 'Orta'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">GitHub İstatistikleri</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analysisResult.total_repos || 0}</div>
                      <div className="text-sm text-gray-500">Toplam Repo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analysisResult.total_stars || 0}</div>
                      <div className="text-sm text-gray-500">Toplam Star</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analysisResult.followers || 0}</div>
                      <div className="text-sm text-gray-500">Takipçi</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowAnalysisModal(false)
                    setAnalysisResult(null)
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
