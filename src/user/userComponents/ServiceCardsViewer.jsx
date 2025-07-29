import { useState } from "react";
import { toast } from "react-hot-toast";
import ServiceCard from "@/cards/ServiceCard";
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";

import { UserInfoCard } from "./UserInfoCard";
import { UserDetailsCard } from "./UserDetailsCard";
import { Button } from "@/components/ui/button";
import SubscriptionPurchaseCard from "./SubscriptionPurchaseCard";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";

const fallbackImages = [ PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage ];
const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function ServiceCardsViewer({ services = [], isLoading, userInfo }) {
 
  const [serviceForVerification, setServiceForVerification] = useState(null);
  const [categoryForPurchase, setCategoryForPurchase] = useState(null);
  
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  
  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  const handleActionButtonClick = (service) => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);

    const isSubscribed = userInfo?.promotedCategories?.includes(service.category);

    if (isSubscribed) {
      setServiceForVerification(service);
      setCategoryForPurchase(null);
    } else {
      setCategoryForPurchase(service);
      setServiceForVerification(null);
    }
  };

  const handleCloseModal = () => {
    setServiceForVerification(null);
    setCategoryForPurchase(null);
  };

  const handleExecuteVerification = async (payload) => {
      if (!serviceForVerification) return;

      setInputData(payload);
      setVerificationResult(null);
      setVerificationError(null);

      try {
        const result = await executeService({ 
            serviceKey: serviceForVerification.service_key, 
            payload 
        }).unwrap();
        
        setVerificationResult(result);
        toast.success(result.message || "Verification successful!");

      } catch (err) {
        console.error("Service execution failed:", err);
        setVerificationError(err.data || { message: "Service execution failed."});
        toast.error(err.data?.message || "Could not execute service.");
      }
  };
 
  const serviceCards = services.map((svc) => {
  
    const isSubscribed = userInfo?.promotedCategories?.includes(svc.category);
    return {
        id: svc.service_key,
        key: svc.service_key,
        imageSrc: svc.imageUrl || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
        demandLevel: svc.demandLevel || demandLevels[Math.floor(Math.random() * demandLevels.length)],
        serviceName: svc.name,
        verificationCount: svc.globalUsageCount,
        price: svc.price,
        service: svc,
        buttonType: isSubscribed ? "verify" : "purchase",
        onButtonClick: handleActionButtonClick,
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative ">
      <h1 className="font-bold text-xl my-2">KYC Verification API</h1>
      {serviceCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {serviceCards.map((cardProps) => (
            <ServiceCard {...cardProps} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>No services found for this category.</p>
        </div>
      )}

      {/* Verification Modal */}
      {serviceForVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
          
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800">
              <XIcon className="h-5 w-5" />
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
              <UserInfoCard
                services={services}
                activeServiceId={serviceForVerification.service_key}
                onVerify={handleExecuteVerification}
                isVerifying={isVerifying}
                userInfo={userInfo}
              />
              {(verificationResult || verificationError) && (
                <UserDetailsCard 
                  result={verificationResult} 
                  error={verificationError} 
                  serviceName={serviceForVerification?.name}
                  inputData={inputData}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {categoryForPurchase && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
            <div className="relative z-10 w-full max-w-md bg-transparent rounded-xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
                <SubscriptionPurchaseCard
                    categoryData={categoryForPurchase}
                    userInfo={userInfo}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
      )}
    </div>
  );
}