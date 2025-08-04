"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Shield,
  FileText,
  Globe,
  TrendingUp,
  Search,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "./homeComponents/Header"
import Footer from "./homeComponents/Footer"
import SubscriptionComponent from "./homeComponents/SubsciptionSection"

// Updated blog data with relevant online images
const blogPosts = [
  {
    id: 1,
    title: "The Future of Digital Identity Verification",
    excerpt:
      "Explore the latest trends in digital identity verification and how AI is revolutionizing the KYC process.",
    author: "Rajesh Kumar",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e40?q=80&w=2070&auto=format&fit=crop",
    slug: "future-digital-identity-verification",
  },
  {
    id: 2,
    title: "KYC Compliance Guide for Businesses",
    excerpt: "A comprehensive guide to KYC compliance requirements and best practices for modern businesses.",
    author: "Priya Sharma",
    date: "2024-01-12",
    readTime: "12 min read",
    category: "Compliance",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop",
    slug: "kyc-compliance-guide-businesses",
  },
  {
    id: 3,
    title: "Advanced Document Verification Techniques",
    excerpt: "Learn how advanced document verification is reducing fraud and improving security across industries.",
    author: "Amit Patel",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1585392476620-91957a641e74?q=80&w=1932&auto=format&fit=crop",
    slug: "advanced-document-verification-techniques",
  },
  {
    id: 4,
    title: "Global KYC Requirements Overview",
    excerpt: "Navigate international KYC requirements and build scalable verification systems for global operations.",
    author: "Sarah Johnson",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "Global",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop",
    slug: "global-kyc-requirements-overview",
  },
  {
    id: 5,
    title: "ROI of Automated Identity Verification",
    excerpt: "Discover how businesses achieve 300% ROI through automated identity verification solutions.",
    author: "Michael Chen",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Business",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    slug: "roi-automated-identity-verification",
  },
  {
    id: 6,
    title: "Biometric Authentication Revolution",
    excerpt: "How biometric authentication is balancing security with user convenience in digital transactions.",
    author: "Dr. Lisa Wang",
    date: "2024-01-03",
    readTime: "9 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1581255541252-e4221191a27e?q=80&w=2070&auto=format&fit=crop",
    slug: "biometric-authentication-revolution",
  },
]

export default function BlogLandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Technology":
        return <TrendingUp className="w-4 h-4" />
      case "Security":
        return <Shield className="w-4 h-4" />
      case "Compliance":
        return <FileText className="w-4 h-4" />
      case "Global":
        return <Globe className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Security":
        return "bg-red-100 text-red-800 border-red-200"
      case "Compliance":
        return "bg-green-100 text-green-800 border-green-200"
      case "Global":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Business":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
    <main ref={sectionRef} className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF]/80 via-transparent to-teal-600/80" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              VerifyMyKyc
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
                Knowledge Hub
              </span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              Stay ahead in the world of digital identity verification with expert insights, industry trends, and
              comprehensive guides on KYC compliance and security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-white text-[#1987BF] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Articles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1987BF] px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Topics
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: "50+", label: "Expert Articles" },
              { number: "10K+", label: "Monthly Readers" },
              { number: "24/7", label: "Updated Content" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-6 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Latest <span className="text-[#1987BF]">Insights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover expert perspectives on identity verification, compliance strategies, and the future of digital
              security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              // --- WRAPPED CARD WITH <a> TAG FOR NAVIGATION ---
              <a href="/identity-verification" key={post.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image} // Use the new online image URL
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(post.category)} border`}>
                          {getCategoryIcon(post.category)}
                          <span className="ml-1">{post.category}</span>
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-[#1987BF]" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1987BF] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#1987BF] to-teal-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-500">Author</p>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1987BF] group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </a>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
    <SubscriptionComponent/>
    </main>
      <Footer />
    </div>
  )
}