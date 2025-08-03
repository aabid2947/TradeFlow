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
// Import the new hook to get all pricing plans
import { useGetPricingPlansQuery } from "@/app/api/pricingApiSlice";

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [showSubscriptionCard, setShowSubscriptionCard] = useState(false);
  
  const navigate = useNavigate();
  const { category: encodedCategory } = useParams();
  const category = decodeURIComponent(encodedCategory || '');

  // Fetch all necessary data
  const { refetch: refetchUserProfile } = useGetProfileQuery();
  const userInfo = useSelector(selectCurrentUser);
  const { data: servicesResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: pricingPlansResponse, isLoading: isLoadingPricing } = useGetPricingPlansQuery();

  const allServices = servicesResponse?.data || [];
  const allPricingPlans = pricingPlansResponse || [];

  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  const filteredServices = useMemo(() => {
    if (!category) return [];
    return allServices.filter(service => service.category === category);
  }, [allServices, category]);

  const isSubscribedToCategory = useMemo(() => {
    if (!userInfo?.activeSubscriptions || !allPricingPlans.length) {
      return false;
    }
    
    // Get all service IDs the user has access to from all their active plans
    const accessibleServiceIds = new Set();
    const userActivePlanNames = new Set(
      userInfo.activeSubscriptions
        .filter(sub => new Date(sub.expiresAt) > new Date())
        .map(sub => sub.category)
    );

    allPricingPlans.forEach(plan => {
      if (userActivePlanNames.has(plan.name)) {
        plan.includedServices.forEach(service => accessibleServiceIds.add(service._id));
      }
    });

    // Check if any service in the current category is in the user's accessible list
    return filteredServices.some(service => accessibleServiceIds.has(service._id));

  }, [userInfo, allPricingPlans, filteredServices]);

  // Find the correct individual plan to purchase for this category
  const planToPurchase = useMemo(() => {
    if (isSubscribedToCategory || !category) return null;
    return allPricingPlans.find(p => p.name === `${category} Plan`);
  }, [allPricingPlans, category, isSubscribedToCategory]);

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
    setShowSubscriptionCard(false);
  };
  
  const handleCloseModal = () => setActiveServiceId(null);

  const handleExecuteVerification = async (payload) => {
      if (!activeService) return;
      setInputData(payload);
      setVerificationResult(null);
      setVerificationError(null);
      try {
        const result = await executeService({ serviceKey: activeService.service_key, payload }).unwrap();
        setVerificationResult(result);
        toast.success(result.message || "Verification successful!");
        await refetchUserProfile();
      } catch (err) {
        setVerificationError(err.data || { message: "Service execution failed." });
        toast.error(err.data?.message || "Could not execute service.");
      }
  };
  
  const handleSubscribeClick = () => {
      if (!planToPurchase) {
          toast.error("No individual purchase plan is available for this category.");
          return;
      }
      setShowSubscriptionCard(true);
  };

  const renderRightPanel = () => {
    if (!isSubscribedToCategory && showSubscriptionCard && planToPurchase) {
      return (
        <div className="md:col-span-2">
          <SubscriptionPurchaseCard
            planData={planToPurchase}
            userInfo={userInfo}
            onClose={() => setShowSubscriptionCard(false)}
          />
        </div>
      );
    }

    return (
      <>
        <div className="md:col-span-1">
          <UserInfoCard
            services={filteredServices}
            activeServiceId={activeServiceId}
            onVerify={handleExecuteVerification}
            isVerifying={isVerifying}
            isSubscribed={isSubscribedToCategory}
            onSubscribeClick={handleSubscribeClick}
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
                <ServicesList services={filteredServices} isLoading={isLoadingServices || isLoadingPricing} activeServiceId={activeServiceId} onServiceSelect={handleServiceSelect} />
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
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
                { !isSubscribedToCategory && showSubscriptionCard && planToPurchase ? (
                  <SubscriptionPurchaseCard 
                    planData={planToPurchase} 
                    userInfo={userInfo} 
                    onClose={() => setShowSubscriptionCard(false)} 
                  />
                ) : (
                  <>
                    <UserInfoCard 
                      services={filteredServices} 
                      activeServiceId={activeServiceId} 
                      onVerify={handleExecuteVerification} 
                      isVerifying={isVerifying} 
                      isSubscribed={isSubscribedToCategory}
                      onSubscribeClick={handleSubscribeClick}
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