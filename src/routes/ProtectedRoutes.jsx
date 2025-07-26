
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken, selectCurrentUserRole } from '@/features/auth/authSlice';

/**
 * A component to protect routes based on authentication status and user role.
 * @param {object} props
 * @param {string[]} props.allowedRoles - An array of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole);
  const location = useLocation();

  if (!token) {
    // If not authenticated, redirect to the main login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user's role is included in the list of allowed roles.
  const isAuthorized = allowedRoles && allowedRoles.includes(role);

  if (!isAuthorized) {
    // If the user is logged in but their role is not permitted,
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  //  If authenticated and authorized, render the child components.
  return <Outlet />;
};

export default ProtectedRoute;