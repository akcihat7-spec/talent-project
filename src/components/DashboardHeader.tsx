'use client'

import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { UserButton } from '@clerk/nextjs'

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void
  title: string
  subtitle?: string
}

export default function DashboardHeader({ setSidebarOpen, title, subtitle }: DashboardHeaderProps) {

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex-shrink-0 flex h-16 bg-gray-900 border-b border-gray-800 lg:hidden">
        <button
          type="button"
          className="px-4 border-r border-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 justify-between flex px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0">
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="sticky top-0 z-40 flex-shrink-0 flex h-16 bg-gray-900 border-b border-gray-800">
          <div className="flex-1 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-white">{title}</h1>
                {subtitle && <p className="ml-2 text-sm text-gray-400">{subtitle}</p>}
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-white transition-colors relative"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>
                <div className="flex-shrink-0">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
