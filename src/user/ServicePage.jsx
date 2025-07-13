import { useParams } from "react-router-dom";
import { UserInfoCard } from "@/cards/UserInfoCard";
import { UserDetailsCard } from "@/cards/UserDetailsCard";
import ServicesList from "./userComponents/ServicesList";
import { useState } from "react";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader"; // Use the shared header

export default function ServicePage() {
  const { serviceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // This page doesn't need to manage `activeView` because its content is fixed.
  // The sidebar's navigation logic will handle moving away from this page.

  console.log("Currently viewing service:", serviceId);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* ServicePage includes its own sidebar instance */}
      <SidebarComponent
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={null} // Not on the main dashboard, so no view is active
        onNavigate={() => {}} // The sidebar's internal navigate logic handles leaving the page
      />

      <div className="flex flex-col flex-1">
        {/* It also has its own header to toggle its sidebar */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* The main content for the service detail page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500">
            <h1 className="text-2xl font-bold mb-6">Service Details: {serviceId}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ServicesList />
              </div>
              <div className="lg:col-span-1">
                <UserDetailsCard />
              </div>
              <div className="lg:col-span-1">
                <UserInfoCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}