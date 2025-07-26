import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import ServiceCard from "./ServiceCard"
import { useGetServicesQuery } from "@/app/api/serviceApiSlice"
import { CheckCircle, Loader2 } from "lucide-react"

// Static images to use randomly for services
import PANCardImage from "@/assets/PANCardImage.svg"
import AadharCardImage from "@/assets/AadharCardImage.svg"
import VoterCardImage from "@/assets/VoterCardImage.svg"
import PassportCardImage from "@/assets/PassportCardImage.svg"

const staticImages = [PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage]

// Helper function to get random image
const getRandomImage = (index) => {
  return staticImages[index % staticImages.length]
}

// Helper function to get demand level based on usage count
const getDemandLevel = (usageCount) => {
  if (usageCount > 1000) return "Most Demanding"
  if (usageCount > 500) return "High Demanding"
  if (usageCount > 100) return "Average Demanding"
  return "Low Demanding"
}

// Helper function to calculate discounted price
const calculateDiscountedPrice = (originalPrice, discount) => {
  if (!discount) return originalPrice
  
  if (discount.type === 'percentage') {
    return originalPrice - (originalPrice * discount.value / 100)
  } else if (discount.type === 'fixed') {
    return Math.max(0, originalPrice - discount.value)
  }
  return originalPrice
}

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  
  // Fetch services from API
  const { 
    data: servicesResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetServicesQuery()

  // Handle loading state
  if (isLoading) {
    return (
      <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              LOADING SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              Loading Our Services...
            </h2>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Handle error state
  if (isError) {
    return (
      <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              ERROR LOADING SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Unable to Load Services
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              {error?.data?.message || "Something went wrong while fetching services"}
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Extract services data
  const services = servicesResponse?.data || []

  // Get unique categories from services
  const categories = ["All", ...new Set(services.map(service => service.category))]

  // Filter services based on active category
  const filteredServices = activeCategory === "All" 
    ? services 
    : services.filter(service => service.category === activeCategory)

  // Handle card click - navigate to product page
  const handleCardClick = (serviceId) => {
    // Replace with your navigation logic
    window.location.href = `/product/${serviceId}`
    // Or use your router: navigate(`/product/${serviceId}`)
  }

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Small heading */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            CHOOSE YOUR DESIRED SERVICE
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Browse Our
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {" "}
              Top Services
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Comprehensive verification services trusted by thousands of users across India
          </p>

          {/* Dynamic service category tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Services grid */}
          <main className="flex-1 p-4 sm:p-6 lg:p-4">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600">
                  {activeCategory === "All" 
                    ? "No services are currently available." 
                    : `No services found in the "${activeCategory}" category.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service, index) => {
                  const discountedPrice = calculateDiscountedPrice(service.price, service.discount)
                  const hasDiscount = service.discount && discountedPrice < service.price
                  
                  return (
                    <div
                      key={service._id}
                      onClick={() => handleCardClick(service._id)}
                      className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    >
                      <ServiceCard
                        imageSrc={getRandomImage(index)}
                        demandLevel={getDemandLevel(service.globalUsageCount)}
                        serviceName={service.name}
                        verificationCount={service.globalUsageCount}
                        durationDays={7} // Default value, can be made dynamic later
                        price={hasDiscount ? discountedPrice : service.price}
                        originalPrice={hasDiscount ? service.price : null}
                        buttonState={service.is_active ? "subscribe" : "disabled"}
                        discount={service.discount}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </main>

          {/* Service count info */}
          {/* {filteredServices.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} 
                {activeCategory !== "All" && ` in "${activeCategory}"`}
              </p>
            </div>
          )} */}
        </div>
      </div>
    </section>
  )
}