import { useState, useEffect } from "react";
import { UserInfoCard } from "./userComponents/UserInfoCard";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useVerifyServiceMutation } from "@/app/api/verificationApiSlice";

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

  // 1. Fetch data in the parent component
  const { data: apiResponse, isLoading: isLoadingServices } = useGetServicesQuery();
  const services = apiResponse?.data || [];
  
  // 2. Set the first service as active by default
  useEffect(() => {
    if (services.length > 0 && !activeServiceId) {
      setActiveServiceId(services[0].service_key);
    }
  }, [services, activeServiceId]);

  // Verification mutation hook
  const [verifyService, { isLoading: isVerifying }] = useVerifyServiceMutation();

  // Reset verification result when active service changes
  useEffect(() => {
    setVerificationResult(null);
    setVerificationError(null);
  }, [activeServiceId]);

  const handleServiceSelect = (serviceKey) => {
    setActiveServiceId(serviceKey);
  };

  const handleVerify = async (payload) => {
    if (!activeServiceId) return;

    setVerificationResult(null); // Reset previous results
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
                {/* 3. Pass state and handler to children */}
                <ServicesList
                  services={services}
                  isLoading={isLoadingServices}
                  activeServiceId={activeServiceId}
                  onServiceSelect={handleServiceSelect}
                />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <UserInfoCard
                    services={services}
                    activeServiceId={activeServiceId}
                    onVerify={handleVerify}
                    isVerifying={isVerifying}
                  />
                </div>
                <div className="md:col-span-1">
                  { (verificationResult || verificationError) && <UserDetailsCard result={verificationResult} error={verificationError} />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}