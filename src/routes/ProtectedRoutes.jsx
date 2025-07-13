
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken, selectCurrentRole } from '@/features/auth/authSlice';


/**
 * A component to protect routes based on authentication status and user role.
 * @param {object} props
 * @param {string[]} props.allowedRoles - An array of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);
  const location = useLocation();

  // 1. Check for a token
  if (!token) {
    // If not authenticated, redirect to the login page.
    // Save the location they were trying to access to redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the user's role is authorized
  const isAuthorized = allowedRoles && allowedRoles.includes(role);

  if (!isAuthorized) {
    // If the user is logged in but their role is not permitted,
    // redirect them to an "Unauthorized" page. You should create this page.
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // 3. If authenticated and authorized, render the child component
  return <Outlet />;
};

export default ProtectedRoute;