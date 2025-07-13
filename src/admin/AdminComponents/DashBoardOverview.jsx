"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { ArrowRight, Sparkles } from "lucide-react"

const overviewData = [
  {
    title: "Users",
    value: "14k",
    change: "+25%",
    changeColor: "text-green-500",
    chartColor: "#22c55e", // green-500
    data: [
      { uv: 0 },
      { uv: 10 },
      { uv: 20 },
      { uv: 15 },
      { uv: 25 },
      { uv: 30 },
      { uv: 28 },
      { uv: 35 },
      { uv: 40 },
      { uv: 38 },
      { uv: 45 },
      { uv: 50 },
    ],
  },
  {
    title: "Conversions",
    value: "325",
    change: "-25%",
    changeColor: "text-red-500",
    chartColor: "#ef4444", // red-500
    data: [
      { uv: 50 },
      { uv: 45 },
      { uv: 40 },
      { uv: 35 },
      { uv: 30 },
      { uv: 25 },
      { uv: 28 },
      { uv: 20 },
      { uv: 15 },
      { uv: 18 },
      { uv: 10 },
      { uv: 5 },
    ],
  },
  {
    title: "Event count",
    value: "200k",
    change: "+5%",
    changeColor: "text-gray-500",
    chartColor: "#9ca3af", // gray-400
    data: [
      { uv: 20 },
      { uv: 22 },
      { uv: 21 },
      { uv: 23 },
      { uv: 22 },
      { uv: 24 },
      { uv: 23 },
      { uv: 25 },
      { uv: 24 },
      { uv: 26 },
      { uv: 25 },
      { uv: 27 },
    ],
  },
]

export default function DashboardOverview() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => (
          <Card key={index} className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">{item.title}</CardTitle>
                <span className={`text-sm font-medium ${item.changeColor}`}>{item.change}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </CardHeader>
            <CardContent className="h-20 p-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.data}>
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke={item.chartColor}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    fill={item.chartColor}
                    fillOpacity={0.1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}

        {/* Explore your data card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Explore your data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Uncover performance and visitor insights with our data wizardry.
            </p>
          </div>
          <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md flex items-center justify-center gap-2">
            Get insights <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
