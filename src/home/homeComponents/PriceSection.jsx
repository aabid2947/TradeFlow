"use client"

import { useState } from "react"
import { Check, Info, Star, Zap, Shield, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const pricingPlans = [
  {
    name: "Personal",
    price: "₹190",
    originalPrice: "₹250",
    period: "/month",
    description: "For individuals starting verification",
    isPopular: false,
    discount: "24% OFF",
    icon: Users,
    features: [
      { name: "Full Access", hasInfo: true, tooltip: "Complete access to services" },
      { name: "100 GB Storage", hasInfo: true, tooltip: "Secure cloud storage" },
      { name: "Unlimited Visitors", hasInfo: false },
      { name: "10 Agents", hasInfo: false },
      { name: "Live Chat", hasInfo: true, tooltip: "24/7 customer support" },
      { name: "Basic Analytics", hasInfo: false },
    ],
    cta: "Start Personal",
    highlight: "Popular for Individuals",
  },
  {
    name: "Professional",
    price: "₹495",
    originalPrice: "₹699",
    period: "/month",
    description: "For growing businesses",
    isPopular: true,
    discount: "29% OFF",
    icon: Zap,
    features: [
      { name: "All Personal Features", hasInfo: false },
      { name: "500 GB Storage", hasInfo: true, tooltip: "Priority backup" },
      { name: "50 Agents", hasInfo: false },
      { name: "Priority Support", hasInfo: true, tooltip: "Dedicated agent" },
      { name: "Advanced Analytics", hasInfo: true, tooltip: "Reporting dashboard" },
      { name: "API Access", hasInfo: true, tooltip: "Custom integrations" },
    ],
    cta: "Choose Professional",
    highlight: "Best Value",
  },
  {
    name: "Enterprise",
    price: "₹998",
    originalPrice: "₹1,299",
    period: "/month",
    description: "For large organizations",
    isPopular: false,
    discount: "23% OFF",
    icon: Shield,
    features: [
      { name: "All Professional", hasInfo: false },
      { name: "Unlimited Storage", hasInfo: true, tooltip: "Secure cloud" },
      { name: "Unlimited Agents", hasInfo: false },
      { name: "Account Manager", hasInfo: true, tooltip: "Enterprise support" },
      { name: "Custom Integrations", hasInfo: true, tooltip: "White-label" },
      { name: "SLA Guarantee", hasInfo: true, tooltip: "99.9% uptime" },
    ],
    cta: "Contact Sales",
    highlight: "Enterprise Security",
  },
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="w-full  to-white py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,135,191,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs md:text-sm font-medium mb-4">
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            Trusted by 50,000+ Users
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Choose the perfect plan for your verification needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>Annual</span>
            {isAnnual && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Save 20%</Badge>}
          </div>
        </div>

        {/* Pricing Cards */}
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg group ${
                    plan.isPopular
                      ? "border-2 border-blue-500 shadow-md scale-[1.02] bg-white"
                      : "border border-gray-200 hover:border-blue-300 bg-white"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-xs font-semibold shadow">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs font-semibold">{plan.discount}</Badge>
                  </div>

                  <CardHeader className="text-center pb-4 pt-7">
                    <div className="flex justify-center mb-3">
                      <div
                        className={`p-2 rounded-xl ${
                          plan.isPopular
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        } transition-colors duration-300`}
                      >
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-gray-600 text-xs mb-4 px-2">{plan.description}</p>

                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-3xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 line-through">{plan.originalPrice}</div>
                          <div className="text-xs text-gray-600">{plan.period}</div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{plan.highlight}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-6">
                    {/* Features List */}
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                          <span className="text-xs text-gray-700 flex-1">{feature.name}</span>
                          {feature.hasInfo && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-400 cursor-help hover:text-blue-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs max-w-xs">
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={`w-full py-3 text-sm font-semibold transition-all duration-300 ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md"
                          : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      }`}
                    >
                      {plan.cta}
                    </Button>

                    {/* Additional Info */}
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      No setup fees • Cancel anytime
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TooltipProvider>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm mb-3">Need a custom solution?</p>
          <Button 
            variant="outline" 
            className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent text-sm py-2 px-4"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}