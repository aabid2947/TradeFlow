"use client"

import { useState } from "react";
import { useGetAllUsersQuery } from "@/app/api/authApiSlice"; 
import { useGetAllTransactionsQuery } from "@/app/api/transactionApiSlice"; 
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
import DashboardCharts from "./AdminComponents/DashBoardCharts"; 
import RegisterAdmin from "./AdminComponents/RegisterAdmin";
import Feedback from "./AdminComponents/Feedback"

/**
 * The DashboardHome component  receives users and transactions
 * to pass down to the overview component.
 */
const DashboardHome = ({ users, transactions, isLoading }) => (
  <div className="space-y-6 bg-white">
    <DashboardOverview users={users} transactions={transactions} isLoading={isLoading} />
    <DashboardCharts />
  </div>
);

/**
 * The renderContent function  passes all necessary data down to its children.
 */
const renderContent = (activeView, users, transactions, isLoading) => {
  switch (activeView) {
    case "dashboard":
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} />
    case "analytics":
      return <Analytics transactions={transactions} isLoading={isLoading} />;
    case "clients":
      return <RecentlyPurchased />;
    case "coupons":
      return <CouponsOffers />;
    case "services":
      return <Services />;
    case "register":
      return <RegisterAdmin/>
    case "feedback":
      return <Feedback/>
    default:
      // Default to the main dashboard view
      return <DashboardHome users={users} transactions={transactions} isLoading={isLoading} />
  }
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] =useState("dashboard");
  const { data: transactionsResponse, isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useGetAllTransactionsQuery();
  const { data: usersResponse, isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = useGetAllUsersQuery();

  const isLoading = isLoadingTransactions || isLoadingUsers;
  const isError = isErrorTransactions || isErrorUsers;
  const error = transactionsError || usersError;

  const allTransactions = transactionsResponse?.data || [];
  const allUsers = usersResponse?.data || [];

  const handleNavigate = (view) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // if (isError) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen p-4">
  //       <Alert variant="destructive" className="max-w-lg">
  //           <Terminal className="h-4 w-4" />
  //           <AlertTitle>Error Fetching Platform Data</AlertTitle>
  //           <AlertDescription>
  //               Could not load admin dashboard. {error?.data?.message || "Please try again later."}
  //           </AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboardSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-col flex-1 lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div
            key={activeView}
            className="animate-in slide-in-from-bottom-5 fade-in-0 duration-500"
          >
            {renderContent(activeView, allUsers, allTransactions, isLoading)}
          </div>
        </main>
      </div>
    </div>
  );
}