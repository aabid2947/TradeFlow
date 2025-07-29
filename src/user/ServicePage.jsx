import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { UserInfoCard } from "./userComponents/UserInfoCard"; 
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import SubscriptionPurchaseCard from "./userComponents/SubscriptionPurchaseCard";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice"; 

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [showSubscriptionCard, setShowSubscriptionCard] = useState(false); // 1. State to manage subscription card visibility
  
  const navigate = useNavigate();
  const { category: encodedCategory } = useParams();
  const category = decodeURIComponent(encodedCategory || '');

  const { data: profileData, refetch: refetchUserProfile } = useGetProfileQuery();

  const userInfo = useSelector(selectCurrentUser);
  const { data: apiResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const allServices = apiResponse?.data || [];

  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  const filteredServices = useMemo(() => {
    if (!category) return [];
    return allServices.filter(service => service.category === category);
  }, [allServices, category]);

  const isSubscribed = useMemo(() => {
    return profileData?.data?.promotedCategories?.includes(category) || userInfo?.promotedCategories?.includes(category);
  }, [userInfo, profileData, category]);

  const activeService = useMemo(() => {
    return allServices.find(s => s.service_key === activeServiceId);
  }, [allServices, activeServiceId]);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && filteredServices.length > 0 && !activeServiceId) {
      setActiveServiceId(filteredServices[0].service_key);
    }
  }, [filteredServices, activeServiceId]);

  useEffect(() => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);
  }, [activeServiceId]);

  const handleServiceSelect = (serviceKey) => {
    setActiveServiceId(serviceKey);
    setShowSubscriptionCard(false); // Reset when a new service is selected
  };
  
  const handleCloseModal = () => {
    setActiveServiceId(null);
  };

  const handleExecuteVerification = async (payload) => {
      if (!activeService) return;
      setInputData(payload);
      setVerificationResult(null);
      setVerificationError(null);
      try {
        const result = await executeService({
          serviceKey: activeService.service_key,
          payload,
        }).unwrap();
        setVerificationResult(result);
        toast.success(result.message || "Verification successful!");
      } catch (err) {
        setVerificationError(err.data || { message: "Service execution failed." });
        toast.error(err.data?.message || "Could not execute service.");
      }
  };

  const handlePurchaseSuccess = () => {
    refetchUserProfile();
    setShowSubscriptionCard(false); // Hide subscription card on success
  };

  const renderRightPanel = () => {
    // 2. Conditionally render SubscriptionPurchaseCard or UserInfoCard
    if (!isSubscribed && showSubscriptionCard && filteredServices.length > 0) {
      return (
        <div className="md:col-span-1">
          <SubscriptionPurchaseCard
            categoryData={filteredServices[0]}
            userInfo={userInfo}
            onClose={() => setShowSubscriptionCard(false)} // Go back to UserInfoCard
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        </div>
      );
    }

    // Always render UserInfoCard. It will adapt based on subscription status.
    return (
      <>
        <div className="md:col-span-1">
          <UserInfoCard
            services={filteredServices}
            activeServiceId={activeServiceId}
            onVerify={handleExecuteVerification}
            isVerifying={isVerifying}
            userInfo={userInfo}
            isSubscribed={isSubscribed}
            onSubscribeClick={() => setShowSubscriptionCard(true)} // 3. Show subscription card on click
          />
        </div>
        <div className="md:col-span-1">
          {(verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} serviceName={activeService?.name} inputData={inputData}/>}
        </div>
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-12">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <h1 className="text-2xl font-bold mb-6">
              {category ? `${category.replace(/_/g, " ")} Services` : 'Verification Services'}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ServicesList services={filteredServices} isLoading={isLoadingServices} activeServiceId={activeServiceId} onServiceSelect={handleServiceSelect} />
              </div>
              <div className="hidden lg:grid lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                {renderRightPanel()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {activeServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
                {/* 4. Logic for mobile modal view */}
                { !isSubscribed && showSubscriptionCard ? (
                  filteredServices.length > 0 && 
                  <SubscriptionPurchaseCard 
                    categoryData={filteredServices[0]} 
                    userInfo={userInfo} 
                    onClose={() => setShowSubscriptionCard(false)} 
                    onPurchaseSuccess={handlePurchaseSuccess} 
                  />
                ) : (
                  <>
                    <UserInfoCard 
                      services={filteredServices} 
                      activeServiceId={activeServiceId} 
                      onVerify={handleExecuteVerification} 
                      isVerifying={isVerifying} 
                      userInfo={userInfo}
                      isSubscribed={isSubscribed}
                      onSubscribeClick={() => setShowSubscriptionCard(true)}
                    />
                    {(verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} serviceName={activeService?.name} inputData={inputData} />}
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}