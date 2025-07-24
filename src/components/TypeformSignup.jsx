"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const colorPalette = [
  { color: "#D97706", name: "orange" },
  { color: "#1F2937", name: "black" },
  { color: "#F3F4F6", name: "light-gray" },
  { color: "#6B7280", name: "gray" },
]

const ratingNumbers = [1, 2, 3, 4, 5]

export default function TypeformSignup() {
  const [selectedColor, setSelectedColor] = useState("#D97706")
  const [selectedRating, setSelectedRating] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-32 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400 rounded-full blur-2xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">Sign up</h1>
        <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight">and come on in</h2>
      </div>

      {/* Interactive Design Showcase */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Color Palette Card */}
        <div className="absolute -left-32 -top-8 z-20">
          <div className="bg-white rounded-lg p-4 shadow-2xl border border-gray-200">
            <div className="flex gap-3">
              {colorPalette.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(item.color)}
                  className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 ${
                    selectedColor === item.color ? "ring-2 ring-gray-400 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Font Selector Dropdown */}
        <div className="absolute -top-16 left-8 z-30">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-40"
            >
              <span className="text-sm font-medium">Select a font</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDropdownOpen && (
              <div className="border-t border-gray-100 bg-white">
                <div className="py-2">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-sans">
                    Inter
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-serif">
                    Georgia
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-mono">
                    Monaco
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Illustration Card */}
        <Card className="w-80 h-96 bg-gradient-to-br from-teal-600 via-teal-700 to-red-800 border-0 shadow-2xl overflow-hidden relative">
          <CardContent className="p-0 h-full relative">
            {/* Decorative Elements */}
            <div className="absolute inset-0">
              {/* Abstract shapes */}
              <div className="absolute top-16 right-8 w-24 h-32 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full opacity-80 transform rotate-12" />
              <div className="absolute bottom-20 left-12 w-16 h-20 bg-white rounded-full opacity-90" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-40 bg-gradient-to-b from-orange-100 to-orange-200 rounded-3xl opacity-70 transform -rotate-12" />
              </div>

              {/* Decorative plant/leaf element */}
              <div className="absolute bottom-16 right-16">
                <div className="w-8 h-12 bg-green-400 rounded-full transform rotate-45 opacity-80" />
                <div className="w-6 h-8 bg-green-500 rounded-full transform -rotate-12 mt-2 ml-2 opacity-70" />
              </div>

              {/* Small decorative dots */}
              <div className="absolute top-8 left-8 w-2 h-2 bg-red-400 rounded-full" />
              <div className="absolute bottom-8 left-8 w-3 h-3 bg-yellow-400 rounded-full" />
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-2 h-2 bg-white rounded-full opacity-60" />
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Rating Survey Card */}
        <div className="absolute -left-24 top-32 z-20">
          <Card className="w-64 bg-orange-400 border-0 shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-gray-800 font-medium mb-6 leading-tight">
                How likely are you to recommend our brand?
              </h3>
              <div className="flex gap-2">
                {ratingNumbers.map((number) => (
                  <Button
                    key={number}
                    onClick={() => setSelectedRating(number)}
                    variant="outline"
                    size="sm"
                    className={`w-8 h-8 p-0 text-sm font-medium border-gray-600 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 ${
                      selectedRating === number ? "bg-gray-800 text-white" : "bg-transparent"
                    }`}
                  >
                    {number}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/70 text-sm">© Typeform</p>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-60" />
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50" />
      <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40" />
    </div>
  )
}
