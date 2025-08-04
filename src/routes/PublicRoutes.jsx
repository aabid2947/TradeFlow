import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
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
import BlogPage from '../home/BlogPage';

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
 * Redirects logged-in users to their respective dashboards.
 */
export const RedirectIfLoggedIn = () => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole);

  if (token) {
    const redirectTo = role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};