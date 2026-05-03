'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalEarnings: number
  totalProjects: number
  totalHours: number
  averageRating: number
  monthlyData: {
    month: string
    earnings: number
    projects: number
    hours: number
  }[]
  topSkills: {
    skill: string
    count: number
    percentage: number
  }[]
  recentPerformance: {
    week: string
    earnings: number
    projects: number
    rating: number
  }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalEarnings: 45678,
  totalProjects: 89,
  totalHours: 1234,
  averageRating: 4.8,
  monthlyData: [
    { month: 'Jan', earnings: 3200, projects: 6, hours: 89 },
    { month: 'Feb', earnings: 4100, projects: 8, hours: 112 },
    { month: 'Mar', earnings: 3800, projects: 7, hours: 98 },
    { month: 'Apr', earnings: 5200, projects: 10, hours: 134 },
    { month: 'May', earnings: 4900, projects: 9, hours: 125 },
    { month: 'Jun', earnings: 5800, projects: 11, hours: 156 }
  ],
  topSkills: [
    { skill: 'React', count: 45, percentage: 85 },
    { skill: 'TypeScript', count: 38, percentage: 72 },
    { skill: 'Node.js', count: 32, percentage: 60 },
    { skill: 'Python', count: 28, percentage: 53 },
    { skill: 'AWS', count: 22, percentage: 42 }
  ],
  recentPerformance: [
    { week: 'Week 1', earnings: 1200, projects: 2, rating: 4.9 },
    { week: 'Week 2', earnings: 1800, projects: 3, rating: 4.8 },
    { week: 'Week 3', earnings: 1500, projects: 3, rating: 4.7 },
    { week: 'Week 4', earnings: 2200, projects: 4, rating: 4.9 }
  ]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(false)

  const statsCards = [
    {
      title: 'Total Earnings',
      value: `$${data.totalEarnings.toLocaleString()}`,
      change: '+12%',
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Projects',
      value: data.totalProjects.toString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Hours',
      value: data.totalHours.toString(),
      change: '+15%',
      changeType: 'increase' as const,
      icon: ClockIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Rating',
      value: data.averageRating.toFixed(1),
      change: '+0.2',
      changeType: 'increase' as const,
      icon: ArrowTrendingUpIcon,
      color: 'bg-yellow-500'
    }
  ]

  const getBarHeight = (value: number, maxValue: number) => {
    return `${(value / maxValue) * 100}%`
  }

  const maxEarnings = Math.max(...data.monthlyData.map(d => d.earnings))
  const maxProjects = Math.max(...data.monthlyData.map(d => d.projects))

  return (
    <DashboardLayout title="Analytics" subtitle="Track your performance and growth">
      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map(stat => (
          <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      {stat.change && (
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {stat.changeType === 'increase' ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                          )}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h3>
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-40">
              {data.monthlyData.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-purple-600 rounded-t-md" style={{ height: getBarHeight(month.earnings, maxEarnings) }}>
                    <div className="text-white text-xs text-center pt-1">${(month.earnings / 1000).toFixed(1)}k</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: ${data.monthlyData.reduce((sum, m) => sum + m.earnings, 0).toLocaleString()}</span>
              <span>Average: ${Math.round(data.monthlyData.reduce((sum, m) => sum + m.earnings, 0) / data.monthlyData.length).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Projects Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Projects</h3>
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-40">
              {data.monthlyData.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-600 rounded-t-md" style={{ height: getBarHeight(month.projects, maxProjects) }}>
                    <div className="text-white text-xs text-center pt-1">{month.projects}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {data.monthlyData.reduce((sum, m) => sum + m.projects, 0)} projects</span>
              <span>Average: {(data.monthlyData.reduce((sum, m) => sum + m.projects, 0) / data.monthlyData.length).toFixed(1)} projects/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills and Recent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skills */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Skills</h3>
          <div className="space-y-4">
            {data.topSkills.map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{skill.skill}</p>
                    <p className="text-xs text-gray-500">{skill.count} projects</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{skill.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Performance</h3>
          <div className="space-y-4">
            {data.recentPerformance.map((week, index) => (
              <div key={week.week} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{week.week}</h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(week.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{week.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Earnings:</span>
                    <span className="ml-2 font-medium text-gray-900">${week.earnings}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Projects:</span>
                    <span className="ml-2 font-medium text-gray-900">{week.projects}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-purple-100 text-sm">Best Month</p>
            <p className="text-2xl font-bold">June</p>
            <p className="text-purple-100 text-sm">$5,800 earned</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Average Project Value</p>
            <p className="text-2xl font-bold">${Math.round(data.totalEarnings / data.totalProjects)}</p>
            <p className="text-purple-100 text-sm">Per project</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Hourly Rate</p>
            <p className="text-2xl font-bold">${Math.round(data.totalEarnings / data.totalHours)}</p>
            <p className="text-purple-100 text-sm">Per hour</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Growth Rate</p>
            <p className="text-2xl font-bold">+23%</p>
            <p className="text-purple-100 text-sm">vs last period</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
