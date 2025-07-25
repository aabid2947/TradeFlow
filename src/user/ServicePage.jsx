import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserInfoCard } from "./userComponents/UserInfoCard";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useVerifyServiceMutation } from "@/app/api/verificationApiSlice";
// Import the new payment hooks
import { useCreatePaymentOrderMutation, useVerifyPaymentMutation } from "@/app/api/paymentApiSlice"; 

// A simple X icon for the close button
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

// Helper function to dynamically load an external script
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

  // --- Redux Hooks ---
  const { userInfo } = useSelector((state) => state.auth);
  const { data: apiResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const services = apiResponse?.data || [];
  
  // --- API Mutation Hooks ---
  const [verifyFreeService, { isLoading: isVerifyingFree }] = useVerifyServiceMutation();
  const [createPaymentOrder, { isLoading: isCreatingOrder }] = useCreatePaymentOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation();

  const isVerifying = isVerifyingFree || isCreatingOrder || isVerifyingPayment;
  const activeService = services.find(s => s.service_key === activeServiceId);
  
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && services.length > 0 && !activeServiceId) {
      setActiveServiceId(services[0].service_key);
    }
  }, [services, activeServiceId]);

  useEffect(() => {
    setVerificationResult(null);
    setVerificationError(null);
  }, [activeServiceId]);

  const handleServiceSelect = (serviceKey) => {
    setActiveServiceId(serviceKey);
  };
  
  const handleCloseModal = () => {
    setActiveServiceId(null);
  };

  /**
   * @desc This function initiates the entire verification flow,
   * handling both free and paid services.
   */
  const handleInitiateVerification = async (payload) => {
    if (!activeService) return;

    setVerificationResult(null);
    setVerificationError(null);

    // Flow for FREE services
    if (!activeService.price || activeService.price <= 0) {
      try {
        const response = await verifyFreeService({
          serviceKey: activeServiceId,
          payload,
        }).unwrap();
        setVerificationResult(response);
      } catch (err) {
        setVerificationError(err.data || { message: "An unexpected error occurred." });
      }
    } else {
      // Flow for PAID services
      try {
        // 1. Create order on our backend
        const orderData = await createPaymentOrder({ serviceId: activeService._id }).unwrap();
        const { order, key_id, transactionId } = orderData;
        
        // 2. Load Razorpay script
        const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load. Are you online?");

        // 3. Configure and open Razorpay checkout
        const options = {
          key: key_id,
          amount: order.amount,
          currency: order.currency,
          name: "VerifyNow",
          description: `Payment for ${activeService.name}`,
          order_id: order.id,
          handler: async function (response) {
            // 4. On success, send payment details and payload to our backend for verification
            const formData = new FormData();
            formData.append("razorpay_payment_id", response.razorpay_payment_id);
            formData.append("razorpay_order_id", response.razorpay_order_id);
            formData.append("razorpay_signature", response.razorpay_signature);
            formData.append("transactionId", transactionId);
            formData.append("serviceKey", activeService.service_key);

            // Correctly append the original payload (JSON or FormData)
            if (payload instanceof FormData) {
              for (const [key, value] of payload.entries()) {
                  formData.append(key, value);
              }
            } else {
              formData.append("payload", JSON.stringify(payload));
            }
            
            try {
              const verificationResponse = await verifyPayment(formData).unwrap();
              setVerificationResult(verificationResponse);
            } catch (err) {
               setVerificationError(err.data || { message: "Payment verification failed." });
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
          },
          theme: { color: "#10b981" },
        };
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        
      } catch (err) {
        setVerificationError(err.data || { message: "Could not initiate payment." });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-16">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <h1 className="text-2xl font-bold mb-6">Verification Services</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ServicesList services={services} isLoading={isLoadingServices} activeServiceId={activeServiceId} onServiceSelect={handleServiceSelect} />
              </div>
              <div className="hidden lg:grid lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <UserInfoCard services={services} activeServiceId={activeServiceId} onVerify={handleInitiateVerification} isVerifying={isVerifying} />
                </div>
                <div className="md:col-span-1">
                  {(verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} serviceName={activeService?.name} />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE MODAL VIEW */}
      {activeServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true"></div>
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="overflow-y-auto p-6 space-y-6">
              <UserInfoCard services={services} activeServiceId={activeServiceId} onVerify={handleInitiateVerification} isVerifying={isVerifying} />
              {(verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} serviceName={activeService?.name} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
