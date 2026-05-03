'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />
    }
  }

  const getBackgroundClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-800'
      case 'error':
        return 'bg-red-900 border-red-800'
      case 'warning':
        return 'bg-yellow-900 border-yellow-800'
      case 'info':
        return 'bg-blue-900 border-blue-800'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        max-w-sm w-full border-l-4 p-4 rounded-lg shadow-lg
        ${getBackgroundClass()}
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-white">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-gray-300">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

// Toast Hook for easy usage
interface UseToastReturn {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>>([])

  const addToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Date.now().toString()
    const newToast = { id, type, title, message, duration }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string) => {
    addToast('success', title, message)
  }

  const error = (title: string, message?: string) => {
    addToast('error', title, message)
  }

  const warning = (title: string, message?: string) => {
    addToast('warning', title, message)
  }

  const info = (title: string, message?: string) => {
    addToast('info', title, message)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
