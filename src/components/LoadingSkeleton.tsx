'use client'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'button'
}

export default function LoadingSkeleton({ className = '', variant = 'card' }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-800 rounded'
  
  switch (variant) {
    case 'card':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="h-48 bg-gray-700 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      )
    
    case 'list':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="flex items-center space-x-4 p-4">
            <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )
    
    case 'text':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      )
    
    case 'avatar':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
        </div>
      )
    
    case 'button':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      )
    
    default:
      return <div className={`${baseClasses} ${className}`}></div>
  }
}

// Skeleton grid for marketplace cards
export function MarketplaceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <LoadingSkeleton key={i} variant="card" className="h-96" />
      ))}
    </div>
  )
}

// Skeleton for dashboard stats
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-8 bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-700 rounded"></div>
          </div>
          <div className="h-6 w-20 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for navigation items
export function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center px-3 py-2 space-x-3">
          <div className="h-5 w-5 bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}
