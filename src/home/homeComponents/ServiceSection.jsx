import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ServiceCard from "./ServiceCard"; // Assuming ServiceCard component exists
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { CheckCircle, Loader2 } from "lucide-react";

// Static images to use randomly for services
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";

const staticImages = [PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage];

// Category mapping from API values to display categories
const categoryMapping = {
 'Identity Verification': 'Personal',
 'Financial & Business Checks': 'Finance and Banking',
 'Legal & Compliance Checks': 'Government',
 'Health & Government Records': 'Government',
 'Biometric & AI-Based Verification': 'Biometric',
 'Profile & Database Lookup': 'Personal',
 'Criminal Verification': 'Government',
 'Land Record Check': 'Government'
};

// Reverse mapping for filtering (display category to API categories)
const reverseMapping = {
 'Personal': ['Identity Verification', 'Profile & Database Lookup'],
 'Business': [], // Add business-specific API categories here if any
 'Government': ['Legal & Compliance Checks', 'Health & Government Records', 'Criminal Verification', 'Land Record Check'],
 'Biometric': ['Biometric & AI-Based Verification'],
 'Finance and Banking': ['Financial & Business Checks'],
 'Covid check': [] // Add covid-specific API categories here if any
};

// Helper function to get random image
const getRandomImage = (index) => {
 return staticImages[index % staticImages.length];
};

// Helper function to get demand level based on usage count
// const getDemandLevel = (usageCount) => {
//  if (usageCount > 1000) return "Most Demanding";
//  if (usageCount > 500) return "High Demanding";
//  if (usageCount > 100) return "Average Demanding";
//  return "Low Demanding";
// };

// Helper function to calculate discounted price
const calculateDiscountedPrice = (originalPrice, discount) => {
 if (!discount) return originalPrice;
 
 if (discount.type === 'percentage') {
   return originalPrice - (originalPrice * discount.value / 100);
 } else if (discount.type === 'fixed') {
   return Math.max(0, originalPrice - discount.value);
 }
 return originalPrice;
};

export default function ServicesSection() {
 const [activeCategory, setActiveCategory] = useState("All");
 
 const { 
   data: servicesResponse, 
   isLoading, 
   isError, 
   error 
 } = useGetServicesQuery();

 // Handle loading state
 if (isLoading) {
   return (
     <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
         <h2 className="mt-4 text-2xl font-bold text-gray-900">Loading Services...</h2>
       </div>
     </section>
   );
 }

 // Handle error state
 if (isError) {
   return (
     <section className="w-full bg-gradient-to-b from-red-50 to-gray-50 py-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-3xl font-bold text-red-700">Unable to Load Services</h2>
         <p className="mt-2 text-gray-600">
           {error?.data?.message || "Something went wrong while fetching the services."}
         </p>
       </div>
     </section>
   );
 }

 const services = servicesResponse?.data || [];

 const apiCategories = [...new Set(services.map(service => service.category))];
 const displayCategories = [...new Set(apiCategories.map(apiCat => categoryMapping[apiCat]).filter(Boolean))];
 const categories = ["All", ...displayCategories];

 // ⭐️ MODIFIED: When "All" is selected, it now shows the top "Personal" services.
 const filteredServices = (() => {
    // Create a copy and sort all services by usage count in descending order
    const sortedServices = [...services].sort((a, b) => b.globalUsageCount - a.globalUsageCount);

    if (activeCategory === "All") {
      // For "All", filter for "Personal" category services and return the top 4.
      const personalApiCategories = reverseMapping['Personal'] || [];
      const personalServices = sortedServices.filter(service => 
        personalApiCategories.includes(service.category)
      );
      return personalServices.slice(0, 4);
    } else {
      // For a specific category, filter first, then return the top 4 from that category.
      const apiCategoriesToFilter = reverseMapping[activeCategory] || [];
      const servicesInCategory = sortedServices.filter(service => 
        apiCategoriesToFilter.includes(service.category)
      );
      return servicesInCategory.slice(0, 4);
    }
 })();

 const handleCardClick = (serviceId) => {
   console.log(`Navigating to product/${serviceId}`);
   window.location.href = `/product/${serviceId}`;
 };

 return (
   <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="text-center">
         <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
           <CheckCircle className="w-4 h-4" />
           CHOOSE YOUR DESIRED SERVICE
         </div>
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
         
         <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
           {categories.map((category) => (
             <Button
               key={category}
               variant={activeCategory === category ? "default" : "outline"}
               className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                 activeCategory === category
                   ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                   : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
               }`}
               onClick={() => setActiveCategory(category)}
             >
               {category}
             </Button>
           ))}
         </div>
         
         <main className="flex-1">
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
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredServices.map((service, index) => {
                 const discountedPrice = calculateDiscountedPrice(service.price, service.discount);
                 const hasDiscount = service.discount && discountedPrice < service.price;
                 
                 return (
                   <div
                     key={service._id}
                     onClick={() => handleCardClick(service._id)}
                     className="cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out"
                   >
                     <ServiceCard
                       imageSrc={getRandomImage(index)}
                      //  demandLevel={getDemandLevel(service.globalUsageCount)}
                       serviceName={service.name}
                       verificationCount={service.globalUsageCount}
                       durationDays={7}
                       price={hasDiscount ? discountedPrice : service.price}
                       originalPrice={hasDiscount ? service.price : null}
                       buttonState={service.is_active ? "subscribe" : "disabled"}
                       discount={service.discount}
                       serviceImage={service.imageUrl}

                     />
                   </div>
                 );
               })}
             </div>
           )}
         </main>
       </div>
     </div>
   </section>
 );
}