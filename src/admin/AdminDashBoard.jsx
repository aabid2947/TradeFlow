"use client"

import { useState } from "react";
// NOTE: Assuming these component paths are correct from your project structure.
import AdminDashboardSidebar from "./AdminComponents/Sidebar";
import DashboardOverview from "./AdminComponents/DashBoardOverview";
import DashboardCharts from "./AdminComponents/DashBoardCharts";
import RecentlyPurchased from "./AdminComponents/RecentlyPurchased";
import CouponsOffers from "./AdminComponents/CouponOffer";
import Header from "./AdminComponents/Header";

// A wrapper component for the main dashboard view for better organization.
const DashboardHome = () => (
  <div className="space-y-6">
    <DashboardOverview />
    <DashboardCharts />
  </div>
);

// This function determines which component to render based on the state.
const renderContent = (activeView) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardHome />;
    case "clients":
      return <RecentlyPurchased />;
    case "coupons":
      return <CouponsOffers />;
    case "services":
      return (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="mt-2 text-gray-600">This page is currently under construction.</p>
        </div>
      );
    default:
      return <DashboardHome />;
  }
};

export default function AdminDashboard() {
  // State to manage the visibility of the sidebar on mobile.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State to track the currently active view/page.
  const [activeView, setActiveView] = useState("dashboard");

  /**
   * Handles navigation between different views.
   * On mobile screens, it also closes the sidebar for a better user experience.
   * @param {string} view - The key of the view to navigate to.
   */
  const handleNavigate = (view) => {
    setActiveView(view);
    // Check if the screen width is mobile-sized.
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    // Main container for the entire dashboard.
    <div className="min-h-screen ">
      <AdminDashboardSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      {/* Main content area.
        Key change: `lg:pl-64` adds left padding on large screens (desktops)
        to make space for the fixed sidebar. On smaller screens, this padding is not applied,
        allowing the content to take up the full width.
      */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* The header component contains the hamburger menu icon for mobile 
          and other header elements like user profile.
        */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* The main content is rendered here. Added `overflow-hidden` to contain the slide animation. */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/*
            This wrapper div enables the animation.
            - The `key={activeView}` prop is crucial. When the view changes, React sees a new key 
              and re-mounts the component, which re-triggers the animation.
            - The `className` props are from `tailwindcss-animate` to create the slide effect.
          */}
          <div
            key={activeView}
            className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
          >
            {renderContent(activeView)}
          </div>
        </main>
      </div>
    </div>
  );
}