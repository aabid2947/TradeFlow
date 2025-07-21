
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken } from '@/features/auth/authSlice';

import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/home/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import AdminLoginPage from '@/admin/AdminLoginPage';
export const publicRoutes = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
   {
      path: '/admin-login',
      element: <AdminLoginPage />,
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
      path: '*',
      element: <ErrorPage/>, 
    },
];

export const PublicRoute = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  if (token) {
    // If the user is logged in, redirect them to the user dashboard.
    return <Navigate to="/user" state={{ from: location }} replace />;
  }

  // If not logged in, render the child component (the public page)
  return <Outlet />;
};