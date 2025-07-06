import { useState } from "react"
import SidebarComponent from "../components/SidebarComponent"
import ServiceCard from "../cards/ServiceCard"
import PANCardImage from "../assets/PANCardImage.svg"
import AadharCardImage from "../assets/AadharCardImage.svg"
import VoterCardImage from "../assets/VoterCardImage.svg"
import PassportCardImage from "../assets/PassportCardImage.svg"
import PANAadhaarLinkedCardImage from "../assets/PANAadharLinkedCardImage.svg"
import PANValidationCardImage from "../assets/PANValidationCardImage.svg"
import PANLinkedCardImage from "../assets/PANLinkedCardImage.svg"
import DashboardHeader from "../components/DashboardHeader"

export default function UserDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const serviceCards = [
    { id: "pan-card", imageSrc: PANCardImage, demandLevel: "Most Demanding", serviceName: "PAN Card Verification", verificationCount: 20, durationDays: 7, price: 250, buttonState: "purchased" },
    { id: "aadhaar-card", imageSrc: AadharCardImage, demandLevel: "Most Demanding", serviceName: "Aadhaar Card Verification", verificationCount: 20, durationDays: 7, price: 360, buttonState: "subscribe" },
    { id: "voter-id", imageSrc: VoterCardImage, demandLevel: "Average Demanding", serviceName: "Voter ID Verification", verificationCount: 20, durationDays: 7, price: 241, buttonState: "subscribe" },
    { id: "passport", imageSrc: PassportCardImage, demandLevel: "Most Demanding", serviceName: "Passport Verification", verificationCount: 20, durationDays: 7, price: 241, buttonState: "subscribe" },
    { id: "pan-aadhaar-linked", imageSrc: PANAadhaarLinkedCardImage, demandLevel: "Most Demanding", serviceName: "Pan Aadhaar Linked Check", verificationCount: 20, durationDays: 7, price: 272, buttonState: "subscribe" },
    { id: "pan-validation-api", imageSrc: PANValidationCardImage, demandLevel: "Most Demanding", serviceName: "Pan Validation API", verificationCount: 20, durationDays: 7, price: 385, buttonState: "subscribe" },
    { id: "pan-linked", imageSrc: PANLinkedCardImage, demandLevel: "Average Demanding", serviceName: "Pan Linked", verificationCount: 20, durationDays: 7, price: 441, buttonState: "subscribe" },
    { id: "passport-2", imageSrc: PassportCardImage, demandLevel: "Most Demanding", serviceName: "Passport Verification", verificationCount: 20, durationDays: 7, price: 351, buttonState: "subscribe" },
  ]

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area, with a left margin on desktop to make space for the sidebar */}
      <div className="flex flex-col flex-1 md:ml-72">
        {/* A single, unified header that handles its own responsiveness */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  )
}
