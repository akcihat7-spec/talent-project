'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface SyntheticTalent {
  id: string
  owner_id: string
  persona_data: {
    name?: string
    title?: string
    expertise?: string[]
    description?: string
    skills?: string[]
    experience?: string
    languages?: string[]
    response_time?: string
    github_username?: string
    avatar_url?: string
  }
  daily_rate: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

interface Talent {
  id: string
  name: string
  title: string
  expertise: string[]
  dailyRate: number
  rating: number
  projects: number
  description: string
  status: 'available' | 'busy' | 'offline'
  avatar?: string
  skills: string[]
  experience: string
  languages: string[]
  responseTime: string
  ownerId: string
  githubUsername?: string
}

const mockTalents: Talent[] = [
  {
    id: '1',
    name: 'ReactMaster AI',
    title: 'Senior React Developer',
    expertise: ['React', 'Next.js', 'TypeScript'],
    dailyRate: 250,
    rating: 4.9,
    projects: 127,
    description: 'Expert in React ecosystem with 5+ years of experience. Specialized in building scalable web applications.',
    status: 'available',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
    experience: '5+ years',
    languages: ['English', 'Turkish'],
    responseTime: '< 1 hour',
    ownerId: 'demo-1'
  },
  {
    id: '2',
    name: 'PythonExpert AI',
    title: 'Python Automation Expert',
    expertise: ['Python', 'Django', 'Data Science'],
    dailyRate: 300,
    rating: 4.8,
    projects: 89,
    description: 'Specialized in Python automation, data analysis, and backend development. Created numerous automation solutions.',
    status: 'busy',
    skills: ['Python', 'Django', 'Flask', 'Pandas', 'NumPy'],
    experience: '4+ years',
    languages: ['English', 'German'],
    responseTime: '< 2 hours',
    ownerId: 'demo-2'
  },
  {
    id: '3',
    name: 'NodeJS Ninja AI',
    title: 'Full Stack Node.js Developer',
    expertise: ['Node.js', 'Express', 'MongoDB'],
    dailyRate: 220,
    rating: 4.7,
    projects: 156,
    description: 'Full-stack developer with expertise in Node.js ecosystem. Built numerous RESTful APIs and real-time applications.',
    status: 'available',
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'Socket.io'],
    experience: '6+ years',
    languages: ['English', 'Spanish'],
    responseTime: '< 1 hour',
    ownerId: 'demo-3'
  },
  {
    id: '4',
    name: 'MobileDev Pro AI',
    title: 'Mobile App Developer',
    expertise: ['React Native', 'Flutter', 'iOS'],
    dailyRate: 280,
    rating: 4.9,
    projects: 73,
    description: 'Expert in mobile app development for both iOS and Android. Created award-winning applications with millions of downloads.',
    status: 'available',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    experience: '5+ years',
    languages: ['English', 'French', 'Japanese'],
    responseTime: '< 3 hours',
    ownerId: 'demo-4'
  },
  {
    id: '5',
    name: 'Cloud Architect AI',
    title: 'Cloud Solutions Architect',
    expertise: ['AWS', 'Docker', 'Kubernetes'],
    dailyRate: 350,
    rating: 4.8,
    projects: 45,
    description: 'Certified cloud architect with expertise in designing scalable cloud solutions. Led multiple enterprise migrations.',
    status: 'available',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Azure'],
    experience: '7+ years',
    languages: ['English', 'Chinese'],
    responseTime: '< 4 hours',
    ownerId: 'demo-5'
  },
  {
    id: '6',
    name: 'Data Scientist AI',
    title: 'Machine Learning Engineer',
    expertise: ['Machine Learning', 'Python', 'TensorFlow'],
    dailyRate: 320,
    rating: 4.9,
    projects: 62,
    description: 'Machine learning engineer specializing in deep learning and computer vision. Published research papers in top conferences.',
    status: 'busy',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras'],
    experience: '4+ years',
    languages: ['English', 'Italian'],
    responseTime: '< 2 hours',
    ownerId: 'demo-6'
  }
]

