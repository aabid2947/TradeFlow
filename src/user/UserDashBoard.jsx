"use client"

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import DashboardAnalytics from "./userComponents/DashboardAnalytics";
import ServiceCardsViewer from "./userComponents/ServiceCardsViewer";
import Profile from "./userComponents/Profile";
import PurchaseHistory from "./userComponents/PurchaseHistory";

// 1. IMPORT THE HOOKS FOR FETCHING SERVICES AND TRANSACTIONS
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useGetMyTransactionsQuery } from "@/app/api/transactionApiSlice";
import ReviewDashboard from "./userComponents/ReviewSection";

// This function determines which main component to render.
// It now accepts transaction data to pass to the dashboard.
const renderContent = (activeView, services, isLoadingServices, transactions, isLoadingTransactions) => {
  switch (activeView) {
    case "dashboard":
      // Pass transaction data and loading state to the analytics component
      return <DashboardAnalytics transactions={transactions} isLoading={isLoadingTransactions} />;
    case "services":
      return <ServiceCardsViewer services={services} isLoading={isLoadingServices} />;
    case "history":
      return <PurchaseHistory/>
    case "review":
      return <ReviewDashboard/>
    default:
      return <DashboardAnalytics transactions={transactions} isLoading={isLoadingTransactions} />;
  }
};

export default function UserDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [categoryFilter, setCategoryFilter] = useState("All Services");
  const location = useLocation();

  // --- API CALLS ---
  // Fetch services for the services viewer
  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useGetServicesQuery();
  const services = servicesResponse?.data || [];
  
  // 2. FETCH THE USER'S TRANSACTION HISTORY
  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetMyTransactionsQuery();
  const transactions = transactionsResponse?.data || [];
  // --- END OF API CALLS ---

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(services.map(s => s.category).filter(Boolean));
    return ["All Services", ...Array.from(categories)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (categoryFilter === "All Services") {
      return services;
    }
    return services.filter(service => service.category === categoryFilter);
  }, [services, categoryFilter]);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleCategorySelect = (category) => {
    setActiveView("services");
    setCategoryFilter(category);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  
   // Handle errors from either API call
   if (isErrorServices || isErrorTransactions) {
    const error = servicesError || transactionsError;
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="text-center text-red-700">
          <h2 className="text-xl font-bold">Failed to load resources</h2>
          <p>{error?.data?.message || "Please try again later."}</p>
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

      <div className="flex flex-col flex-1">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 md:ml-16">
          <main className="flex-1 overflow-hidden">
            <div
              key={activeView + categoryFilter}
              className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
            >
              {/* 3. PASS ALL NECESSARY DATA TO THE RENDER FUNCTION */}
              {renderContent(activeView, filteredServices, isLoadingServices, transactions, isLoadingTransactions)}
            </div>
          </main>
          <aside className="hidden lg:block w-full lg:w-64 lg:max-w-xs flex-shrink-0">
            <Profile />
          </aside>
        </div>
      </div>
    </div>
  );
}