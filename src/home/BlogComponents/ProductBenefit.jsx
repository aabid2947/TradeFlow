"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShieldCheck, FileText, Scale, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// Icon mapping for dynamic rendering based on string from DB
const iconMap = {
  ShieldCheck,
  FileText,
  Scale,
  Globe,
};

export default function ProductBenefitsCarousel({ data }) {
  // Destructure data from props with fallback values to prevent crashes
  const {
    benefitsSubtitle = 'WHY THIS PRODUCT',
    benefitsTitle = 'Robust and multi-point checks mitigate fraud and non-compliance risk',
    benefitsDescription = 'Verify that people are who they say they are, ensure that the correct checks are carried out, and help reduce risk for your business.',
    productBenefits = []
  } = data || {};

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4 // Number of items to show per slide

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(productBenefits.length / itemsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + Math.ceil(productBenefits.length / itemsPerPage)) % Math.ceil(productBenefits.length / itemsPerPage),
    )
  }

  const startIndex = currentIndex * itemsPerPage
  const visibleBenefits = productBenefits.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {benefitsSubtitle}
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 max-w-3xl">
            {benefitsTitle}
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {benefitsDescription}
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {visibleBenefits.map((benefit, index) => {
               // Use icon from map, with a fallback
              const Icon = iconMap[benefit.icon] || ShieldCheck; 
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4, ease: "easeOut" }}
                >
                  <div className="relative mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-teal-100">
                    <Icon className="w-8 h-8 text-teal-600" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* --- FULL CAROUSEL NAVIGATION --- */}
          {productBenefits.length > itemsPerPage && (
            <div className="flex justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}