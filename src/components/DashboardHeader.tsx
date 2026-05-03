'use client'

import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void
  title: string
  subtitle?: string
}

export default function DashboardHeader({ setSidebarOpen, title, subtitle }: DashboardHeaderProps) {
  return (
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
        </div>
      </div>
    </div>
  )
}
