import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthLoading } from "../features/auth/authSlice";
import PublicRoutes from "./PublicRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import ProtectedAdminRoutes from "./ProtectedAdminRoutes.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import TradingPage from "../pages/TradingPage.jsx";
import NewsPage from "../pages/NewsPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import CreateListingPage from "../pages/CreateListingPage.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import TradesPage from "../pages/TradesPage.jsx";
import TradeDetailsPage from "../pages/TradeDetailsPage.jsx";
import WithdrawalCheckoutPage from "../pages/WithdrawalCheckoutPage.jsx";
import WithdrawalHistoryPage from "../pages/WithdrawalHistoryPage.jsx";

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public pages accessible to everyone */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/market" element={<TradingPage />} />
      <Route path="/trading" element={<TradingPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Authentication routes - only accessible when not logged in */}
      <Route path="/login" element={isAuthenticated ? <DashboardPage /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <DashboardPage /> : <SignUpPage />} />
      
      {/* Protected seller routes */}
      <Route path="/create-listing" element={<CreateListingPage />} />
      
      {/* Protected chat route */}
      <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <LoginPage />} />
      
      {/* Protected trade routes */}
      <Route path="/trades" element={isAuthenticated ? <TradesPage /> : <LoginPage />} />
      <Route path="/trades/:tradeId" element={isAuthenticated ? <TradeDetailsPage /> : <LoginPage />} />
      
      {/* Protected withdrawal route */}
      <Route path="/withdraw" element={isAuthenticated ? <WithdrawalCheckoutPage /> : <LoginPage />} />
      <Route path="/withdrawals" element={isAuthenticated ? <WithdrawalHistoryPage /> : <LoginPage />} />
      
      {/* Protected user routes */}
      <Route path="/dashboard/*" element={<ProtectedRoutes />} />
      
      {/* Protected admin routes */}
      <Route path="/admin/*" element={<ProtectedAdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
