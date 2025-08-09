"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, Users, Clock, Award, Zap, Shield } from "lucide-react"

const statsData = [
  {
    value: "95%",
    description: "Coverage across India",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "~0.5",
    description: "Seconds - Average Time to Verify a user",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    value: "~3",
    description: "Seconds - End-to-end verification speed -as fast as receiving an OTP",
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    value: "#1",
    description: "Verification solution trusted by top buissness in India",
    icon: Award,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
]

const CountUpAnimation = ({
  end,
  duration = 2000,
  isVisible,
}) => {
  const [count, setCount] = useState("0")
  const ref = useRef()

  useEffect(() => {
    if (!isVisible) return

    // Handle different types of values
    if (end.includes("%")) {
      const numericEnd = Number.parseInt(end.replace("%", ""))
      let start = 0
      const increment = numericEnd / (duration / 50)

      const timer = setInterval(() => {
        start += increment
        if (start >= numericEnd) {
          setCount(`${numericEnd}%`)
          clearInterval(timer)
        } else {
          setCount(`${Math.floor(start)}%`)
        }
      }, 50)

      return () => clearInterval(timer)
    } else if (end.includes("~")) {
      // For decimal values like ~0.5
      const numericEnd = Number.parseFloat(end.replace("~", ""))
      let start = 0
      const increment = numericEnd / (duration / 50)

      const timer = setInterval(() => {
        start += increment
        if (start >= numericEnd) {
          setCount(`~${numericEnd}`)
          clearInterval(timer)
        } else {
          setCount(`~${start.toFixed(1)}`)
        }
      }, 50)

      return () => clearInterval(timer)
    } else {
      // For text values like "#1"
      setTimeout(() => setCount(end), duration / 2)
    }
  }, [end, duration, isVisible])

  return <span>{count}</span>
}

const StatCard = ({
  stat,
  index,
  isVisible,
}) => {
  const IconComponent = stat.icon

  return (
    <div
      className={`
        group relative overflow-hidden bg-white rounded-2xl p-8 
        shadow-lg hover:shadow-2xl transition-all duration-500 ease-out
        border border-gray-100 hover:border-gray-200
        transform hover:-translate-y-2 hover:scale-105
        ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in" : "opacity-0"}
      `}
      style={{
        animationDelay: `${index * 150}ms`,
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color}`} />
      </div>

      {/* Icon */}
      <div
        className={`relative z-10 w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
      </div>

      {/* Value */}
      <div className="relative z-10 mb-4">
        <div
          className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
        >
          <CountUpAnimation end={stat.value} isVisible={isVisible} />
        </div>
        <div className="w-12 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full group-hover:from-current group-hover:to-transparent transition-colors duration-300" />
      </div>

      {/* Description */}
      <p className="relative z-10 text-gray-600 leading-relaxed font-medium group-hover:text-gray-700 transition-colors duration-300">
        {stat.description}
      </p>

      {/* Hover Effect Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

export default function StatsBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef =useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#1987BF]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1987BF]/10 text-[#1987BF] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            Performance Metrics
          </div>

          <h2
            className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${isVisible ? "animate-in slide-in-from-top-4 fade-in duration-700" : "opacity-0"}`}
          >
            Trusted by 10,000+
          </h2>

          <p
            className={`text-xl text-gray-600 max-w-3xl mx-auto ${isVisible ? "animate-in slide-in-from-top-4 fade-in duration-700" : "opacity-0"}`}
            style={{ animationDelay: "200ms" }}
          >
            Our platform delivers exceptional performance and reliability that businesses depend on
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}`}
          style={{ animationDelay: "800ms" }}
        >
          <div className="inline-flex items-center gap-2 text-gray-600 text-2xl">
            <Shield className="w-6 h-6 text-[#1987BF] text-2xl" />
            <span>Trusted by 10,000+ businesses worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
