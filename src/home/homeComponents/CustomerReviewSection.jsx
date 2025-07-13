"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote, Verified, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const mockReviews = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Product Manager",
    company: "TechFlow Solutions",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "VerifyMe has transformed our onboarding process. The API integration was seamless, and the accuracy rate is outstanding. We've reduced fraud by 85% since implementation.",
    date: "2 weeks ago",
    verified: true,
    location: "San Francisco, CA",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "CTO",
    company: "SecureBank Ltd",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "The real-time verification capabilities have exceeded our expectations. Customer satisfaction improved significantly, and the compliance features are exactly what we needed.",
    date: "1 month ago",
    verified: true,
    location: "New York, NY",
  },
  {
    id: 3,
    name: "Emily Watson",
    title: "Operations Director",
    company: "Global Fintech",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "Exceptional service and support. The verification process is lightning-fast, and the detailed reporting helps us maintain compliance effortlessly.",
    date: "3 weeks ago",
    verified: true,
    location: "London, UK",
  },
  {
    id: 4,
    name: "David Kim",
    title: "Head of Security",
    company: "CryptoVault Inc",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "The most reliable verification platform we've used. The fraud detection algorithms are sophisticated, and the customer support team is incredibly responsive.",
    date: "2 months ago",
    verified: true,
    location: "Singapore",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "Compliance Manager",
    company: "RegTech Solutions",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "VerifyMe's comprehensive verification suite has streamlined our entire compliance workflow. The documentation is excellent, and implementation was surprisingly smooth.",
    date: "1 month ago",
    verified: true,
    location: "Toronto, CA",
  },
  {
    id: 6,
    name: "James Anderson",
    title: "VP Engineering",
    company: "DataSecure Corp",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "The API performance is exceptional with 99.9% uptime. The verification accuracy and speed have helped us scale our platform without compromising security.",
    date: "3 weeks ago",
    verified: true,
    location: "Austin, TX",
  },
]

const StarRating = ({ rating, size = "sm" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
          } transition-colors duration-200`}
        />
      ))}
    </div>
  )
}

const ReviewCard = ({ review, isActive }) => {
  return (
    <Card
      className={`
      relative border-2 border-gray-100 hover:border-[#1987BF]/30 shadow-lg hover:shadow-xl transition-all duration-300 bg-white
      ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"}
    `}
    >
      <CardContent className="p-8">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10">
          <Quote className="w-12 h-12 text-[#1987BF]" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <Avatar className="w-14 h-14 border-2 border-gray-100 shadow-sm">
              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#1987BF] to-blue-600 text-white font-semibold text-lg">
                {review.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {review.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Verified className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-lg truncate">{review.name}</h4>
              {review.verified && (
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-[#1987BF] font-medium text-sm mb-1">{review.title}</p>
            <p className="text-gray-600 text-sm mb-2">{review.company}</p>
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs">{review.date}</span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <blockquote className="text-gray-700 leading-relaxed text-base mb-4 relative z-10">
          "{review.review}"
        </blockquote>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-gray-500 text-sm flex items-center gap-1">📍 {review.location}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-gray-600 text-sm font-medium">{review.rating}.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const reviewsPerPage = 3

  const totalSlides = Math.ceil(mockReviews.length / reviewsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, isPaused, currentIndex])

  const currentReviews = mockReviews.slice(currentIndex * reviewsPerPage, (currentIndex + 1) * reviewsPerPage)

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length

 return (
    <section className="w-full bg-gradient-to-br from-[#1987BF] via-blue-600 to-purple-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with updated text colors */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-current" />
            Trusted by 10,000+ Companies
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">What Our Customers Say</h2>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of satisfied customers who trust our verification platform to secure their business
            operations and enhance user experience.
          </p>

          {/* Stats with updated text colors */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarRating rating={5} size="md" />
                <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-blue-100 text-sm">Average Rating</p>
            </div>

            <div className="w-px h-12 bg-white/30"></div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">{mockReviews.length}+</div>
              <p className="text-blue-100 text-sm">Verified Reviews</p>
            </div>

            <div className="w-px h-12 bg-white/30"></div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">99%</div>
              <p className="text-blue-100 text-sm">Satisfaction Rate</p>
            </div>
          </div>
          
          {/* Online users section */}
          <div className="mt-10 mb-12">
            <div className="flex flex-col items-center">
              <p className="text-blue-100 mb-4">Join our community of 50,000+ active users</p>
              <div className="flex -space-x-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${index + 10}`}
                      alt="Online user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-blue-800 border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">50K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Main Reviews Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 transition-all duration-500 ease-in-out"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {currentReviews.map((review, index) => (
              <div
                key={review.id}
                className="transform transition-all duration-500"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <ReviewCard review={review} isActive={true} />
              </div>
            ))}
          </div>

          {/* Navigation Controls with updated colors */}
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white text-white hover:bg-white/10 transition-all duration-200 bg-transparent shadow-sm"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex ? "w-8 h-3 bg-white" : "w-3 h-3 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white text-white hover:bg-white/10 transition-all duration-200 bg-transparent shadow-sm"
              disabled={currentIndex === totalSlides - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Auto-play Control */}
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="ghost"
              size="sm"
              className="ml-4 text-white hover:text-blue-200"
              aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="w-full bg-white/30 rounded-full h-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/80 mt-2">
              <span>
                Review {currentIndex * reviewsPerPage + 1}-
                {Math.min((currentIndex + 1) * reviewsPerPage, mockReviews.length)}
              </span>
              <span>of {mockReviews.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