export default function MarketplacePage() {
  const { user } = useAuth()
  const [talents, setTalents] = useState<Talent[]>([])
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'projects'>('rating')
  const [showAIAgentModal, setShowAIAgentModal] = useState(false)
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [aiAgentStatus, setAiAgentStatus] = useState<'idle' | 'analyzing' | 'working' | 'completed'>('idle')
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('synthetic_talents')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching talents:', error)
        // Fallback to mock data
        setTalents(mockTalents)
        setFilteredTalents(mockTalents)
      } else if (data && data.length > 0) {
        // Transform synthetic talents to talent format
        const transformedTalents: Talent[] = data.map((st: SyntheticTalent) => ({
          id: st.id,
          name: st.persona_data?.name || 'AI Talent',
          title: st.persona_data?.title || 'AI Developer',
          expertise: st.persona_data?.expertise || [],
          dailyRate: st.daily_rate,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          projects: Math.floor(Math.random() * 100) + 20, // Random projects between 20-120
          description: st.persona_data?.description || 'AI-powered talent with advanced capabilities.',
          status: st.status === 'active' ? 'available' : 'offline',
          skills: st.persona_data?.skills || [],
          experience: st.persona_data?.experience || '3+ years',
          languages: st.persona_data?.languages || ['English'],
          responseTime: st.persona_data?.response_time || '< 2 hours',
          ownerId: st.owner_id,
          githubUsername: st.persona_data?.github_username,
          avatar: st.persona_data?.avatar_url
        }))

        setTalents(transformedTalents)
        setFilteredTalents(transformedTalents)
      } else {
        // No data in database, use mock data
        setTalents(mockTalents)
        setFilteredTalents(mockTalents)
      }
    } catch (error) {
      console.error('Error fetching talents:', error)
      // Fallback to mock data
      setTalents(mockTalents)
      setFilteredTalents(mockTalents)
    } finally {
      setLoading(false)
    }
  }
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const allSkills = Array.from(new Set(mockTalents.flatMap(t => t.skills))).sort()

  const handleHireNow = async (talent: Talent) => {
    if (!user) {
      alert('Please sign in to hire talent')
      return
    }

    setSelectedTalent(talent)
    setShowAIAgentModal(true)
    setAiAgentStatus('analyzing')
  }

  const startAIAgentWorkflow = async () => {
    if (!selectedTalent || !user) return

    try {
      setAiAgentStatus('working')
      
      // Call AI Agent API to resolve GitHub issue
      const response = await fetch('/api/ai-agent/resolve-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          talentId: selectedTalent.id,
          talentName: selectedTalent.name,
          githubUsername: selectedTalent.githubUsername,
          clientId: user.id,
          clientName: user.email
        })
      })

      const result = await response.json()

      if (response.ok) {
        setAiAgentStatus('completed')
        // Show success message with issue resolution details
        alert(`AI Agent successfully resolved issue!\n\nIssue: ${result.issueTitle}\nSolution: ${result.solution}\nTime taken: ${result.timeTaken} minutes`)
      } else {
        throw new Error(result.error || 'Failed to resolve issue')
      }
    } catch (error) {
      console.error('AI Agent error:', error)
      setAiAgentStatus('idle')
      alert('Failed to start AI Agent. Please try again.')
    }
  }

  useEffect(() => {
    let filtered = talents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(talent =>
        selectedSkills.some(skill => talent.skills.includes(skill))
      )
    }

    // Price filter
    filtered = filtered.filter(talent =>
      talent.dailyRate >= priceRange[0] && talent.dailyRate <= priceRange[1]
    )

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return a.dailyRate - b.dailyRate
        case 'projects':
          return b.projects - a.projects
        default:
          return 0
      }
    })

    setFilteredTalents(filtered)
  }, [searchTerm, selectedSkills, priceRange, sortBy, talents])

  const toggleFavorite = (talentId: string) => {
    setFavorites(prev =>
      prev.includes(talentId)
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'busy':
        return 'Busy'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  return (
    <DashboardLayout title="Talent Marketplace" subtitle="Find and hire the best AI talents">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search talents..."
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'projects')}
            className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
            <option value="projects">Sort by Projects</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Filter */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSelectedSkills(prev =>
                          prev.includes(skill)
                            ? prev.filter(s => s !== skill)
                            : [...prev, skill]
                        )
                      }}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Price Range ($/day)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">${priceRange[0]}</span>
                    <span className="text-sm text-gray-400">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedSkills([])
                  setPriceRange([0, 500])
                  setSearchTerm('')
                }}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{filteredTalents.length}</span> talents
        </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map(talent => (
          <div key={talent.id} className="bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {talent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{talent.name}</h3>
                    <p className="text-sm text-gray-400">{talent.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(talent.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  {favorites.includes(talent.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-400" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(talent.status)}`}>
                  {getStatusText(talent.status)}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-300 line-clamp-2">
                {talent.description}
              </p>

              {/* Skills */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {talent.expertise.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {talent.expertise.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                      +{talent.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-white">{talent.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-white">{talent.projects}</span>
                  </div>
                  <p className="text-xs text-gray-400">Projects</p>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-white">${talent.dailyRate}</span>
                  </div>
                  <p className="text-xs text-gray-400">Daily</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 space-y-2 text-xs text-gray-400">
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Response time: {talent.responseTime}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-3 w-3 mr-1" />
                  Experience: {talent.experience}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button 
                  onClick={() => handleHireNow(talent)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Hire Now
                </button>
                <button className="flex-1 border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium py-2 px-4 rounded-md text-sm transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTalents.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-white">No talents found</h3>
          <p className="mt-1 text-sm text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* AI Agent Modal */}
      {showAIAgentModal && selectedTalent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-gray-900 border-gray-800">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-white">
                AI Agent İş Akışı Başlatılıyor
              </h3>
              <div className="mt-4">
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedTalent.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-white">{selectedTalent.name}</h4>
                      <p className="text-sm text-gray-400">{selectedTalent.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    AI Agent, {selectedTalent.name} yeteneklerini kullanarak GitHub reposundaki bir issue'yu çözmek için çalışacak.
                  </p>
                </div>

                {/* AI Agent Status */}
                <div className="mt-4 space-y-3">
                  {aiAgentStatus === 'analyzing' && (
                    <div className="flex items-center text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                      <span className="text-sm">AI Agent analiz ediyor...</span>
                    </div>
                  )}
                  
                  {aiAgentStatus === 'working' && (
                    <div className="flex items-center text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                      <span className="text-sm">AI Agent issue çözüyor...</span>
                    </div>
                  )}
                  
                  {aiAgentStatus === 'completed' && (
                    <div className="flex items-center text-green-400">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Issue başarıyla çözüldü!</span>
                    </div>
                  )}
                </div>

                {/* GitHub Info */}
                {selectedTalent.githubUsername && (
                  <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">GitHub:</span> {selectedTalent.githubUsername}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAIAgentModal(false)
                    setSelectedTalent(null)
                    setAiAgentStatus('idle')
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
                  disabled={aiAgentStatus === 'working'}
                >
                  İptal
                </button>
                <button
                  onClick={startAIAgentWorkflow}
                  disabled={aiAgentStatus !== 'analyzing'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiAgentStatus === 'analyzing' ? 'Başlatılıyor...' : 'AI Agent Başlat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
