"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const serviceCategories = [
  { name: "Personal", isActive: true },
  { name: "Business", isActive: false },
  { name: "Finance and Banking", isActive: false },
  { name: "Government", isActive: false },
  { name: "Biometric", isActive: false },
  { name: "Covid check", isActive: false },
]

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("Personal")

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Small heading */}
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-4 font-medium">CHOOSE YOUR DESIRED SERVICE</p>

          {/* Main heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Browse Our Top Services</h2>

          {/* Service category tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {serviceCategories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === category.name
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
