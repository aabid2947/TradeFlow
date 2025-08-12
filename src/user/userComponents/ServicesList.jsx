"use client"

import { ChevronRight } from "lucide-react"

export default function ServicesList({ services, isLoading, activeServiceId, onServiceSelect }) {

  if (isLoading) {
    return (
        <div className="max-w-sm mx-auto bg-white min-h-screen shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Available Offerings</h1>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-0">
          {services.map((service) => {
            const isActive = service.service_key === activeServiceId;
            
            return (
              <div
                key={service.service_key}
                onClick={() => onServiceSelect(service.service_key)}
                className={`flex  items-center justify-between py-4 px-4 -mx-4 cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-blue-50 border-r-4 border-blue-500" 
                    : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${isActive ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                  {service.name}
                </span>
                {!isActive && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}