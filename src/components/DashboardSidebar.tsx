'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserButton, useClerk } from '@clerk/nextjs'
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
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: UserGroupIcon },
  { name: 'Jobs', href: '/dashboard/jobs', icon: BriefcaseIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: Cog6ToothIcon },
]

export default function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  return (
    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">TH</span>
            </div>
            <h1 className="ml-2 text-xl font-bold text-white">TalentHub</h1>
          </div>
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
                    ? 'bg-gray-800 text-white border-l-2 border-blue-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-r-md w-full text-left transition-colors`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-400' : 'text-gray-500'
                }`} aria-hidden="true" />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserButton />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Account</p>
            <button
              onClick={() => {
                signOut()
                window.location.assign('/')
              }}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
