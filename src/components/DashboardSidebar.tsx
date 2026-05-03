'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { 
  HomeIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  WalletIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SidebarItem {
  name: string
  href: string
  icon: any
  current: boolean
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: UserGroupIcon },
  { name: 'Jobs', href: '/dashboard/jobs', icon: BriefcaseIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: Cog6ToothIcon },
]

interface DashboardSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-purple-900 to-violet-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-white">TalentHub</h1>
            </div>
            <nav className="mt-8 px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`${
                      isActive
                        ? 'bg-purple-800 text-white'
                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'
                      } mr-3 h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-purple-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserButton />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Account</p>
                <button
                  onClick={() => router.push('/login')}
                  className="text-xs font-medium text-purple-200 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 to-violet-900">
          <div className="flex-1 flex flex-col min-h-0 border-r border-purple-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-white">TalentHub</h1>
              </div>
              <nav className="mt-8 flex-1 px-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`${
                        isActive
                          ? 'bg-purple-800 text-white'
                          : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'
                        } mr-3 h-5 w-5 flex-shrink-0`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-purple-800 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserButton />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Account</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-xs font-medium text-purple-200 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
