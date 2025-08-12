"use client"

import { useState, useEffect } from "react"
import { Star, Quote, Verified } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const mockReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "Product Manager",
    company: "TechFlow Solutions",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c0763c4e?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "VerifyMe has transformed our onboarding process. The accuracy rate is outstanding. We've reduced fraud by 85% since implementation.",
    date: "2 weeks ago",
    verified: true,
    location: "Mumbai, Maharashtra",
  },
  {
    id: 2,
    name: "Raj Patel",
    title: "CTO",
    company: "SecureBank Ltd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "The real-time verification capabilities have exceeded our expectations. Customer satisfaction improved significantly, and the compliance features are exactly what we needed.",
    date: "1 month ago",
    verified: true,
    location: "Bangalore, Karnataka",
  },
  {
    id: 3,
    name: "Ananya Singh",
    title: "Operations Director",
    company: "Global Fintech",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "Exceptional service and support. The verification process is lightning-fast, and the detailed reporting helps us maintain compliance effortlessly.",
    date: "3 weeks ago",
    verified: true,
    location: "Delhi, NCR",
  },
  {
    id: 4,
    name: "Vikram Kumar",
    title: "Head of Security",
    company: "CryptoVault Inc",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "The most reliable verification platform we've used. The fraud detection algorithms are sophisticated, and the customer support team is incredibly responsive.",
    date: "2 months ago",
    verified: true,
    location: "Hyderabad, Telangana",
  },
  {
    id: 5,
    name: "Meera Gupta",
    title: "Compliance Manager",
    company: "RegTech Solutions",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "VerifyMe's comprehensive verification suite has streamlined our entire compliance workflow. The documentation is excellent, and implementation was surprisingly smooth.",
    date: "1 month ago",
    verified: true,
    location: "Pune, Maharashtra",
  },
  {
    id: 6,
    name: "Arjun Reddy",
    title: "VP Engineering",
    company: "DataSecure Corp",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "The  performance is exceptional with 99.9% uptime. The verification accuracy and speed have helped us scale our platform without compromising security.",
    date: "3 weeks ago",
    verified: true,
    location: "Chennai, Tamil Nadu",
  },
  {
    id: 7,
    name: "Sneha Joshi",
    title: "Tech Lead",
    company: "StartupHub India",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "Outstanding platform with excellent customer service. The verification process is smooth and the integration documentation is comprehensive.",
    date: "1 week ago",
    verified: true,
    location: "Gurgaon, Haryana",
  },
  {
    id: 8,
    name: "Rohit Agarwal",
    title: "Business Analyst",
    company: "FinServ Solutions",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "Game-changing solution for our business verification needs. The accuracy and speed are unmatched in the industry.",
    date: "2 weeks ago",
    verified: true,
    location: "Kolkata, West Bengal",
  },
  {
    id: 9,
    name: "Kavya Nair",
    title: "Product Owner",
    company: "TechInnovate",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    review:
      "Incredible platform that has revolutionized our identity verification process. Highly recommend to any business looking for reliable solutions.",
    date: "4 days ago",
    verified: true,
    location: "Kochi, Kerala",
  }
]

// Indian user avatars for the online users section
const indianUsers = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616c0763c4e?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face"
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
  const reviewsPerPage = 3

  const totalSlides = Math.ceil(mockReviews.length / reviewsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }

  // Auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000) // Auto-scroll every 4 seconds
    return () => clearInterval(timer)
  }, [currentIndex])

  const currentReviews = mockReviews.slice(currentIndex * reviewsPerPage, (currentIndex + 1) * reviewsPerPage)

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length

 return (
    <section className="w-full bg-gradient-to-br from-[#1987BF] via-blue-600 to-purple-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

          {/* Stats */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
            {/* Average Rating */}
            <div className="text-center break-words w-full md:w-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarRating rating={5} size="md" />
                <span className="text-2xl font-bold text-white break-words">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-blue-100 text-sm">Average Rating</p>
            </div>

            <div className="w-full md:w-px h-px md:h-12 bg-white/30" />

            {/* Verified Reviews */}
            <div className="text-center break-words w-full md:w-auto">
              <div className="text-2xl font-bold text-white mb-2 break-words">
                {mockReviews.length}+
              </div>
              <p className="text-blue-100 text-sm">Verified Reviews</p>
            </div>

            <div className="w-full md:w-px h-px md:h-12 bg-white/30" />

            {/* Satisfaction Rate */}
            <div className="text-center break-words w-full md:w-auto">
              <div className="text-2xl font-bold text-white mb-2 break-words">
                99%
              </div>
              <p className="text-blue-100 text-sm">Satisfaction Rate</p>
            </div>
          </div>

          {/* Online Indian users section */}
          <div className="mt-10 mb-12">
            <div className="flex flex-col items-center">
              <p className="text-blue-100 mb-4">Join our community of 50,000+ active users across India</p>
              <div className="flex -space-x-3">
                {indianUsers.map((avatar, index) => (
                  <div key={index} className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 overflow-hidden">
                    <img 
                      src={avatar}
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

        {/* Reviews Carousel - Auto-scrolling */}
        <div className="relative">
          {/* Main Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 transition-all duration-500 ease-in-out">
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

          {/* Simple Progress Indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? "w-8 h-3 bg-white" : "w-3 h-3 bg-white/30"
                }`}
              />
            ))}
          </div>

       
        </div>
      </div>
    </section>
  )
}