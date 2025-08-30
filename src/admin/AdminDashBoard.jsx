"use client"

import { useState, useEffect } from "react";
import { useGetAllUsersQuery } from "@/app/api/authApiSlice"; 
import { useGetAllTransactionsQuery } from "@/app/api/transactionApiSlice"; 
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" 
import { Terminal } from "lucide-react"

// Import Admin Components
import AdminDashboardSidebar from "./AdminComponents/Sidebar";
import Header from "./AdminComponents/Header";
import Services from "./AdminComponents/Services";
import RecentlyPurchased from "./AdminComponents/RecentlyPurchased";
import CouponsOffers from "./AdminComponents/CouponOffer";
import Analytics from "./AdminComponents/Analytics";
import DashboardOverview from "./AdminComponents/DashBoardOverview";
import RegisterAdmin from "./AdminComponents/RegisterAdmin";
import Feedback from "./AdminComponents/Feedback"
import UsersDisplay from "./AdminComponents/AllUser";
// import FirebaseUserActivityDashboard from "./AdminComponents/DashBoardCharts";
import Profile from "./AdminComponents/Profile";
import BlogManagement from "./AdminComponents/BlogMetaDataForm";


const DashboardHome = ({ users, transactions, isLoading, apiErrors }) => (
  <div className="space-y-6 bg-white">
    {/* Show API error warnings but don't block the dashboard */}
    {apiErrors.length > 0 && (
      <Alert variant="destructive" className="mb-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Some Data May Be Unavailable</AlertTitle>
        <AlertDescription>
          {apiErrors.join(", ")} - Some features may not work properly.
        </AlertDescription>
      </Alert>
    )}
    <DashboardOverview users={users} transactions={transactions} isLoading={isLoading} />
    {/* <FirebaseUserActivityDashboard /> */}
  </div>
);

const renderContent = (activeView, users, services, transactions, isLoading, apiErrors) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} apiErrors={apiErrors} />
    case "analytics":
      return <Analytics users={users} services={services} isLoading={isLoading} />;
    case "shared":
      return <UsersDisplay/>
    case "orders":
      return <RecentlyPurchased />;
    case "coupons":
      return <CouponsOffers />;
    case "services":
      return <Services />;
    case "register":
      return <RegisterAdmin/>
    case "feedback":
      return <Feedback/>
    case "profile": 
      return <Profile/>;
    case "blog":
      return <BlogManagement/>
    default:
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} apiErrors={apiErrors} />
  }
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [retryCount, setRetryCount] = useState(0);
  const [shouldRetry, setShouldRetry] = useState(true);

  // API queries with retry logic
  const { 
    data: transactionsResponse, 
    isLoading: isLoadingTransactions, 
    isError: isErrorTransactions, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetAllTransactionsQuery(undefined, {
    skip: !shouldRetry && retryCount >= 5
  });

  const { 
    data: usersResponse, 
    isLoading: isLoadingUsers, 
    isError: isErrorUsers, 
    error: usersError,
    refetch: refetchUsers 
  } = useGetAllUsersQuery(undefined, {
    skip: !shouldRetry && retryCount >= 5
  });

  const { 
    data: servicesResponse, 
    isLoading: isLoadingServices, 
    isError: isErrorServices, 
    error: servicesError,
    refetch: refetchServices 
  } = useGetServicesQuery(undefined, {
    skip: !shouldRetry && retryCount >= 5
  });

  // Handle retry logic
  useEffect(() => {
    const hasErrors = isErrorTransactions || isErrorUsers || isErrorServices;
    
    if (hasErrors && retryCount < 5 && shouldRetry) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        
        // Refetch failed queries
        if (isErrorTransactions) refetchTransactions();
        if (isErrorUsers) refetchUsers();
        if (isErrorServices) refetchServices();
      }, 2000); // Wait 2 seconds before retry

      return () => clearTimeout(timer);
    } else if (hasErrors && retryCount >= 5) {
      setShouldRetry(false);
    }
  }, [isErrorTransactions, isErrorUsers, isErrorServices, retryCount, shouldRetry, refetchTransactions, refetchUsers, refetchServices]);

  const isLoading = isLoadingTransactions || isLoadingUsers || isLoadingServices;
  const hasErrors = isErrorTransactions || isErrorUsers || isErrorServices;

  // Only show blank error page after 5 failed attempts
  if (hasErrors && retryCount >= 5) {
    const errorMessages = [
      transactionsError && "Failed to load transactions",
      usersError && "Failed to load users", 
      servicesError && "Failed to load services"
    ].filter(Boolean);

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Platform Data</AlertTitle>
          <AlertDescription>
            Could not load admin dashboard after 5 attempts. 
            <br />
            Errors: {errorMessages.join(", ")}
            <br />
            <button 
              onClick={() => {
                setRetryCount(0);
                setShouldRetry(true);
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Extract data with fallbacks
  const allTransactions = transactionsResponse?.data || [];
  const allUsers = usersResponse?.data || [];
  const allServices = servicesResponse?.data || [];

  // Collect API errors for display
  const apiErrors = [
    isErrorTransactions && "Transactions unavailable",
    isErrorUsers && "Users data unavailable",
    isErrorServices && "Services unavailable"
  ].filter(Boolean);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Show retry indicator */}
      {/* {hasErrors && retryCount > 0 && retryCount < 5 && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          Retrying API requests... Attempt {retryCount}/5
        </div>
      )} */}

      <AdminDashboardSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Pass the handleNavigate function to the Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} onNavigate={handleNavigate} />

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden ${hasErrors && retryCount > 0 && retryCount < 5 ? 'mt-20' : 'mt-16'}`}>
          <div
            key={activeView}
            className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
          >
            {renderContent(activeView, allUsers, allServices, allTransactions, isLoading, apiErrors)}
          </div>
        </main>
      </div>
    </div>
  );
}