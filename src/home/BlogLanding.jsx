"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
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
import { useGetBlogsQuery } from "@/app/api/blogApiSlice"
import { Link } from "react-router-dom"

export default function BlogLandingPage() {
  const { data: blogData, isLoading, error } = useGetBlogsQuery();
  const blogPosts = blogData?.data || [];
  
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => {
      if(sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])
  useEffect(()=>{
     window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });
  },[])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Technology": return <TrendingUp className="w-4 h-4" />
      case "Security": return <Shield className="w-4 h-4" />
      case "Compliance": return <FileText className="w-4 h-4" />
      case "Global": return <Globe className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Security": return "bg-red-100 text-red-800 border-red-200"
      case "Compliance": return "bg-green-100 text-green-800 border-green-200"
      case "Global": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Business": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main ref={sectionRef} className="min-h-screen bg-white">
        {/* Hero Section */}
             <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
               <div className="max-w-4xl mx-auto px-6">
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6 }}
                   className="text-center"
                 >
                   {/* <Shield className="w-16 h-16 mx-auto mb-6 text-white" /> */}
                   <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
                   <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                      Read our Blogs for better Insigts.
                   </p>
                   <div className="mt-6 text-sm text-gray-400">
                     Last updated:{" "}
                     {new Date().toLocaleDateString("en-US", {
                       year: "numeric",
                       month: "long",
                       day: "numeric",
                     })}
                   </div>
                 </motion.div>
               </div>
             </div>
       
        {/* Blog Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Latest <span className="text-[#1987BF]">Insights</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover expert perspectives on identity verification, compliance strategies, and the future of digital security.
              </p>
            </motion.div> */}

            {isLoading && <div className="text-center text-xl font-semibold">Loading Articles...</div>}
            {error && <div className="text-center text-red-500">Error: Could not load articles. Please try again later.</div>}

            {!isLoading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <Link to={`/blog/${post.slug}`} key={post._id} className="block group">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * index }}>
                      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white transform hover:-translate-y-2">
                        <div className="relative overflow-hidden">
                          <img src={post.mainImage?.url || 'https://placehold.co/600x400/EEE/31343C?text=Blog+Post'} alt={post.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-4 left-4">
                            <Badge className={`${getCategoryColor(post.category)} border`}>
                              {getCategoryIcon(post.category)}
                              <span className="ml-1">{post.category}</span>
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                            <div className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1987BF] transition-colors duration-300 line-clamp-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* --- FULL VIEW ALL BUTTON SECTION --- */}
            {/* <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.8 }} className="text-center mt-12">
              <Button size="lg" className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                View All Articles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div> */}
          </div>
        </section>

        <SubscriptionComponent />
      </main>
      <Footer />
    </div>
  )
}