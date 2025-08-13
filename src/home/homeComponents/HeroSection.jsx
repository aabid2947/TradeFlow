"use client"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  FileCheck,
  Search,
  Heart,
  Award,
  Play,
  CheckCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import DigitalIdentityVerification from "@/assets/Digital Identity Verification.png"
import DigitalESign from "@/assets/Digital eSign.png"
const heroSlides = [
  {
    id: 1,
    title: "Trusted Identity & Background Verification for Your Home",
    subtitle: "Domestic Help Verification",
    description:
      "Hiring domestic help or personal staff (maids, drivers, nannies, etc.) is a convenient necessity for many families – but ensuring their trustworthiness is crucial. verifyMyKyc is a digital identity verification platform tailored for individuals and households.",
    features: ["Background Checks", "Identity Verification", "Criminal Record Screening", "Reference Validation"],
    icon: Users,
    gradient: "from-blue-600 via-purple-600 to-blue-800",
    accentColor: "#1987BF",

    stats: { number: "50K+", label: "Families Protected" },
  },
  {
    id: 2,
    title: "Comprehensive Document Verification Services",
    subtitle: "Document Authentication",
    description:
      "Verify all types of official documents instantly with our AI-powered verification system. From PAN cards to passports, ensure authenticity and prevent fraud with our comprehensive document verification solutions.",
    features: ["PAN Card Verification", "Aadhaar Verification", "Passport Validation", "License Checks"],
    icon: FileCheck,
    // image:DigitalIdentityVerification,
    gradient: "from-emerald-600 via-teal-600 to-cyan-800",
    accentColor: "#059669",
    stats: { number: "1M+", label: "Documents Verified" },
  },
  {
    id: 3,
    title: "Advanced Biometric & Identity Matching",
    subtitle: "Biometric Verification",
    description:
      "Leverage cutting-edge facial recognition and biometric technology to ensure identity authenticity. Our advanced algorithms provide accurate face matching and likeness detection for enhanced security.",
    features: ["Face Recognition", "Biometric Matching", "Liveness Detection", "Identity Confirmation"],
    icon: Search,
    // image:DigitalESign,
    gradient: "from-orange-600 via-red-600 to-pink-800",
    accentColor: "#EA580C",
    stats: { number: "99.9%", label: "Accuracy Rate" },
  },
  {
    id: 4,
    title: "Business & Company Verification Solutions",
    subtitle: "Corporate Verification",
    description:
      "Comprehensive business verification services for B2B transactions. Validate company credentials, licenses, and registrations to ensure legitimate business partnerships and reduce commercial risks.",
    features: ["GST Verification", "Company Registration", "FSSAI License Check", "MSME Validation"],
    icon: Shield,
    gradient: "from-violet-600 via-purple-600 to-indigo-800",
    accentColor: "#7C3AED",
    stats: { number: "25K+", label: "Businesses Verified" },
  },
  {
    id: 5,
    title: "Specialized Health & Safety Verifications",
    subtitle: "Health Verification",
    description:
      "Specialized verification services including vaccination certificates, medical records, and health-related document validation. Ensure compliance with health and safety requirements.",
    features: ["Vaccination Certificates", "Medical Records", "Health Compliance", "Safety Verification"],
    icon: Heart,
    gradient: "from-rose-600 via-pink-600 to-red-800",
    accentColor: "#E11D48",
    stats: { number: "100K+", label: "Health Records Verified" },
  },
]

