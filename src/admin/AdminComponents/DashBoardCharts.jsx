"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

const sessionsData = [
  { date: "Apr 1", total: 1000, line1: 500, line2: 200 },
  { date: "Apr 2", total: 1500, line1: 700, line2: 300 },
  { date: "Apr 3", total: 2000, line1: 900, line2: 400 },
  { date: "Apr 4", total: 2500, line1: 1100, line2: 500 },
  { date: "Apr 5", total: 3000, line1: 1300, line2: 600 },
  { date: "Apr 6", total: 3500, line1: 1500, line2: 700 },
  { date: "Apr 7", total: 4000, line1: 1700, line2: 800 },
  { date: "Apr 8", total: 4500, line1: 1900, line2: 900 },
  { date: "Apr 9", total: 5000, line1: 2100, line2: 1000 },
  { date: "Apr 10", total: 5500, line1: 2300, line2: 1100 },
  { date: "Apr 11", total: 6000, line1: 2500, line2: 1200 },
  { date: "Apr 12", total: 6500, line1: 2700, line2: 1300 },
  { date: "Apr 13", total: 7000, line1: 2900, line2: 1400 },
  { date: "Apr 14", total: 7500, line1: 3100, line2: 1500 },
  { date: "Apr 15", total: 8000, line1: 3300, line2: 1600 },
  { date: "Apr 16", total: 8500, line1: 3500, line2: 1700 },
  { date: "Apr 17", total: 9000, line1: 3700, line2: 1800 },
  { date: "Apr 18", total: 9500, line1: 3900, line2: 1900 },
  { date: "Apr 19", total: 10000, line1: 4100, line2: 2000 },
  { date: "Apr 20", total: 10500, line1: 4300, line2: 2100 },
  { date: "Apr 21", total: 11000, line1: 4500, line2: 2200 },
  { date: "Apr 22", total: 11500, line1: 4700, line2: 2300 },
  { date: "Apr 23", total: 12000, line1: 4900, line2: 2400 },
  { date: "Apr 24", total: 12500, line1: 5100, line2: 2500 },
  { date: "Apr 25", total: 13000, line1: 5300, line2: 2600 },
  { date: "Apr 26", total: 13500, line1: 5500, line2: 2700 },
  { date: "Apr 27", total: 14000, line1: 5700, line2: 2800 },
  { date: "Apr 28", total: 14500, line1: 5900, line2: 2900 },
  { date: "Apr 29", total: 15000, line1: 6100, line2: 3000 },
  { date: "Apr 30", total: 15500, line1: 6300, line2: 3100 },
]

const pageViewsData = [
  { name: "Jan", views: 5500, downloads: 4000 },
  { name: "Feb", views: 4500, downloads: 3500 },
  { name: "Mar", views: 3800, downloads: 2500 },
  { name: "Apr", views: 6000, downloads: 5000 },
  { name: "May", views: 7000, downloads: 4500 },
  { name: "Jun", views: 4000, downloads: 3000 },
  { name: "Jul", views: 3500, downloads: 2500 },
]

export default function DashboardCharts() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Chart Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Sessions</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">13,277</p>
              <span className="text-sm font-medium text-green-500">+35%</span>
            </div>
            <p className="text-sm text-gray-500">Sessions per day for the last 30 days</p>
          </CardHeader>
          <CardContent className="h-80 p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sessionsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => {
                    const date = new Date(tick)
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  interval={4}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                />
                <YAxis
                  domain={[0, 25000]}
                  tickFormatter={(tick) => `${tick / 1000}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#a7d9ff"
                  fill="#a7d9ff"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="line1"
                  stroke="#66b3ff"
                  fill="#66b3ff"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="line2"
                  stroke="#007bff"
                  fill="#007bff"
                  fillOpacity={0.7}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Page views and downloads Chart Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Page views and downloads</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">1.3M</p>
              <span className="text-sm font-medium text-red-500">-8%</span>
            </div>
            <p className="text-sm text-gray-500">Page views and downloads for the last 6 months</p>
          </CardHeader>
          <CardContent className="h-80 p-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pageViewsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis
                  domain={[0, 15000]}
                  tickFormatter={(tick) => `${tick / 1000}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                />
                <Bar dataKey="downloads" stackId="a" fill="#007bff" barSize={30} radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" stackId="a" fill="#66b3ff" barSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
