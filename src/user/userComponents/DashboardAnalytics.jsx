"use client"

import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const statsData = [
  {
    title: "Total Verification",
    value: "7,245",
    change: "+10.1%",
    color: "bg-orange-500",
    textColor: "text-white",
  },
  {
    title: "PAN Verifications",
    value: "3,671",
    change: "+8.1%",
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    title: "Aadhaar Verifications",
    value: "156",
    change: "+10.1%",
    color: "bg-red-500",
    textColor: "text-white",
  },
  {
    title: "Bank Verifications",
    value: "2,318",
    change: "+8.1%",
    color: "bg-green-500",
    textColor: "text-white",
  },
]

const chartData = [
  { date: "14 Jun", kyc: 0.4, business: 0.3 },
  { date: "15 Jun", kyc: 0.5, business: 0.4 },
  { date: "16 Jun", kyc: 0.6, business: 0.5 },
  { date: "17 Jun", kyc: 0.8, business: 0.6 },
  { date: "18 Jun", kyc: 0.9, business: 0.7 },
  { date: "19 Jun", kyc: 1.0, business: 0.8 },
  { date: "20 Jun", kyc: 1.1, business: 0.9 },
  { date: "21 Jun", kyc: 1.2, business: 1.0 },
  { date: "22 Jun", kyc: 1.3, business: 1.1 },
  { date: "23 Jun", kyc: 1.2, business: 1.2 },
  { date: "24 Jun", kyc: 1.1, business: 1.3 },
  { date: "25 Jun", kyc: 1.0, business: 1.2 },
  { date: "26 Jun", kyc: 1.1, business: 1.1 },
  { date: "27 Jun", kyc: 1.2, business: 1.0 },
  { date: "28 Jun", kyc: 1.4, business: 1.1 },
]

export default function DashboardAnalytics() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0 shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${stat.textColor} opacity-90 mb-1`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm ${stat.textColor} opacity-90`}>{stat.change}</span>
                  <TrendingUp className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Statistics Chart */}
      <Card className="mb-6 shadow-sm border-[#1A89C1] ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">API Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis domain={[0, 1.6]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="kyc"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="KYC Verification"
                />
                <Line
                  type="monotone"
                  dataKey="business"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  name="Business Verification"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Cards */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
    
        <Card className="shadow-sm border-[#1A89C1] ">
          <CardContent className="p-2">
            <div className="bg-gray-900 rounded-lg p-4 h-40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
              <div className="relative z-10">
                <div className="text-green-400 text-xs font-mono mb-2">
                  {"> curl -X POST https://api.verifymeync.com/v1/verify"}
                </div>
                <div className="text-gray-300 text-xs font-mono mb-1">
                  {'  -H "Authorization: Bearer YOUR_API_KEY"'}
                </div>
                <div className="text-gray-300 text-xs font-mono">{'  -H "Content-Type: application/json"'}</div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Create / Manage API keys</h3>
              <p className="text-sm text-gray-600 mb-4">Generate and Manage Your API Credentials for Get Started</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">API Key</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#1A89C1] " >
          <CardContent className="p-2">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg p-4 h-40 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%23ffffff%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%227%22 cy%3D%227%22 r%3D%221%22/%3E%3Ccircle cx%3D%2227%22 cy%3D%227%22 r%3D%221%22/%3E%3Ccircle cx%3D%2247%22 cy%3D%227%22 r%3D%221%22/%3E%3Ccircle cx%3D%227%22 cy%3D%2227%22 r%3D%221%22/%3E%3Ccircle cx%3D%2227%22 cy%3D%2227%22 r%3D%221%22/%3E%3Ccircle cx%3D%2247%22 cy%3D%2227%22 r%3D%221%22/%3E%3Ccircle cx%3D%227%22 cy%3D%2247%22 r%3D%221%22/%3E%3Ccircle cx%3D%2227%22 cy%3D%2247%22 r%3D%221%22/%3E%3Ccircle cx%3D%2247%22 cy%3D%2247%22 r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-white text-4xl font-bold opacity-80">📊</div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">API Data Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">
                Detailed Information On Your API Hits, Such As Success And Failure
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                API Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
