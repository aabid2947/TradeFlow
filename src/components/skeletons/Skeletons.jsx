// components/Skeletons.js

import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// CardSkeleton with local shimmer overlay
export const CardSkeleton = () => (
  <div className="relative">
    {/* Scoped shimmer keyframes */}
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>

    <Card className="border-0 shadow-sm overflow-hidden">
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ animation: 'shimmer 1.5s infinite' }}
      />

      <CardContent className="p-4 relative">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// ChartSkeleton with local shimmer overlay
export const ChartSkeleton = () => (
  <div className="relative">
    {/* Scoped shimmer keyframes */}
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>

    <Card className="shadow-sm border-[#1A89C1] overflow-hidden">
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ animation: 'shimmer 1.5s infinite' }}
      />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="h-80 w-full space-y-4 relative">
          <div className="flex justify-center space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Chart bars skeleton */}
          <div className="relative grid grid-cols-8 gap-2 p-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-2 mx-auto bg-gray-200" style={{ height: `${20 + Math.random() * 60}%` }} />
                <Skeleton className="h-3 w-8 mx-auto" />
              </div>
            ))}
          </div>

          {/* Y-axis labels skeleton */}
          <div className="absolute left-0 top-12 space-y-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-6" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)
