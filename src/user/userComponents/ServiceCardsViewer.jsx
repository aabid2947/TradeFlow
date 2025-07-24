import { useState } from "react";
import ServiceCard from "@/cards/ServiceCard";
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import PANAadhaarLinkedCardImage from "@/assets/PANAadharLinkedCardImage.svg";
import PANValidationCardImage from "@/assets/PANValidationCardImage.svg";
import PANLinkedCardImage from "@/assets/PANLinkedCardImage.svg";

// --- Imports for Modal Functionality ---
import { UserInfoCard } from "./UserInfoCard";
import { UserDetailsCard } from "./UserDetailsCard";
import { Button } from "@/components/ui/button";
import { useVerifyServiceMutation } from "@/app/api/verificationApiSlice";

const fallbackImages = [
  PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
  PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
];
const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];

// A simple X icon for the close button
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);


export default function ServiceCardsViewer({ services = [], isLoading }) {
  // --- State Management for Modal and Verification ---
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  
  const [verifyService, { isLoading: isVerifying }] = useVerifyServiceMutation();

  const handleSubscribeClick = (serviceKey) => {
    setActiveServiceId(serviceKey);
    setVerificationResult(null);
    setVerificationError(null);
  };

  const handleCloseModal = () => {
    setActiveServiceId(null);
  };

  const handleVerify = async (payload) => {
    if (!activeServiceId) return;
    setVerificationResult(null);
    setVerificationError(null);
    try {
      const response = await verifyService({
        serviceKey: activeServiceId,
        payload,
      }).unwrap();
      setVerificationResult(response);
    } catch (err) {
      console.error("❌ Verification failed:", err);
      setVerificationError(err.data || { message: "An unexpected error occurred." });
    }
  };
 
  const serviceCards = services.map((svc) => {
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    const randomDemand = demandLevels[Math.floor(Math.random() * demandLevels.length)];

    return {
      id: svc.service_key,
      imageSrc: svc.imageUrl || randomImage,
      demandLevel: svc.demandLevel || randomDemand,
      serviceName: svc.name,
      verificationCount: svc.globalUsageCount,
      durationDays: 7,
      price: svc.price,
      buttonState: "subscribe",
      serviceId: svc.service_key,
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full" style={{ height: '60vh' }}>
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <h1 className="font-bold text-xl my-2">KYC Verification API</h1>
      {serviceCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {serviceCards.map((card) => (
            <ServiceCard
              key={card.id}
              {...card}
              // --- Pass the click handler to the card ---
              onSubscribeClick={handleSubscribeClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>No services found for this category.</p>
        </div>
      )}

      {/* --- VERIFICATION MODAL --- */}
      {activeServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
          
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
              <UserInfoCard
                services={services}
                activeServiceId={activeServiceId}
                onVerify={handleVerify}
                isVerifying={isVerifying}
              />
              {(verificationResult || verificationError) && (
                <UserDetailsCard result={verificationResult} error={verificationError} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}