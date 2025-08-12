import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken, selectCurrentUserRole } from '@/features/auth/authSlice';
import PrivacyPolicy from '../home/PrivacyPolicyPage';
import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/home/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import AdminLoginPage from '@/admin/AdminLoginPage';
import AboutUsPage from '@/home/AboutUsPage';
import ContactUsPage from '@/home/ContactUsPage';
import ProductPage from '@/home/ProductPage'
import PricingPage from '@/home/PricingPage';
import ResetPasswordPage from '@/components/ResetPasswordPage';
import BlogLanding from '../home/BlogLanding';
import BlogPage from '../home/BlogPage';
import TermsAndConditionsPage from '../home/Terms&ConditionPage';
import DisclaimerPage from '../home/Disclaimer';
import HowToVerifyPage from '../home/HowToGetVerify';
import CaseStudyPage from '../home/CaseStudyPage'; 
export const publicRoutes = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
   {
    path: '/about-us',
    element:<AboutUsPage/>,
    errorElement: <ErrorPage />
  },
   {
    path: '/privacy-policy',
    element:<PrivacyPolicy/>,
    errorElement: <ErrorPage />
  },
  {
    path: '/how-to-get-verify',
    element:<HowToVerifyPage/>,
    errorElement: <ErrorPage />
  },
   {
    path: '/case-study',
    element:<CaseStudyPage/>,
    errorElement: <ErrorPage />
  },
    {
    path: '/terms-and-condition',
    element:<TermsAndConditionsPage/>,
    errorElement: <ErrorPage />
  },
  {
    path: '/disclaimer',
    element:<DisclaimerPage/>,
    errorElement: <ErrorPage />
  },
   {
    path: '/contact-us',
    element:<ContactUsPage/>,
    errorElement: <ErrorPage />
  },
    {
    path: '/product/:id',
    element:<ProductPage/>,
    errorElement: <ErrorPage />
  },
   {
    path: '/pricing',
    element:<PricingPage/>,
    errorElement: <ErrorPage />
  },
   {
      path: '/admin-login',
      element: <AdminLoginPage />,
      errorElement: <ErrorPage />
    },
    {
      path: '/blog',
      element: <BlogLanding />,
      errorElement: <ErrorPage />
    },
    {
      path: '/blog/:slug',
      element: <BlogPage />,
      errorElement: <ErrorPage />
    },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    errorElement: <ErrorPage />
  },
    {
    path: '/reset-password',
    element: <ResetPasswordPage />,
    errorElement: <ErrorPage />
  },
   {
      path: '*',
      element: <ErrorPage/>, 
    },
];

/**
 * --- MODIFIED: This component now handles all post-login redirection logic ---
 * It redirects logged-in users away from auth pages to their respective dashboards,
 * prioritizing any specific redirection requests (like the 'status' param).
 */
export const RedirectIfLoggedIn = () => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole);
  const location = useLocation();

  if (token) {
    // Priority 1: Check for a 'status' query param for redirection to a specific service.
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get('status');
    if (statusParam) {
      return <Navigate to={`/user/service/${statusParam}`} replace />;
    }

    // Priority 2: Check if the user was coming from a different protected page.
    const from = location.state?.from?.pathname;
    if (from && from !== location.pathname) {
      return <Navigate to={from} replace />;
    }
    
    // Priority 3: Default redirection based on the user's role.
    const redirectTo = role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectTo} replace />;
  }

  // If not logged in, render the child component (e.g., the login page).
  return <Outlet />;
};