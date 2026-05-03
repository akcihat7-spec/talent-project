'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LanguageIcon,
  PencilIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-medium text-2xl">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-medium text-gray-900">User Profile</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">John Doe</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Enter your location"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">No bio set yet. Add one to tell others about yourself!</p>
                  )}
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Years of experience"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your education"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your hourly rate"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      {isEditing ? (
                        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                          <option value="">Select availability</option>
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">Not set</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="Add skills"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    ) : (
                      <>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          React
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          TypeScript
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          Node.js
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="Add languages"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    ) : (
                      <>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          English
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          Turkish
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
