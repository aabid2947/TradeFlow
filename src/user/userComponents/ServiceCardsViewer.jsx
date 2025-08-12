import { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import ServiceCard from "@/cards/ServiceCard";
import ServiceListCard from "./ServiceListCard"; // Import the new card
import { UserInfoCard } from "./UserInfoCard";
import { UserDetailsCard } from "./UserDetailsCard";
import SubscriptionPurchaseCard from "./SubscriptionPurchaseCard";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { X, RefreshCw, LayoutGrid, List } from 'lucide-react'; // Import icons
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ServiceCardsViewer({ services = [], pricingPlans = [], isLoading, userInfo }) {
  const [activeService, setActiveService] = useState(null);
  const [purchasePlan, setPurchasePlan] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  const { refetch: refetchUserProfile } = useGetProfileQuery();
  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const accessibleServiceIds = useMemo(() => {
    if (!userInfo?.activeSubscriptions) return new Set();
    const serviceIdSet = new Set();
    const activeUserSubs = userInfo.activeSubscriptions.filter(
      sub => new Date(sub.expiresAt) > new Date()
    );
    const staticPlanMap = new Map(
      pricingPlans.map(p => [p.name, p.includedServices.map(s => s._id)])
    );
    activeUserSubs.forEach(sub => {
      const subName = sub.category;
      if (staticPlanMap.has(subName)) {
        const includedServiceIds = staticPlanMap.get(subName) || [];
        includedServiceIds.forEach(id => serviceIdSet.add(id));
      } else {
        services.forEach(service => {
          if (service.subcategory === subName) {
            serviceIdSet.add(service._id);
          }
        });
      }
    });
    return serviceIdSet;
  }, [userInfo, pricingPlans, services]);

  const handleActionButtonClick = (service) => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);
    const isSubscribed = accessibleServiceIds.has(service._id);

    if (isSubscribed) {
      if (service.subcategory) {
        navigate(`/user/service/${service.subcategory}`);
      } else {
        // Fallback for services without a subcategory, open the modal
        setActiveService(service);
        setPurchasePlan(null);
      }
    } else {
      if (service.subcategory) {
        const dynamicPlanForPurchase = { name: service.subcategory, monthly: { price: 299 } };
        setPurchasePlan(dynamicPlanForPurchase);
        setActiveService(null);
      } else {
        const staticPlanName = `${service.category} Plan`;
        toast.error(`This service can only be accessed by purchasing the "${staticPlanName}".`);
        setActiveService(null);
        setPurchasePlan(null);
      }
    }
  };

  const handleCloseModal = () => {
    setActiveService(null);
    setPurchasePlan(null);
  };

  const handleExecuteVerification = async (payload) => {
    if (!activeService) return;
    setInputData(payload);
    setVerificationResult(null);
    setVerificationError(null);
    try {
      const result = await executeService({
        serviceKey: activeService.service_key,
        payload
      }).unwrap();
      setVerificationResult(result);
      toast.success(result.message || "Verification successful!");
      await refetchUserProfile();
    } catch (err) {
      setVerificationError(err.data || { message: "Service execution failed." });
      toast.error(err.data?.message || "Could not execute service.");
    }
  };

  const handleNewVerification = () => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">KYC Verification Services</h1>
        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 h-8 transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 h-8 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Conditional Rendering of Views */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((svc) => {
            const isSubscribed = accessibleServiceIds.has(svc._id);
            return (
              <ServiceCard
                key={svc._id}
                service={svc}
                imageSrc={svc.imageUrl || "/placeholder.svg"}
                serviceName={svc.name}
                verificationCount={svc.globalUsageCount}
                price={svc.price}
                buttonType={isSubscribed ? "verify" : "purchase"}
                onButtonClick={() => handleActionButtonClick(svc)}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((svc) => {
            const isSubscribed = accessibleServiceIds.has(svc._id);
            return (
              <ServiceListCard
                key={svc._id}
                service={svc}
                buttonType={isSubscribed ? "verify" : "purchase"}
                onButtonClick={() => handleActionButtonClick(svc)}
              />
            );
          })}
        </div>
      )}

      {/* Verification & Purchase Modals (Unchanged) */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
            <button onClick={handleCloseModal} className="absolute top-0 right-0 z-20 p-2 rounded-full text-gray-500 bg-gray-100 transition-colors" aria-label="Close modal"><X size={20} /></button>
            <div className="p-6 space-y-4">
              {!(verificationResult || verificationError) ? (
                <UserInfoCard services={[activeService]} activeServiceId={activeService.service_key} onVerify={handleExecuteVerification} isVerifying={isVerifying} isSubscribed={true} />
              ) : (
                <>
                  <UserDetailsCard result={verificationResult} error={verificationError} serviceName={activeService?.name} inputData={inputData} />
                  <Button onClick={handleNewVerification} variant="outline" className="w-full"><RefreshCw className="w-4 h-4 mr-2" /> Perform New Verification</Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {purchasePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative z-10 w-full max-w-lg">
            <SubscriptionPurchaseCard planData={purchasePlan} userInfo={userInfo} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}