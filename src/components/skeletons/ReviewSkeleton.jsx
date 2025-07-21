import React from 'react';

export default function ReviewSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start gap-4 mb-3 animate-pulse">
        {/* Avatar Placeholder */}
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2">
          {/* User Name Placeholder */}
          <div className="h-4 w-32 rounded bg-gray-300"></div>
          {/* Date Placeholder */}
          <div className="h-3 w-24 rounded bg-gray-300"></div>
        </div>
        {/* Star Rating Placeholder */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
        </div>
      </div>
      {/* Comment Placeholder */}
      <div className="space-y-2 animate-pulse">
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}