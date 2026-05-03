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
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="lg:pl-64">
        <DashboardHeader setSidebarOpen={setSidebarOpen} title={title} subtitle={subtitle} />
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
