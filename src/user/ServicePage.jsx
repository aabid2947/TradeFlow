import { useState, useEffect } from "react";
import { UserInfoCard } from "./userComponents/UserInfoCard";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useVerifyServiceMutation } from "@/app/api/verificationApiSlice";
import { Button } from "@/components/ui/button";

// A simple X icon for the close button
const XIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);


export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

  const { data: apiResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const services = apiResponse?.data || [];
  
  // Set the first service as active by default ON DESKTOP ONLY
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && services.length > 0 && !activeServiceId) {
      setActiveServiceId(services[0].service_key);
    }
  }, [services, activeServiceId]);

  const [verifyService, { isLoading: isVerifying }] = useVerifyServiceMutation();

  // Reset verification result when active service changes
  useEffect(() => {
    setVerificationResult(null);
    setVerificationError(null);
  }, [activeServiceId]);

  const handleServiceSelect = (serviceKey) => {
    setActiveServiceId(serviceKey);
    // On mobile, selecting an item will now trigger the modal via activeServiceId
  };
  
  // Close the modal by resetting the active service, which also clears results
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

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={null}
        onNavigate={() => {}}
      />

      <div className="flex flex-col flex-1">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-16">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <h1 className="text-2xl font-bold mb-6">Verification Services</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {/* ServiceList is always visible */}
                <ServicesList
                  services={services}
                  isLoading={isLoadingServices}
                  activeServiceId={activeServiceId}
                  onServiceSelect={handleServiceSelect}
                />
              </div>
              {/* DESKTOP VIEW: Cards are in the grid, hidden on mobile */}
              <div className="hidden lg:grid lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <UserInfoCard
                    services={services}
                    activeServiceId={activeServiceId}
                    onVerify={handleVerify}
                    isVerifying={isVerifying}
                  />
                </div>
                <div className="md:col-span-1">
                  {(verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE MODAL VIEW: Appears only when a service is selected */}
      {activeServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden="true"
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
             <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="absolute top-2 right-2 z-20 rounded-full text-gray-500 hover:text-gray-800"
            >
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