"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const pricingPlans = [
  {
    name: "Personal",
    price: "₹190",
    period: "/ month",
    description: "All the basic features to boost your freelance career",
    isPopular: false,
    features: [
      { name: "Full Access to VerifyMyKyc", hasInfo: true },
      { name: "100 GB Free Storage", hasInfo: true },
      { name: "Unlimited Visitors", hasInfo: false },
      { name: "10 Agents", hasInfo: false },
      { name: "Live Chat Support", hasInfo: true },
    ],
  },
  {
    name: "Professional",
    price: "₹495",
    period: "/ month",
    description: "All the basic features to boost your freelance career",
    isPopular: true,
    features: [
      { name: "Full Access to VerifyMyKyc", hasInfo: true },
      { name: "100 GB Free Storage", hasInfo: true },
      { name: "Unlimited Visitors", hasInfo: false },
      { name: "10 Agents", hasInfo: false },
      { name: "Live Chat Support", hasInfo: true },
    ],
  },
  {
    name: "Business",
    price: "₹998",
    period: "/ month",
    description: "All the basic features to boost your freelance career",
    isPopular: false,
    features: [
      { name: "Full Access to VerifyMyKyc", hasInfo: true },
      { name: "100 GB Free Storage", hasInfo: true },
      { name: "Unlimited Visitors", hasInfo: false },
      { name: "10 Agents", hasInfo: false },
      { name: "Live Chat Support", hasInfo: true },
    ],
  },
]

export default function PricingSection() {
  const [isProVerification, setIsProVerification] = useState(false)

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, easy pricing</h2>
          <p className="text-gray-600 mb-8">Amet minim mollit non deserunt ullamco.</p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge className="bg-gray-800 text-white px-3 py-1 text-xs font-medium">Pro Verification</Badge>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-200 ${
                plan.isPopular
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <CardHeader className={`text-center pb-4 ${plan.isPopular ? "bg-gray-900 text-white" : ""}`}>
                <h3 className={`text-lg font-semibold mb-2 ${plan.isPopular ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.isPopular ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.isPopular ? "text-gray-300" : "text-gray-600"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm ${plan.isPopular ? "text-gray-300" : "text-gray-600"}`}>{plan.description}</p>
              </CardHeader>

              <CardContent className="p-6">
                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{feature.name}</span>
                      {feature.hasInfo && <Info className="w-4 h-4 text-gray-400 cursor-help" />}
                    </li>
                  ))}
                </ul>

                {/* Purchase Button */}
                <Button
                  className={`w-full py-3 text-sm font-medium transition-colors ${
                    plan.isPopular
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                  }`}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
