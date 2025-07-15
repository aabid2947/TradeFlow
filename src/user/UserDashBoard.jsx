"use client"

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import DashboardAnalytics from "./userComponents/DashboardAnalytics";
import ServiceCardsViewer from "./userComponents/ServiceCardsViewer";
import Profile from "./userComponents/Profile";

// This function determines which main component to render.
const renderContent = (activeView) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardAnalytics />;
    case "services":
      return <ServiceCardsViewer />;
    default:
      return <DashboardAnalytics />;
  }
};

export default function UserDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const location = useLocation(); // Hook to get location state

  // This effect checks if we navigated here with a specific view in mind
  // (e.g., from the ServicePage) and sets the state accordingly.
  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      {/* Main content area is now a flex container */}
      <div className="flex flex-col flex-1">
        {/* The header controls the sidebar on ALL screen sizes now */}

        {/* This div establishes the two-column layout on larger screens */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 md:ml-16">
          {/* Main Content (Left Column) */}
          <main className="flex-1 overflow-hidden">
            <div
              key={activeView}
              className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
            >
              {renderContent(activeView)}
            </div>
          </main>

          {/* Profile Sidebar (Right Column) */}
          <aside className="hidden lg:block w-full lg:w-64 lg:max-w-xs flex-shrink-0">
            <Profile />
          </aside>
        </div>
      </div>
    </div>
  );
}