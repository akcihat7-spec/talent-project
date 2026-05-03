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
    <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 to-violet-900 min-h-screen">
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
                    : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon className={`mr-3 h-6 w-6 ${
                  isActive ? 'text-purple-200' : 'text-purple-400'
                }`} aria-hidden="true" />
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
              onClick={() => {
                signOut()
                window.location.assign('/')
              }}
              className="text-xs font-medium text-purple-200 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
