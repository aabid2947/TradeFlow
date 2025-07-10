"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockReviews = [
  {
    id: 1,
    name: "Ashley Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "I really like the system at this management. I love recommending this software to you guys",
  },
  {
    id: 2,
    name: "Jackline Fare",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "We align our success with the success of our customers which is why our offering transcends our software.",
  },
  {
    id: 3,
    name: "Ashley Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "I really like the system at this management. I love recommending this software to you guys",
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Outstanding verification service! The speed and accuracy are unmatched. Highly recommend for any business.",
  },
  {
    id: 5,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "The API integration was seamless and the support team is incredibly responsive. Great experience overall.",
  },
  {
    id: 6,
    name: "David Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "Reliable, fast, and secure verification process. This has streamlined our KYC procedures significantly.",
  },
  {
    id: 7,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Excellent customer service and robust verification features. The compliance tools are particularly impressive.",
  },
  {
    id: 8,
    name: "James Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "The verification accuracy is phenomenal. We've reduced fraud significantly since implementing this solution.",
  },
  {
    id: 9,
    name: "Lisa Park",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "User-friendly interface and comprehensive documentation. The onboarding process was smooth and efficient.",
  },
  {
    id: 10,
    name: "Robert Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Cost-effective solution with enterprise-grade features. The ROI has been exceptional for our organization.",
  },
  {
    id: 11,
    name: "Amanda Foster",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "The real-time verification capabilities have transformed our customer onboarding experience completely.",
  },
  {
    id: 12,
    name: "Daniel Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review: "Impressive scalability and performance. Handles high-volume verification requests without any issues.",
  },
]

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + reviewsPerPage >= mockReviews.length ? 0 : prevIndex + reviewsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, mockReviews.length - reviewsPerPage) : Math.max(0, prevIndex - reviewsPerPage),
    )
  }

  const currentReviews = mockReviews.slice(currentIndex, currentIndex + reviewsPerPage)

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
  }

  return (
    <section className="w-full bg-[#3F87FE] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Our Customers Review</h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentReviews.map((review) => (
              <Card key={review.id} className="bg-blue-600 border-blue-500 text-white relative overflow-hidden">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Quote className="w-12 h-12 text-white" />
                  </div>

                  {/* Review Text */}
                  <p className="text-white mb-6 relative z-10 leading-relaxed">"{review.review}"</p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                      <AvatarFallback className="bg-blue-700 text-white text-sm">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{review.name}</h4>
                      <div className="flex gap-1 mt-1">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="sm"
              className="w-10 h-10 rounded-full bg-blue-700 border-blue-600 text-white hover:bg-blue-800 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="sm"
              className="w-10 h-10 rounded-full bg-blue-700 border-blue-600 text-white hover:bg-blue-800 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
