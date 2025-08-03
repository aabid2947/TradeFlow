"use client"

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import DashboardAnalytics from "./userComponents/DashboardAnalytics";
import ServiceCardsViewer from "./userComponents/ServiceCardsViewer";
import Profile from "./userComponents/Profile";
import PurchaseHistory from "./userComponents/PurchaseHistory";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import VerificationHistory from "./userComponents/VerificationHistory";

// Import all necessary API hooks
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useGetPricingPlansQuery } from "@/app/api/pricingApiSlice";
import { useGetMyTransactionsQuery } from "@/app/api/transactionApiSlice";

// Updated renderContent to pass down all necessary data
const renderContent = (activeView, services, pricingPlans, isLoading, userInfo, transactions) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardAnalytics transactions={transactions} isLoading={isLoading} />;
    case "services":
      // Pass the full services and pricingPlans list to the viewer
      return <ServiceCardsViewer services={services} pricingPlans={pricingPlans} isLoading={isLoading} userInfo={userInfo} />;
    case "history":
      return <PurchaseHistory />;
    case "profile":
      return <Profile />;
    case "verification_history": 
      return <VerificationHistory />; 
    default:
      return <DashboardAnalytics transactions={transactions} isLoading={isLoading} />;
  }
};

export default function UserDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeView, setActiveView] = useState("dashboard");
  const [categoryFilter, setCategoryFilter] = useState("All Services");
  const location = useLocation();

  const userInfo = useSelector(selectCurrentUser);

  // Fetch all data required for the dashboard and its children
  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useGetServicesQuery();
  const { data: pricingPlansResponse, isLoading: isLoadingPricing, isError: isErrorPricing, error: pricingError } = useGetPricingPlansQuery();
  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetMyTransactionsQuery();

  // Safely extract data arrays, defaulting to empty arrays
  const services = servicesResponse?.data || [];
  const pricingPlans = pricingPlansResponse || [];
  const transactions = transactionsResponse?.data || [];
  
  const isLoading = isLoadingServices || isLoadingPricing || isLoadingTransactions;

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(services.map(s => s.category).filter(Boolean));
    return ["All Services", ...Array.from(categories)];
  }, [services]);

  // Filter services based on the selected category for display
  const filteredServices = useMemo(() => {
    if (categoryFilter === "All Services") {
      return services;
    }
    return services.filter(service => service.category === categoryFilter);
  }, [services, categoryFilter]);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleCategorySelect = (category) => {
    setActiveView("services");
    setCategoryFilter(category);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };
  
  // Consolidated error handling for all data fetching
  if (isErrorServices || isErrorPricing || isErrorTransactions) {
    const error = servicesError || pricingError || transactionsError;
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="text-center text-red-700">
          <h2 className="text-xl font-bold">Failed to load dashboard resources</h2>
          <p>{error?.data?.message || "Please refresh the page or try again later."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
        categories={uniqueCategories}
        activeCategory={categoryFilter}
        onCategorySelect={handleCategorySelect}
      />

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-60' : 'md:pl-20'}`}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-12">
            <div
              key={activeView + categoryFilter}
              className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
            >
              {/* Pass the filtered services but the complete pricing plan list */}
              {renderContent(activeView, filteredServices, pricingPlans, isLoading, userInfo, transactions)}
            </div>
        </main>
      </div>
    </div>
  );
}