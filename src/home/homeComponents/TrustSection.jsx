"use client"

import { useState, useRef, useEffect } from "react"
import { Gauge, Target, FileCheck, ArrowRight, Award, Shield, Users, TrendingUp, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

const trustFeatures = [
  {
    icon: Gauge,
    title: "SPEED",
    subtitle: "Lightning Fast",
    description: "Average verification time under 2 seconds with 99.9% uptime guarantee",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    stat: "< 2s",
    statLabel: "Avg Response",
  },
  {
    icon: Target,
    title: "ACCURACY",
    subtitle: "Precision Verified",
    description: "AI-powered verification with machine learning algorithms for maximum precision",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    stat: "99.9%",
    statLabel: "Accuracy Rate",
  },
  {
    icon: FileCheck,
    title: "COMPLIANCE",
    subtitle: "Fully Compliant",
    description: "Meets all regulatory standards including GDPR, KYC, AML, and industry requirements",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    stat: "100%",
    statLabel: "Compliant",
  },
]

const companyLogos = [
  { name: "Gartner", logo: "Gartner", category: "Research" },
  { name: "Forrester", logo: "Forrester", category: "Analysis" },
  { name: "Liminal", logo: "Liminal", category: "Security" },
  { name: "Acuity", logo: "ACUITY", category: "Consulting" },
  { name: "Chartis", logo: "Chartis", category: "Research" },
  { name: "QKS Group", logo: "QKSGroup", category: "Advisory" },
]

const certifications = [
  { name: "ISO 27001", description: "Information Security Management" },
  { name: "SOC 2 Type II", description: "Security & Availability" },
  { name: "GDPR Compliant", description: "Data Protection Regulation" },
  { name: "PCI DSS", description: "Payment Card Industry Standard" },
]

const CountUpAnimation = ({
  end,
  duration = 2000,
  isVisible,
}) => {
  const [count, setCount] = useState("0")

  useEffect(() => {
    if (!isVisible) return

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
    } else if (end.includes("s")) {
      setTimeout(() => setCount(end), duration / 2)
    } else {
      setCount(end)
    }
  }, [end, duration, isVisible])

  return <span>{count}</span>
}

const TrustFeatureCard = ({
  feature,
  index,
  isVisible,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`
        group relative overflow-hidden border-2 ${feature.borderColor} hover:border-opacity-60
        bg-white hover:shadow-2xl transition-all duration-500 ease-out
        transform hover:-translate-y-2 hover:scale-105
        ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in" : "opacity-0"}
      `}
      style={{
        animationDelay: `${index * 200}ms`,
        animationDuration: "600ms",
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-2  min-w-48 text-center relative z-10">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
        />

        {/* Icon */}
        <div
          className={`relative mb-6 mx-auto w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
        >
          <feature.icon className={`w-10 h-10 ${feature.color}`} />
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4">
          <div className={`text-3xl font-bold ${feature.color} mb-1`}>
            <CountUpAnimation end={feature.stat} isVisible={isVisible} />
          </div>
          <div className="text-sm text-gray-500 font-medium">{feature.statLabel}</div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <div className={`flex items-center justify-center gap-2 mb-2`}>
            <div className={`w-2 h-2 ${feature.color.replace("text-", "bg-")} rounded-full`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${feature.color}`}>Verify</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
          <p className={`text-sm font-medium ${feature.color}`}>{feature.subtitle}</p>
        </div>

        {/* Description */}
        {/* <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p> */}

        {/* Hover Effect */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 ${feature.color.replace("text-", "bg-")} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />
      </CardContent>
    </Card>
  )
}

export default function TrustSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)
  const sectionRef = useRef(null)
  const navigate = useNavigate()
  

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
    <section ref={sectionRef} className="w-full bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div
            className={`space-y-12 ${isVisible ? "animate-in slide-in-from-left-8 fade-in duration-700" : "opacity-0"}`}
          >
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1987BF]/10 text-[#1987BF] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                Trusted Platform
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                How returning{" "}
                <span className="text-[#1987BF] relative">
                  customers trust
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#1987BF]/20 -skew-x-12" />
                </span>{" "}
                on our products.
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Join thousands of businesses who rely on our platform for secure, accurate, and compliant verification
                solutions.
              </p>
            </div>

            {/* Trust Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustFeatures.map((feature, index) => (
                <TrustFeatureCard key={index} feature={feature} index={index} isVisible={isVisible} />
              ))}
            </div>

            {/* Company Logos */}
            <div
              className={`${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}`}
              style={{ animationDelay: "600ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Recognized by Industry Leaders</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {companyLogos.map((company, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1987BF]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredLogo(company.name)}
                    onMouseLeave={() => setHoveredLogo(null)}
                  >
                    <span className="text-gray-600 font-semibold text-sm group-hover:text-[#1987BF] transition-colors duration-200">
                      {company.logo}
                    </span>

                    {/* Tooltip */}
                    {hoveredLogo === company.name && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap animate-in fade-in zoom-in duration-200">
                        {company.category}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className={`space-y-8 ${isVisible ? "animate-in slide-in-from-right-8 fade-in duration-700" : "opacity-0"}`}
            style={{ animationDelay: "300ms" }}
          >
            {/* Award Badge */}
            <Card className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white border-0 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

              <CardContent className="p-8 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">FEATURED</div>
                  <Badge className="bg-white/20 text-white border-white/30">2025</Badge>
                </div>

                <div className="mb-4">
                  <Award className="w-12 h-12 text-green-300 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">CATEGORY LEADER</h3>
                  <p className="text-green-100 leading-relaxed mb-6">
                    VerifyMyKyc is recognized as a leader in the GRC 2025 Service Matrix™ for Identity Capture and
                    Verification Solutions.
                  </p>
                </div>

                <Button
                onClick={()=>navigate("/about-us")}
                  variant="link"
                  className="text-white p-0 h-auto font-semibold text-sm group hover:text-green-200 transition-colors duration-200"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>

            {/* Expert Quote */}
            <Card className="bg-white border-2 border-gray-100 hover:border-[#1987BF]/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#1987BF] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Here's what the experts say</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">5.0 Expert Rating</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  "Recognition for our tech innovation, leadership, and mission to make the internet a safer place
                  through advanced verification technologies."
                </p>

                <Button className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group">
                  Awards & recognition
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>

            {/* Certifications */}
            <div
              className={`${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}`}
              style={{ animationDelay: "800ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Compliance</h3>
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-[#1987BF]/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-[#1987BF] group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-semibold text-gray-900 text-sm">{cert.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-[#1987BF] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#1987BF] mb-1">
                  <CountUpAnimation end="150%" isVisible={isVisible} />
                </div>
                <div className="text-gray-600 text-sm font-medium">Growth Rate</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <Users className="w-8 h-8 text-[#1987BF] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#1987BF] mb-1">10K+</div>
                <div className="text-gray-600 text-sm font-medium">Happy Customers</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
