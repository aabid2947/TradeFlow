"use client"

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SidebarComponent from "./userComponents/SidebarComponent";
import DashboardHeader from "./userComponents/DashboardHeader";
import DashboardAnalytics from "./userComponents/DashboardAnalytics";
import ServiceCardsViewer from "./userComponents/ServiceCardsViewer";
import Profile from "./userComponents/Profile"; // Profile component is now a main view
import PurchaseHistory from "./userComponents/PurchaseHistory";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useGetMyTransactionsQuery } from "@/app/api/transactionApiSlice";
import ReviewDashboard from "./userComponents/ReviewSection";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";

// Updated renderContent to include the 'profile' case
const renderContent = (activeView, services, isLoadingServices, transactions, isLoadingTransactions, userInfo) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardAnalytics transactions={transactions} isLoading={isLoadingTransactions} />;
    case "services":
      return <ServiceCardsViewer services={services} isLoading={isLoadingServices} userInfo={userInfo} />;
    case "history":
      return <PurchaseHistory/>
    // case "review":
    //   return <ReviewDashboard/>
    case "profile": // <-- ADD THIS CASE
      return <Profile />;
    default:
      return <DashboardAnalytics transactions={transactions} isLoading={isLoadingTransactions} />;
  }
};

export default function UserDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeView, setActiveView] = useState("dashboard");
  const [categoryFilter, setCategoryFilter] = useState("All Services");
  const location = useLocation();

  const userInfo = useSelector(selectCurrentUser);
  console.log("User Info in Dashboard:", userInfo);
  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useGetServicesQuery();
  const services = servicesResponse?.data || [];
  
  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetMyTransactionsQuery();
  const transactions = transactionsResponse?.data || [];

  // This useEffect now handles switching to the profile view
  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-60' : 'md:pl-20'}`}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-12">
            <div
              key={activeView + categoryFilter}
              className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
            >
              {renderContent(activeView, filteredServices, isLoadingServices, transactions, isLoadingTransactions, userInfo)}
            </div>
        </main>
      </div>
    </div>
  );
}