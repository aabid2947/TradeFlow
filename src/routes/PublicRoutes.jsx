
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken } from '@/features/auth/authSlice';

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
import {  selectCurrentUserRole } from '@/features/auth/authSlice'; 

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

export const PublicRoute = () => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole); // Get the user's role
  const location = useLocation();

  if (token) {
    // If the user is logged in, redirect them based on their role.
    const redirectTo = role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If not logged in, render the child component (the public page)
  return <Outlet />;
};