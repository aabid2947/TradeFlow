"use client"

import { useState } from "react";
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
import Profile from "./AdminComponents/Profile"; // <-- IMPORT THE NEW PROFILE COMPONENT
import BlogManagement from "./AdminComponents/BlogMetaDataForm";

const DashboardHome = ({ users, transactions, isLoading }) => (
  <div className="space-y-6 bg-white">
    <DashboardOverview users={users} transactions={transactions} isLoading={isLoading} />
    {/* <FirebaseUserActivityDashboard /> */}
  </div>
);

const renderContent = (activeView, users, services, transactions, isLoading) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} />
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
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} />
  }
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetAllTransactionsQuery();
  const { data: usersResponse, isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = useGetAllUsersQuery();
  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useGetServicesQuery();

  const isLoading = isLoadingTransactions || isLoadingUsers || isLoadingServices;
  const isError = isErrorTransactions || isErrorUsers || isErrorServices;
  const error = transactionsError || usersError || servicesError;

  const allTransactions = transactionsResponse?.data || [];
  const allUsers = usersResponse?.data || [];
  const allServices = servicesResponse?.data || [];

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Platform Data</AlertTitle>
            <AlertDescription>
                Could not load admin dashboard. {error?.data?.message || "Please try again later."}
            </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboardSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Pass the handleNavigate function to the Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} onNavigate={handleNavigate} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden mt-16">
          <div
            key={activeView}
            className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
          >
            {renderContent(activeView, allUsers, allServices, allTransactions, isLoading)}
          </div>
        </main>
      </div>
    </div>
  );
}