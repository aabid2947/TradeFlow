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
import { ArrowLeft, X, Clock, CheckCircle } from "lucide-react";

import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { selectCurrentUser } from "@/features/auth/authSlice";

import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice"; 
import { useGetPricingPlansQuery } from "@/app/api/pricingApiSlice";

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [showSubscriptionCard, setShowSubscriptionCard] = useState(false);
  
  const navigate = useNavigate();
  const { category: encodedSubcategory } = useParams();
  const subcategory = decodeURIComponent(encodedSubcategory || '');

  const { refetch: refetchUserProfile } = useGetProfileQuery();
  const userInfo = useSelector(selectCurrentUser);
  const { data: servicesResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: pricingPlansResponse, isLoading: isLoadingPricing } = useGetPricingPlansQuery();

  const allServices = servicesResponse?.data || [];
  const allPricingPlans = pricingPlansResponse || [];

  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  const filteredServices = useMemo(() => {
    if (!subcategory) return [];
    return allServices.filter(service => service.subcategory === subcategory);
  }, [allServices, subcategory]);

  const parentCategory = useMemo(() => {
    if (filteredServices.length > 0) {
      return filteredServices[0].category;
    }
    return null;
  }, [filteredServices]);

  // Enhanced subscription logic with usage tracking
  const subscriptionInfo = useMemo(() => {
    if (!userInfo?.activeSubscriptions) {
      return { isSubscribed: false, usageRemaining: 0, totalUsage: 0, usageLimit: 0 };
    }
    
    // Find active subscription for current subcategory or parent category
    const activeSubscription = userInfo.activeSubscriptions.find(sub => {
      const isActive = new Date(sub.expiresAt) > new Date();
      const matchesSubcategory = sub.category === subcategory;
      const matchesParentCategory = parentCategory && sub.category === `${parentCategory} Plan`;
      
      return isActive && (matchesSubcategory || matchesParentCategory);
    });

    if (activeSubscription) {
      const usageRemaining = Math.max(0, activeSubscription.usageLimit - activeSubscription.usageCount);
      return {
        isSubscribed: true,
        usageRemaining,
        totalUsage: activeSubscription.usageCount,
        usageLimit: activeSubscription.usageLimit,
        expiresAt: activeSubscription.expiresAt,
        subscription: activeSubscription
      };
    }

    return { isSubscribed: false, usageRemaining: 0, totalUsage: 0, usageLimit: 0 };
  }, [userInfo, parentCategory, subcategory]);

  const { isSubscribed, usageRemaining, totalUsage, usageLimit, expiresAt } = subscriptionInfo;
  
  const planToPurchase = useMemo(() => {
    if (isSubscribed || !subcategory) return null;
    
    return {
      name: subcategory,
      monthly: {
        price: 299,
      },
    };
  }, [isSubscribed, subcategory]);

  const activeService = useMemo(() => allServices.find(s => s.service_key === activeServiceId), [allServices, activeServiceId]);

  // Usage status component
  const UsageStatusBadge = () => {
    if (!isSubscribed) return null;

    const usagePercentage = (totalUsage / usageLimit) * 100;
    const isLowUsage = usageRemaining <= Math.ceil(usageLimit * 0.2); // Warning when 20% or less remaining
    const isNoUsage = usageRemaining === 0;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
        isNoUsage 
          ? 'bg-red-100 text-red-800 border border-red-200' 
          : isLowUsage 
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
      }`}>
        {isNoUsage ? (
          <X className="w-4 h-4" />
        ) : isLowUsage ? (
          <Clock className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        <span>
          {usageRemaining} of {usageLimit} uses remaining
        </span>
      </div>
    );
  };

  // Expiry date formatter
  const formatExpiryDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])
  
  useEffect(() => {
    if (filteredServices.length > 0) {
      setActiveServiceId(filteredServices[0].service_key);
    }
  }, [filteredServices]);

  useEffect(() => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);
  }, [activeServiceId]);

  const handleGoBack = () => {
    navigate('/user', { 
      state: { 
        view: 'services', 
        category: parentCategory || 'All Services' 
      },
      replace: true 
    });
  };

  const handleSidebarNavigate = (view) => {
    navigate('/user', { state: { view } });
  };
  
  const handleCategorySelect = (newCategory) => {
    navigate('/user', {
        state: {
            view: 'services',
            category: newCategory
        }
    });
  };
  
  const handleServiceSelect = (serviceKey) => {
    setActiveServiceId(serviceKey);
    setShowSubscriptionCard(false);
  };
  
  const handleCloseModal = () => setActiveServiceId(null);

  const handleExecuteVerification = async (payload) => {
      if (!activeService) return;
      
      // Check if user has remaining usage
      if (isSubscribed && usageRemaining <= 0) {
        toast.error("You have no remaining usage for this service. Please upgrade your plan.");
        return;
      }
      
      setInputData(payload);
      setVerificationResult(null);
      setVerificationError(null);
      try {
        const result = await executeService({ serviceKey: activeService.service_key, payload }).unwrap();
        setVerificationResult(result);
        toast.success(result.message || "Verification successful!");
        await refetchUserProfile(); // This will update the usage count
      } catch (err) {
        setVerificationError(err.data || { message: "Service execution failed." });
        toast.error(err.data?.message || "Could not execute service.");
      }
  };
  
  const handleSubscribeClick = () => {
      if (!planToPurchase) {
          toast.error("This plan is not available for purchase or you are already subscribed.");
          return;
      }
      setShowSubscriptionCard(true);
  };

  const renderRightPanel = () => {
    if (showSubscriptionCard && planToPurchase) {
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
            isSubscribed={isSubscribed} 
            onSubscribeClick={handleSubscribeClick}
            usageRemaining={usageRemaining} // Pass usage info to UserInfoCard
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
      <SidebarComponent 
        isOpen={sidebarOpen}
        activeView="services"
        onNavigate={handleSidebarNavigate}
        activeCategory={parentCategory}
        onCategorySelect={handleCategorySelect}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-xl md:text-2xl font-bold">
                  {subcategory}
                </h1>
              </div>
              
              {/* Usage Status Display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <UsageStatusBadge />
                {isSubscribed && expiresAt && (
                  <div className="text-sm text-gray-600">
                    Expires: {formatExpiryDate(expiresAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Low usage warning */}
            {isSubscribed && usageRemaining <= Math.ceil(usageLimit * 0.2) && usageRemaining > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">
                    Low Usage Alert: You have only {usageRemaining} verification{usageRemaining !== 1 ? 's' : ''} remaining.
                  </p>
                </div>
              </div>
            )}

            {/* No usage remaining warning */}
            {isSubscribed && usageRemaining === 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">
                      No Usage Remaining: You've used all {usageLimit} verifications for this plan.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSubscribeClick}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ServicesList 
                  services={filteredServices} 
                  isLoading={isLoadingServices || isLoadingPricing} 
                  activeServiceId={activeServiceId} 
                  onServiceSelect={handleServiceSelect} 
                />
              </div>
              <div className="hidden lg:grid lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                {renderRightPanel()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Modal */}
      {activeServiceId && !sidebarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800">
              <XIcon className="h-5 w-5" />
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Usage status in mobile modal */}
              {isSubscribed && (
                <div className="flex justify-center">
                  <UsageStatusBadge />
                </div>
              )}
              
              { showSubscriptionCard && planToPurchase ? (
                <SubscriptionPurchaseCard planData={planToPurchase} userInfo={userInfo} onClose={() => setShowSubscriptionCard(false)} />
              ) : (
                <>
                  <UserInfoCard 
                    services={filteredServices} 
                    activeServiceId={activeServiceId} 
                    onVerify={handleExecuteVerification} 
                    isVerifying={isVerifying} 
                    isSubscribed={isSubscribed} 
                    onSubscribeClick={handleSubscribeClick}
                    usageRemaining={usageRemaining}
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