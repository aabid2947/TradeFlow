"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ServiceCard from "../../cards/ServiceCard"
import PANCardImage from "../../assets/PANCardImage.svg"
import AadharCardImage from "../../assets/AadharCardImage.svg"
import VoterCardImage from "../../assets/VoterCardImage.svg"
import PassportCardImage from "../../assets/PassportCardImage.svg"
import PANAadhaarLinkedCardImage from "../../assets/PANAadharLinkedCardImage.svg"
import PANValidationCardImage from "../../assets/PANValidationCardImage.svg"
import PANLinkedCardImage from "../../assets/PANLinkedCardImage.svg"


const serviceCategories = [
  { name: "Personal", isActive: true },
  { name: "Business", isActive: false },
  { name: "Finance and Banking", isActive: false },
  { name: "Government", isActive: false },
  { name: "Biometric", isActive: false },
  { name: "Covid check", isActive: false },
]
const serviceCards = [
  { id: "pan-card", imageSrc: PANCardImage, demandLevel: "Most Demanding", serviceName: "PAN Card Verification", verificationCount: 20, durationDays: 7, price: 250, buttonState: "purchased" },
  { id: "aadhaar-card", imageSrc: AadharCardImage, demandLevel: "Most Demanding", serviceName: "Aadhaar Card Verification", verificationCount: 20, durationDays: 7, price: 360, buttonState: "subscribe" },
  { id: "voter-id", imageSrc: VoterCardImage, demandLevel: "Average Demanding", serviceName: "Voter ID Verification", verificationCount: 20, durationDays: 7, price: 241, buttonState: "subscribe" },
  { id: "passport", imageSrc: PassportCardImage, demandLevel: "Most Demanding", serviceName: "Passport Verification", verificationCount: 20, durationDays: 7, price: 241, buttonState: "subscribe" },
  // { id: "pan-aadhaar-linked", imageSrc: PANAadhaarLinkedCardImage, demandLevel: "Most Demanding", serviceName: "Pan Aadhaar Check", verificationCount: 20, durationDays: 7, price: 272, buttonState: "subscribe" },
  // { id: "pan-validation-api", imageSrc: PANValidationCardImage, demandLevel: "Most Demanding", serviceName: "Pan Validation API", verificationCount: 20, durationDays: 7, price: 385, buttonState: "subscribe" },
  // { id: "pan-linked", imageSrc: PANLinkedCardImage, demandLevel: "Average Demanding", serviceName: "Pan Linked", verificationCount: 20, durationDays: 7, price: 441, buttonState: "subscribe" },
  // { id: "passport-2", imageSrc: PassportCardImage, demandLevel: "Most Demanding", serviceName: "Passport Verification", verificationCount: 20, durationDays: 7, price: 351, buttonState: "subscribe" },
]



export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("Personal")

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Small heading */}
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-4 font-medium">CHOOSE YOUR DESIRED SERVICE</p>

          {/* Main heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Browse Our Top Services</h2>

          {/* Service category tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {serviceCategories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${activeCategory === category.name
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-4">
            <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
              {serviceCards.map((card) => (
                <ServiceCard
                  key={card.id}
                  imageSrc={card.imageSrc}
                  demandLevel={card.demandLevel}
                  serviceName={card.serviceName}
                  verificationCount={card.verificationCount}
                  durationDays={card.durationDays}
                  price={card.price}
                  buttonState={card.buttonState}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
