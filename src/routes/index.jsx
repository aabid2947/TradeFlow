import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthLoading, selectIsProfileComplete } from "../features/auth/authSlice";
import PublicRoutes from "./PublicRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import ProtectedAdminRoutes from "./ProtectedAdminRoutes.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import OnboardingPage from "../pages/OnboardingPage.jsx";
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
  const isProfileComplete = useSelector(selectIsProfileComplete);

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect authenticated users with incomplete profiles to onboarding
  const shouldShowOnboarding = isAuthenticated && !isProfileComplete;

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
      <Route path="/login" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <DashboardPage />) : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <DashboardPage />) : <SignUpPage />} />
      <Route path="/forgot-password" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <DashboardPage />) : <ForgotPasswordPage />} />
      
      {/* Onboarding route - only for authenticated users with incomplete profiles */}
      <Route path="/onboarding" element={shouldShowOnboarding ? <OnboardingPage /> : (isAuthenticated ? <DashboardPage /> : <LoginPage />)} />
      
      {/* Protected seller routes */}
      <Route path="/create-listing" element={shouldShowOnboarding ? <OnboardingPage /> : <CreateListingPage />} />
      
      {/* Protected chat route */}
      <Route path="/chat" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <ChatPage />) : <LoginPage />} />
      
      {/* Protected trade routes */}
      <Route path="/trades" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <TradesPage />) : <LoginPage />} />
      <Route path="/trades/:tradeId" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <TradeDetailsPage />) : <LoginPage />} />
      
      {/* Protected withdrawal route */}
      <Route path="/withdraw" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <WithdrawalCheckoutPage />) : <LoginPage />} />
      <Route path="/withdrawals" element={isAuthenticated ? (shouldShowOnboarding ? <OnboardingPage /> : <WithdrawalHistoryPage />) : <LoginPage />} />
      
      {/* Protected user routes */}
      <Route path="/dashboard/*" element={shouldShowOnboarding ? <OnboardingPage /> : <ProtectedRoutes />} />
      
      {/* Protected admin routes */}
      <Route path="/admin/*" element={<ProtectedAdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
