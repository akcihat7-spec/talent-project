'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
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
    responseTime: '< 1 hour'
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
    status: 'available',
    skills: ['Python', 'Django', 'FastAPI', 'Pandas', 'NumPy'],
    experience: '4+ years',
    languages: ['English', 'Spanish'],
    responseTime: '< 2 hours'
  },
  {
    id: '3',
    name: 'CloudArchitect AI',
    title: 'DevOps & Cloud Architect',
    expertise: ['AWS', 'Docker', 'Kubernetes'],
    dailyRate: 350,
    rating: 4.7,
    projects: 156,
    description: 'Expert in cloud infrastructure, DevOps practices, and scalable system design. AWS certified solutions architect.',
    status: 'busy',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    experience: '7+ years',
    languages: ['English'],
    responseTime: '< 4 hours'
  },
  {
    id: '4',
    name: 'MobileDev AI',
    title: 'React Native Developer',
    expertise: ['React Native', 'iOS', 'Android'],
    dailyRate: 280,
    rating: 4.6,
    projects: 94,
    description: 'Expert in mobile app development using React Native. Published multiple apps on App Store and Play Store.',
    status: 'available',
    skills: ['React Native', 'TypeScript', 'Redux', 'Firebase'],
    experience: '3+ years',
    languages: ['English', 'French'],
    responseTime: '< 1 hour'
  },
  {
    id: '5',
    name: 'DataScience AI',
    title: 'Machine Learning Engineer',
    expertise: ['ML', 'TensorFlow', 'PyTorch'],
    dailyRate: 400,
    rating: 4.9,
    projects: 67,
    description: 'Specialized in machine learning, deep learning, and AI solutions. Experienced in computer vision and NLP.',
    status: 'available',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV'],
    experience: '6+ years',
    languages: ['English', 'German'],
    responseTime: '< 3 hours'
  },
  {
    id: '6',
    name: 'FullStack AI',
    title: 'Full-Stack Developer',
    expertise: ['Node.js', 'React', 'MongoDB'],
    dailyRate: 320,
    rating: 4.8,
    projects: 203,
    description: 'Full-stack developer with expertise in MERN stack and cloud deployment. Built numerous scalable applications.',
    status: 'available',
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'GraphQL'],
    experience: '8+ years',
    languages: ['English', 'Hindi'],
    responseTime: '< 2 hours'
  }
]

export default function MarketplacePage() {
  const [talents, setTalents] = useState<Talent[]>(mockTalents)
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>(mockTalents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'projects'>('rating')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const allSkills = Array.from(new Set(mockTalents.flatMap(t => t.skills))).sort()

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
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search talents..."
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'projects')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
            <option value="projects">Sort by Projects</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
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
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        selectedSkills.includes(skill)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$500</span>
                  </div>
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
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredTalents.length}</span> talents
        </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map(talent => (
          <div key={talent.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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
                    <h3 className="text-lg font-medium text-gray-900">{talent.name}</h3>
                    <p className="text-sm text-gray-500">{talent.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(talent.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  {favorites.includes(talent.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
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
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {talent.description}
              </p>

              {/* Skills */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {talent.expertise.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {talent.expertise.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
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
                    <span className="text-sm font-medium text-gray-900">{talent.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{talent.projects}</span>
                  </div>
                  <p className="text-xs text-gray-500">Projects</p>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">${talent.dailyRate}</span>
                  </div>
                  <p className="text-xs text-gray-500">Daily</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 space-y-2 text-xs text-gray-500">
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
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm">
                  Hire Now
                </button>
                <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-md text-sm">
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
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No talents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
