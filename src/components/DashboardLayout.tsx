'use client'

import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <DashboardSidebar />
        </div>
        
        <div className="flex-1 lg:ml-0">
          <DashboardHeader setSidebarOpen={setSidebarOpen} title={title} subtitle={subtitle} />
          
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-full px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
          <DashboardSidebar />
        </div>
      </div>
    </div>
  )
}