const FloatingElement = ({ delay = 0, children, className = "" }) => (
  <div
    className={`animate-float ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: "6s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out",
    }}
  >
    {children}
  </div>
)

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(null)
  const navigate = useNavigate()

  const nextSlide = () => {
    if (isAnimating) return
    setDirection("right")
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setDirection("left")
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return
    setDirection(index > currentSlide ? "right" : "left")
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 800)
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [])

  const currentHero = heroSlides[currentSlide]

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(25, 135, 191, 0.3); }
          50% { box-shadow: 0 0 40px rgba(25, 135, 191, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-left {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100px); opacity: 0; }
        }
        @keyframes slide-out-right {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        .slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        .slide-out-left {
          animation: slide-out-left 0.8s ease-out forwards;
        }
        .slide-out-right {
          animation: slide-out-right 0.8s ease-out forwards;
        }
        .scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
      `}</style>
      <section className="relative w-full  overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Dynamic Gradient Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentHero.gradient} opacity-5 animate-gradient transition-all duration-1000`}
          />
          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <FloatingElement
              delay={0}
              className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
            />
            <FloatingElement
              delay={1}
              className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-lg opacity-20"
            />
            <FloatingElement
              delay={2}
              className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20"
            />
            <FloatingElement
              delay={3}
              className="absolute bottom-20 right-40 w-18 h-18 bg-orange-200 rounded-lg opacity-20"
            />
            <FloatingElement
              delay={4}
              className="absolute top-60 left-1/3 w-12 h-12 bg-pink-200 rounded-full opacity-20"
            />
          </div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${currentHero.accentColor} 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </div>
        {/* Navigation Arrows - Positioned at screen edges */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block">
          <Button
            onClick={prevSlide}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 text-gray-700 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
            style={{ borderColor: currentHero.accentColor }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block">
          <Button
            onClick={nextSlide}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 text-gray-700 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
            style={{ borderColor: currentHero.accentColor }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {" "}
          {/* Changed py-2 to py-12 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {" "}
            {/* Removed min-h-screen */}
            {/* Left Content */}
            <div
              className={`space-y-8 ${isAnimating ? (direction === "right" ? "slide-out-left" : "slide-out-right") : direction === "right" ? "slide-in-right" : "slide-in-left"}`}
            >
              {/* Animated Category Badge */}
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full text-sm font-medium shadow-lg border border-gray-200 animate-pulse-glow">
                <div className="relative">
                  <currentHero.icon className="w-5 h-5" style={{ color: currentHero.accentColor }} />
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: currentHero.accentColor, opacity: 0.4 }}
                  />
                </div>
                {currentHero.subtitle}
                <div className="flex gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
              </div>
              {/* Animated Main Heading */}
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  {currentHero.title}
                </span>
              </h1>
              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed font-light">{currentHero.description}</p>
              {/* Animated Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {currentHero.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: `slide-in-${direction === "right" ? "right" : "left"} 0.6s ease-out ${index * 0.1}s forwards`,
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="group relative overflow-hidden text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: currentHero.accentColor }}
                  onClick ={()=> navigate("/pricing")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Pricing
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
                <Button
                  variant="outline"
                  className="group border-2 text-gray-700 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{ borderColor: currentHero.accentColor }}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Watch Demo
                </Button>
              </div>
            </div>
            {/* Right Side - Enhanced Visualization (hidden on mobile) */}
            <div
              className={`hidden lg:flex justify-center lg:justify-end ${isAnimating ? (direction === "right" ? "slide-out-right" : "slide-out-left") : direction === "right" ? "slide-in-right" : "slide-in-left"}`}
            >
              <div className="relative">

                {/* Main Card */}
                {currentHero.image?<img src={currentHero.image}/>:  <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header with Gradient */}
                    <div className={`h-32 bg-gradient-to-br ${currentHero.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <currentHero.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-2xl font-bold">Verified</div>
                        <div className="text-sm opacity-90">Trusted Platform</div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-8 space-y-6">
                      {/* Trust Indicators */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5" style={{ color: currentHero.accentColor }} />
                          <span className="font-semibold text-gray-800">Industry Leader</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      {/* Animated Progress Bars */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Security Level</span>
                            <span className="font-semibold">99.9%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full animate-pulse"
                              style={{
                                backgroundColor: currentHero.accentColor,
                                width: "99.9%",
                                transition: "width 2s ease-in-out",
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Verification Speed</span>
                            <span className="font-semibold">98%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full animate-pulse"
                              style={{
                                backgroundColor: currentHero.accentColor,
                                width: "98%",
                                transition: "width 2s ease-in-out",
                                animationDelay: "0.5s",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Live Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: currentHero.accentColor }}>
                            24/7
                          </div>
                          <div className="text-xs text-gray-600">Support</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: currentHero.accentColor }}>
                            2s
                          </div>
                          <div className="text-xs text-gray-600">Response Time</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>}
              
                {/* Floating Elements Around Card */}
                <FloatingElement
                  delay={0}
                  className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-60"
                />
                <FloatingElement
                  delay={1}
                  className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-500 rounded-full opacity-60"
                />
                <FloatingElement
                  delay={2}
                  className="absolute top-1/2 -left-8 w-4 h-4 bg-purple-500 rounded-full opacity-60"
                />
              </div>
            </div>
          </div>
          {/* Enhanced Carousel Navigation */}
          {/* <div className="flex items-center justify-center gap-6 ">
            <Button
              onClick={prevSlide}
              disabled={isAnimating}
              className="lg:hidden w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 text-gray-700 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
              style={{ borderColor: currentHero.accentColor }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-3 lg:hidden">
              {heroSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    index === currentSlide ? "w-12 h-4" : "w-4 h-4 hover:w-6"
                  }`}
                  style={{
                    backgroundColor: index === currentSlide ? currentHero.accentColor : "#E5E7EB",
                  }}
                >
                  {index === currentSlide && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
                </button>
              ))}
            </div>
            <Button
              onClick={nextSlide}
              disabled={isAnimating}
              className="lg:hidden w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 text-gray-700 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
              style={{ borderColor: currentHero.accentColor }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div> */}
        </div>
      </section>
    </>
  )
}
