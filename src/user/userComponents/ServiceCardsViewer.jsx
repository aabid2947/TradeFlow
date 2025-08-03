import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import ServiceCard from "@/cards/ServiceCard";
import { UserInfoCard } from "./UserInfoCard";
import { UserDetailsCard } from "./UserDetailsCard";
import SubscriptionPurchaseCard from "./SubscriptionPurchaseCard";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { X, RefreshCw } from 'lucide-react'; // Import RefreshCw for the new button
import { Button } from "@/components/ui/button";

export default function ServiceCardsViewer({ services = [], pricingPlans = [], isLoading, userInfo }) {
  const [activeService, setActiveService] = useState(null);
  const [purchasePlan, setPurchasePlan] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [inputData, setInputData] = useState(null);

  const { refetch: refetchUserProfile } = useGetProfileQuery();
  const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

  const accessibleServiceIds = useMemo(() => {
    if (!userInfo?.activeSubscriptions || !pricingPlans.length) {
      return new Set();
    }
    const serviceIdSet = new Set();
    const userPlanNames = new Set(
      userInfo.activeSubscriptions
        .filter(sub => new Date(sub.expiresAt) > new Date())
        .map(sub => sub.category)
    );
    pricingPlans.forEach(plan => {
      if (userPlanNames.has(plan.name)) {
        plan.includedServices.forEach(service => serviceIdSet.add(service._id));
      }
    });
    return serviceIdSet;
  }, [userInfo, pricingPlans]);

  const handleActionButtonClick = (service) => {
    setVerificationResult(null);
    setVerificationError(null);
    setInputData(null);
    const isSubscribed = accessibleServiceIds.has(service._id);
    if (isSubscribed) {
      setActiveService(service);
      setPurchasePlan(null);
    } else {
      const planToPurchase = pricingPlans.find(p => p.name === `${service.category} Plan`);
      if (planToPurchase) {
        setPurchasePlan(planToPurchase);
      } else {
        toast.error(`No individual purchase plan found for the "${service.category}" category.`);
      }
      setActiveService(null);
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

  // --- NEW: Function to reset the modal view to the input card ---
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
      <h1 className="font-bold text-xl my-2">KYC Verification Services</h1>
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

      {/* Verification Modal with Updated Logic */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 z-20 p-2 rounded-full text-gray-500 bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="p-6 space-y-4">
              {/* --- CORE UI CHANGE: Conditional Rendering --- */}
              {!(verificationResult || verificationError) ? (
                // STATE 1: Show input form
                <UserInfoCard
                  services={[activeService]}
                  activeServiceId={activeService.service_key}
                  onVerify={handleExecuteVerification}
                  isVerifying={isVerifying}
                  isSubscribed={true}
                />
              ) : (
                // STATE 2: Show result and a "New Verification" button
                <>
                  <UserDetailsCard
                    result={verificationResult}
                    error={verificationError}
                    serviceName={activeService?.name}
                    inputData={inputData}
                  />
                  <Button
                    onClick={handleNewVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Perform New Verification
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Purchase Modal (No changes needed here) */}
      {purchasePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative z-10 w-full max-w-lg">
            <SubscriptionPurchaseCard
              planData={purchasePlan}
              userInfo={userInfo}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}