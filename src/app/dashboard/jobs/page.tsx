'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Job {
  id: string
  title: string
  description: string
  budget: number
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  clientName: string
  clientRating: number
  location: string
  postedDate: string
  deadline: string
  skills: string[]
  applicants: number
  type: 'fixed' | 'hourly'
  duration: string
  experience: 'junior' | 'mid' | 'senior'
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer Needed',
    description: 'Looking for an experienced React developer to build a modern e-commerce platform with Next.js and TypeScript.',
    budget: 5000,
    status: 'open',
    clientName: 'TechCorp Inc.',
    clientRating: 4.8,
    location: 'Remote',
    postedDate: '2024-05-01',
    deadline: '2024-06-15',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    applicants: 12,
    type: 'fixed',
    duration: '2-3 months',
    experience: 'senior'
  },
  {
    id: '2',
    title: 'Python Automation Expert',
    description: 'Need a Python expert to automate data processing workflows and create API integrations.',
    budget: 3500,
    status: 'open',
    clientName: 'DataFlow Solutions',
    clientRating: 4.6,
    location: 'New York, NY',
    postedDate: '2024-04-28',
    deadline: '2024-05-30',
    skills: ['Python', 'Django', 'API', 'Automation'],
    applicants: 8,
    type: 'fixed',
    duration: '1 month',
    experience: 'mid'
  },
  {
    id: '3',
    title: 'Full-Stack Developer for SaaS Platform',
    description: 'Building a B2B SaaS platform from scratch. Need someone with full-stack experience.',
    budget: 15000,
    status: 'in_progress',
    clientName: 'StartupHub',
    clientRating: 4.9,
    location: 'San Francisco, CA',
    postedDate: '2024-04-20',
    deadline: '2024-08-01',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    applicants: 25,
    type: 'fixed',
    duration: '3-4 months',
    experience: 'senior'
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    description: 'Create a cross-platform mobile app using React Native for iOS and Android.',
    budget: 8000,
    status: 'open',
    clientName: 'MobileFirst',
    clientRating: 4.5,
    location: 'Remote',
    postedDate: '2024-05-02',
    deadline: '2024-07-01',
    skills: ['React Native', 'TypeScript', 'Firebase'],
    applicants: 15,
    type: 'fixed',
    duration: '2 months',
    experience: 'mid'
  },
  {
    id: '5',
    title: 'DevOps Engineer for Cloud Migration',
    description: 'Help migrate our infrastructure to AWS and set up CI/CD pipelines.',
    budget: 12000,
    status: 'completed',
    clientName: 'CloudTech Systems',
    clientRating: 4.7,
    location: 'Austin, TX',
    postedDate: '2024-04-10',
    deadline: '2024-05-15',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    applicants: 18,
    type: 'fixed',
    duration: '6 weeks',
    experience: 'senior'
  },
  {
    id: '6',
    title: 'Frontend Developer for Dashboard',
    description: 'Design and implement a responsive admin dashboard with charts and data visualization.',
    budget: 4500,
    status: 'open',
    clientName: 'Analytics Pro',
    clientRating: 4.4,
    location: 'Remote',
    postedDate: '2024-05-03',
    deadline: '2024-06-20',
    skills: ['Vue.js', 'D3.js', 'CSS', 'JavaScript'],
    applicants: 10,
    type: 'fixed',
    duration: '6 weeks',
    experience: 'mid'
  }
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const allSkills = Array.from(new Set(mockJobs.flatMap(j => j.skills))).sort()
  const statuses = ['open', 'in_progress', 'completed', 'cancelled']
  const types = ['fixed', 'hourly']
  const experiences = ['junior', 'mid', 'senior']

  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(job => selectedStatus.includes(job.status))
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job =>
        selectedSkills.some(skill => job.skills.includes(skill))
      )
    }

    // Type filter
    if (selectedType.length > 0) {
      filtered = filtered.filter(job => selectedType.includes(job.type))
    }

    // Experience filter
    if (selectedExperience.length > 0) {
      filtered = filtered.filter(job => selectedExperience.includes(job.experience))
    }

    setFilteredJobs(filtered)
  }, [searchTerm, selectedStatus, selectedSkills, selectedType, selectedExperience, jobs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'junior':
        return 'bg-green-100 text-green-800'
      case 'mid':
        return 'bg-blue-100 text-blue-800'
      case 'senior':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout title="Jobs" subtitle="Find and manage your projects">
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
                placeholder="Search jobs..."
              />
            </div>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
                <div className="space-y-2">
                  {statuses.map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatus([...selectedStatus, status])
                          } else {
                            setSelectedStatus(selectedStatus.filter(s => s !== status))
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{getStatusText(status)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allSkills.map(skill => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill])
                          } else {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill))
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Job Type</h3>
                <div className="space-y-2">
                  {types.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedType([...selectedType, type])
                          } else {
                            setSelectedType(selectedType.filter(t => t !== type))
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {experiences.map(exp => (
                    <label key={exp} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(exp)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExperience([...selectedExperience, exp])
                          } else {
                            setSelectedExperience(selectedExperience.filter(e => e !== exp))
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedStatus([])
                  setSelectedSkills([])
                  setSelectedType([])
                  setSelectedExperience([])
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
          Showing <span className="font-medium">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {job.clientName}
                    </span>
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Posted {job.postedDate}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {getStatusText(job.status)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceColor(job.experience)}`}>
                    {job.experience}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      +{job.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">${job.budget.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">({job.type})</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{job.duration}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">Due {job.deadline}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{job.applicants} applicants</span>
                </div>
              </div>

              {/* Client Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-900">{job.clientRating}</span>
                  <span className="text-sm text-gray-500 ml-1">Client Rating</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                >
                  View Details
                </button>
                {job.status === 'open' && (
                  <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-md text-sm">
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Job Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Job Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Client:</span> {selectedJob.clientName}</div>
                    <div><span className="font-medium">Location:</span> {selectedJob.location}</div>
                    <div><span className="font-medium">Type:</span> {selectedJob.type}</div>
                    <div><span className="font-medium">Duration:</span> {selectedJob.duration}</div>
                    <div><span className="font-medium">Experience:</span> {selectedJob.experience}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Posted:</span> {selectedJob.postedDate}</div>
                    <div><span className="font-medium">Deadline:</span> {selectedJob.deadline}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedJob.status)}`}>
                        {getStatusText(selectedJob.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600">{selectedJob.description}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget and Applicants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Budget</h3>
                  <div className="text-2xl font-bold text-gray-900">${selectedJob.budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Fixed price project</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Applicants</h3>
                  <div className="text-2xl font-bold text-gray-900">{selectedJob.applicants}</div>
                  <div className="text-sm text-gray-500">People applied</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md">
                  Apply for this Job
                </button>
                <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-3 px-4 rounded-md">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
