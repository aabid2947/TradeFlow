

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ServiceCard from "./ServiceCard";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { CheckCircle, Loader2 } from "lucide-react";
import ComingSoonCard from "./ComingSoonCard";
// Static images to use randomly for services
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import criminal from "@/assets/criminal.png";

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
 'Business': [],
 'Government': ['Legal & Compliance Checks', 'Health & Government Records', 'Criminal Verification', 'Land Record Check'],
 'Biometric': ['Biometric & AI-Based Verification'],
 'Finance and Banking': ['Financial & Business Checks'],
 'Covid check': []
};

// Helper function to get random image
const getRandomImage = (index) => {
 return staticImages[index % staticImages.length];
};

export default function ServicesSection() {
 const [activeCategory, setActiveCategory] = useState("All");
 
 const { 
   data: servicesResponse, 
   isLoading, 
   isError, 
   error 
 } = useGetServicesQuery();
//  console.log(servicesResponse)

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

 const filteredServices = (() => {
    const sortedServices = [...services].sort((a, b) => b.globalUsageCount - a.globalUsageCount);

    if (activeCategory === "All") {
      const personalApiCategories = reverseMapping['Personal'] || [];
      const personalServices = sortedServices.filter(service => 
        personalApiCategories.includes(service.category)
      );
      // Static services for "Coming Soon"
      const staticServices = [
          {
            _id: 'static-criminal-verification',
            name: 'Criminal Verification',
            price: 299,
            globalUsageCount: 0,
            is_active: false,
            isStatic: true,
            category: 'Criminal Verification',
            serviceImage: criminal
          },
        {
          _id: 'static-pan-verification',
          name: 'PAN Card Verification',
          price: 299,
          globalUsageCount: 0,
          is_active: false,
          isStatic: true,
          category: 'Identity Verification',
          serviceImage:PANCardImage
        },
        {
          _id: 'static-aadhaar-verification', 
          name: 'Aadhaar Verification',
          price: 299,
          globalUsageCount: 0,
          is_active: false,
          isStatic: true,
          category: 'Identity Verification',
          serviceImage:AadharCardImage
        },
      ];
      // Show static services at the top, then real services (limit to 7 total)
      const [a,b] = services.filter(service => service.name === 'EPFO Employer Verification' || service.name == "Voter ID Verification");
      const combinedServices = [...staticServices, ...personalServices.slice(0, 2), a, b];
      return combinedServices;
    } else {
      const apiCategoriesToFilter = reverseMapping[activeCategory] || [];
      const servicesInCategory = sortedServices.filter(service => 
        apiCategoriesToFilter.includes(service.category)
      );
      return servicesInCategory.slice(0, 4);
    }
 })();

 const handleCardClick = (serviceId) => {
   window.location.href = `/product/${serviceId}`;
 };

 return (
   <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
     <style jsx>{`
       .scrollbar-hide {
         -ms-overflow-style: none;
         scrollbar-width: none;
       }
       .scrollbar-hide::-webkit-scrollbar {
         display: none;
       }
       .horizontal-scroll {
         overflow-x: auto;
         overflow-y: hidden;
         white-space: nowrap;
         -webkit-overflow-scrolling: touch;
       }
     `}</style>
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
             <div className="overflow-x-auto scrollbar-hide horizontal-scroll">
               <div className="flex gap-6 pb-4" style={{width: 'max-content'}}>
                 {filteredServices.map((service, index) => (
                   <div
                     key={service._id}
                     onClick={() => !service.isStatic && handleCardClick(service._id)}
                     className={`${service.isStatic ? 'cursor-default' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 ease-in-out flex-shrink-0`}
                     style={{width: '288px', minWidth: '288px'}}
                   >
                     {service.isStatic ? (
                       <ComingSoonCard
                         imageSrc={getRandomImage(index)}
                         serviceName={service.name}
                         verificationCount={service.globalUsageCount}
                         durationDays={0}
                         price={service.price}
                         buttonState="coming-soon"
                         serviceImage={service.serviceImage}
                       />
                     ) : (
                       <ServiceCard
                         imageSrc={getRandomImage(index)}
                         serviceName={service.name}
                         verificationCount={service.globalUsageCount}
                         durationDays={7}
                         price={service.price}
                         buttonState={service.is_active ? "subscribe" : "disabled"}
                         serviceImage={service.imageUrl}
                       />
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}
         </main>
       </div>
     </div>
   </section>
 );
}
