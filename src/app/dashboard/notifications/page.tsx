'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  category: 'payment' | 'job' | 'message' | 'review' | 'system'
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment Received',
    message: 'You received $2,500 from TechCorp Inc. for the React project.',
    timestamp: '2 hours ago',
    isRead: false,
    category: 'payment',
    actionUrl: '/dashboard/wallet',
    data: { amount: 2500, client: 'TechCorp Inc.' }
  },
  {
    id: '2',
    type: 'info',
    title: 'New Job Application',
    message: 'Alex Thompson applied for your Mobile App Development project.',
    timestamp: '5 hours ago',
    isRead: false,
    category: 'job',
    actionUrl: '/dashboard/jobs',
    data: { applicant: 'Alex Thompson', job: 'Mobile App Development' }
  },
  {
    id: '3',
    type: 'success',
    title: '5-Star Review',
    message: 'Sarah Johnson left you a 5-star review for the completed project.',
    timestamp: '1 day ago',
    isRead: true,
    category: 'review',
    actionUrl: '/dashboard/analytics',
    data: { reviewer: 'Sarah Johnson', rating: 5 }
  },
  {
    id: '4',
    type: 'warning',
    title: 'Payment Pending',
    message: 'Your payment of $3,200 from MobileFirst is still pending.',
    timestamp: '2 days ago',
    isRead: true,
    category: 'payment',
    actionUrl: '/dashboard/wallet',
    data: { amount: 3200, client: 'MobileFirst' }
  },
  {
    id: '5',
    type: 'info',
    title: 'New Message',
    message: 'You have a new message from Mike Chen about the Python project.',
    timestamp: '3 days ago',
    isRead: true,
    category: 'message',
    actionUrl: '/dashboard/messages',
    data: { sender: 'Mike Chen', project: 'Python Automation' }
  },
  {
    id: '6',
    type: 'error',
    title: 'Withdrawal Failed',
    message: 'Your withdrawal of $800 to PayPal failed. Please check your account.',
    timestamp: '4 days ago',
    isRead: true,
    category: 'payment',
    actionUrl: '/dashboard/wallet',
    data: { amount: 800, method: 'PayPal' }
  },
  {
    id: '7',
    type: 'info',
    title: 'Profile Update',
    message: 'Your profile has been successfully updated.',
    timestamp: '5 days ago',
    isRead: true,
    category: 'system',
    data: {}
  },
  {
    id: '8',
    type: 'success',
    title: 'Project Completed',
    message: 'Congratulations! You completed the React E-commerce platform project.',
    timestamp: '1 week ago',
    isRead: true,
    category: 'job',
    actionUrl: '/dashboard/analytics',
    data: { project: 'React E-commerce Platform' }
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CurrencyDollarIcon className="h-4 w-4" />
      case 'job':
        return <BriefcaseIcon className="h-4 w-4" />
      case 'message':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />
      case 'review':
        return <StarIcon className="h-4 w-4" />
      case 'system':
      default:
        return <BellIcon className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment':
        return 'bg-green-100 text-green-800'
      case 'job':
        return 'bg-blue-100 text-blue-800'
      case 'message':
        return 'bg-purple-100 text-purple-800'
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      case 'system':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter(notification => {
    const categoryMatch = selectedCategory === 'all' || notification.category === selectedCategory
    const readMatch = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) || 
      (filter === 'read' && notification.isRead)
    return categoryMatch && readMatch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const categories = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'payment', name: 'Payments', count: notifications.filter(n => n.category === 'payment').length },
    { id: 'job', name: 'Jobs', count: notifications.filter(n => n.category === 'job').length },
    { id: 'message', name: 'Messages', count: notifications.filter(n => n.category === 'message').length },
    { id: 'review', name: 'Reviews', count: notifications.filter(n => n.category === 'review').length },
    { id: 'system', name: 'System', count: notifications.filter(n => n.category === 'system').length }
  ]

  return (
    <DashboardLayout title="Notifications" subtitle={`${unreadCount} unread notifications`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {getCategoryIcon(category.id)}
                      <span className="ml-2">{category.name}</span>
                    </div>
                    {category.count > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Filter</h3>
              <div className="space-y-2">
                {(['all', 'unread', 'read'] as const).map(filterOption => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                      filter === filterOption
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="capitalize">{filterOption}</span>
                    {filterOption === 'unread' && unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={markAllAsRead}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                >
                  Mark All as Read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedCategory === 'all' ? 'All Notifications' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCategory === 'all' ? 'You have no notifications' : `No ${selectedCategory} notifications`}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-purple-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                                {getCategoryIcon(notification.category)}
                                <span className="ml-1 capitalize">{notification.category}</span>
                              </span>
                              <span className="text-xs text-gray-500">{notification.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Mark as read"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Delete"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        {notification.actionUrl && (
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                // Navigate to action URL
                                window.location.href = notification.actionUrl!
                              }}
                              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
