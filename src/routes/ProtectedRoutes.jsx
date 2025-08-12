import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken, selectCurrentUserRole, selectIsAuthLoading } from '@/features/auth/authSlice'; 
import Loader from '../components/Loader';
const ProtectedRoute = ({ allowedRoles }) => {
  // Get all necessary state from Redux
  const isLoading = useSelector(selectIsAuthLoading);
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole);
  const location = useLocation();

  // If the auth state is loading, show a placeholder. This prevents the glitch.
  if (isLoading) {
    return (
     <Loader />
    );
  }

  // Once loading is false, proceed with the existing logic
 if (!token) {
  const searchParams = new URLSearchParams(location.search);
  const statusParam = searchParams.get('status');

  const loginPath = statusParam
    ? `/login?status=${encodeURIComponent(statusParam)}`
    : '/login';

  return <Navigate to={loginPath} state={{ from: location }} replace />;
}
  const isAuthorized = allowedRoles && allowedRoles.includes(role);

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;