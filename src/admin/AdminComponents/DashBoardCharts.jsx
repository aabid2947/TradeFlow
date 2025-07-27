"use client"

import React, { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { MoreHorizontal, Plus, Minus, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

const salesRevenueData = [
  { month: "Jan", sales: 50, revenue: 70 },
  { month: "Feb", sales: 40, revenue: 90 },
  { month: "Mar", sales: 35, revenue: 25 },
  { month: "Apr", sales: 50, revenue: 50 },
  { month: "May", sales: 60, revenue: 50 },
  { month: "Jun", sales: 45, revenue: 50 },
  { month: "Jul", sales: 55, revenue: 40 },
  { month: "Aug", sales: 75, revenue: 50 },
  { month: "Sep", sales: 60, revenue: 65 },
  { month: "Oct", sales: 80, revenue: 75 },
  { month: "Nov", sales: 50, revenue: 45 },
  { month: "Dec", sales: 80, revenue: 65 },
]

const worldLocations = [
  { x: 20, y: 40, size: 8, label: "North America", users: "2.4K", pulsing: true },
  { x: 45, y: 35, size: 12, label: "Europe", users: "5.2K", pulsing: true },
  { x: 70, y: 45, size: 10, label: "Asia", users: "8.1K", pulsing: false },
  { x: 50, y: 65, size: 6, label: "Africa", users: "1.8K", pulsing: true },
  { x: 85, y: 70, size: 8, label: "Australia", users: "950", pulsing: false },
  { x: 30, y: 70, size: 7, label: "South America", users: "1.5K", pulsing: true },
]

// Simplified world map SVG path
const worldMapPath = "M158.5 115.2c-1.5 0-2.8-1.2-3.1-2.7-0.2-1.7 0.9-3.2 2.6-3.5 4.7-0.8 9.2-2.8 13.1-5.8 1.5-1.2 3.6-0.9 4.8 0.6s0.9 3.6-0.6 4.8c-4.7 3.6-10.1 6-15.8 7C158.9 115.2 158.7 115.2 158.5 115.2zM120 60h560c11 0 20 9 20 20v360c0 11-9 20-20 20H120c-11 0-20-9-20-20V80C100 69 109 60 120 60zM140 100v320h520V100H140z"

export default function DashboardCharts() {
  const [mapZoom, setMapZoom] = useState(1)
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [selectedChart, setSelectedChart] = useState(null)

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.2, 0.5))

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Real-Time World Map Card */}
        <div 
          className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
            selectedChart === 'map' ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
          }`}
          onClick={() => setSelectedChart(selectedChart === 'map' ? null : 'map')}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Real-Time Activity</h3>
              <p className="text-sm text-gray-600">Live user interactions worldwide</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
              <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200">
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative h-80 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 group"
              >
                <ZoomIn className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 group"
              >
                <ZoomOut className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMapZoom(1); }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Maximize2 className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
              </button>
            </div>

            {/* World Map SVG */}
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-500"
              style={{ transform: `scale(${mapZoom})` }}
            >
              <svg viewBox="0 0 800 400" className="w-full h-full max-w-none">
                {/* World Map Simplified Paths */}
                {/* North America */}
                <path
                  d="M100 120 L180 110 L200 140 L190 180 L140 190 L120 160 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />
                
                {/* South America */}
                <path
                  d="M140 200 L180 195 L190 250 L170 290 L150 280 L135 240 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />
                
                {/* Europe */}
                <path
                  d="M300 100 L380 95 L390 130 L370 140 L320 135 L310 115 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />
                
                {/* Africa */}
                <path
                  d="M320 150 L380 145 L390 220 L370 260 L340 250 L325 200 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />
                
                {/* Asia */}
                <path
                  d="M400 80 L550 75 L580 120 L570 170 L480 175 L420 140 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />
                
                {/* Australia */}
                <path
                  d="M600 240 L680 235 L690 270 L670 285 L620 280 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="hover:fill-blue-100 transition-colors duration-300"
                />

                {/* Activity Points */}
                {worldLocations.map((location, index) => (
                  <g key={index}>
                    {/* Pulse Ring for Active Locations */}
                    {location.pulsing && (
                      <circle
                        cx={location.x * 8}
                        cy={location.y * 4}
                        r={location.size + 8}
                        fill="none"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                    
                    {/* Main Point */}
                    <circle
                      cx={location.x * 8}
                      cy={location.y * 4}
                      r={location.size}
                      fill={location.pulsing ? "#3b82f6" : "#6366f1"}
                      className={`cursor-pointer transition-all duration-300 hover:r-[${location.size + 3}] ${
                        location.pulsing ? 'animate-pulse' : ''
                      }`}
                      onMouseEnter={() => setHoveredLocation(location)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    />
                    
                    {/* Glow Effect */}
                    <circle
                      cx={location.x * 8}
                      cy={location.y * 4}
                      r={location.size + 2}
                      fill="rgba(59, 130, 246, 0.2)"
                      className="animate-pulse"
                    />
                  </g>
                ))}

                {/* Connection Lines (animated) */}
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                    <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                  </linearGradient>
                </defs>
                
                <path
                  d={`M${20 * 8} ${40 * 4} Q${60 * 8} ${20 * 4} ${70 * 8} ${45 * 4}`}
                  fill="none"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Tooltip */}
            {hoveredLocation && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 z-10">
                <h4 className="font-semibold text-gray-900">{hoveredLocation.label}</h4>
                <p className="text-sm text-gray-600">{hoveredLocation.users} active users</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${hoveredLocation.pulsing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-500">
                    {hoveredLocation.pulsing ? 'Active now' : 'Idle'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sales / Revenue Chart Card */}
        <div 
          className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
            selectedChart === 'chart' ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
          }`}
          onClick={() => setSelectedChart(selectedChart === 'chart' ? null : 'chart')}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Sales / Revenue</h3>
              <p className="text-sm text-gray-600">Monthly performance overview</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-300"></div>
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
              </div>
              <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200">
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-80 p-4 bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesRevenueData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(0,0,0,0.1)" 
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280" }} 
                />
                <YAxis 
                  domain={[0, 160]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280" }} 
                />
                <Bar 
                  dataKey="sales" 
                  stackId="a" 
                  fill="#3b82f6" 
                  barSize={24} 
                  radius={[0, 0, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
                <Bar 
                  dataKey="revenue" 
                  stackId="a" 
                  fill="#93c5fd" 
                  barSize={24} 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Footer */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-lg font-bold text-blue-600">$127K</div>
                <div className="text-xs text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-lg font-bold text-green-600">+12%</div>
                <div className="text-xs text-gray-600">Growth</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-lg font-bold text-purple-600">680</div>
                <div className="text-xs text-gray-600">Total Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}