import { useParams } from "react-router-dom";
import { UserInfoCard } from "./userComponents/UserInfoCard";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import { useState, useEffect } from "react";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice"; // Ensure this path is correct

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);

  // 1. Fetch data in the parent component
  const { data: apiResponse, isLoading } = useGetServicesQuery();
  const services = apiResponse?.data || [];

  // 2. Set the first service as active by default
  useEffect(() => {
    if (services.length > 0 && !activeServiceId) {
      setActiveServiceId(services[0].service_key);
    }
  }, [services, activeServiceId]);

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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <h1 className="text-2xl font-bold mb-6">Verification Services</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {/* 3. Pass state and handler to children */}
                <ServicesList
                  services={services}
                  isLoading={isLoading}
                  activeServiceId={activeServiceId}
                  onServiceSelect={setActiveServiceId}
                />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <UserInfoCard activeServiceId={activeServiceId} services={services} />
                </div>
                <div className="md:col-span-1">
                  <UserDetailsCard />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}