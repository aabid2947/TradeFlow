"use client"

import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// renderContent function remains unchanged
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
  const navigate = useNavigate();
  const userInfo = useSelector(selectCurrentUser);
  // console.log(userInfo)
  
  // Fetch all data required for the dashboard and its children
  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useGetServicesQuery();
  const { data: pricingPlansResponse, isLoading: isLoadingPricing, isError: isErrorPricing, error: pricingError } = useGetPricingPlansQuery();
  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetMyTransactionsQuery();

  const services = servicesResponse?.data || [];
  const pricingPlans = pricingPlansResponse || [];
  const transactions = transactionsResponse?.data || [];
  
  const isLoading = isLoadingServices || isLoadingPricing || isLoadingTransactions;

  useEffect(() => {
    // This effect handles state passed on navigation (e.g., from ServicePage)
    if (location.state) {
      if (location.state.view) {
        setActiveView(location.state.view);
      }
      if (location.state.category) {
        setCategoryFilter(location.state.category);
      }
      // Clear location state after applying it
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredServices = useMemo(() => {
    if (categoryFilter === "All Services") {
      return services;
    }
    return services.filter(service => service.category === categoryFilter);
  }, [services, categoryFilter]);

  const handleNavigate = (view) => {
    setActiveView(view);
    // When navigating to a main view, reset the category filter
    setCategoryFilter("All Services");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // CORRECTED: This now only updates the state to show ServiceCardsViewer
  const handleCategorySelect = (category) => {
    setActiveView("services");
    setCategoryFilter(category);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };
  
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
        activeView={activeView}
        onNavigate={handleNavigate}
        activeCategory={categoryFilter}
        onCategorySelect={handleCategorySelect}
      />

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16">
            <div
              key={activeView + categoryFilter}
              className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
            >
              {renderContent(activeView, filteredServices, pricingPlans, isLoading, userInfo, transactions)}
            </div>
        </main>
      </div>
    </div>
  );
}