import { Routes, Route } from 'react-router-dom';
import { protectedAdminRoutes } from './ProtectedAdminRoutes';
import { protectedUserRoutes } from './ProtectedUserRoute';
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from './ProtectedRoutes';
import { publicRoutes, RedirectIfLoggedIn } from './PublicRoutes';
import PublicLayout from './PublicLayout';
import usePageTracking from '../hooks/usePageTracking';
import FirebaseAuthListener from '../firebase/FirebaseAuthListener'; 

const AppRoutes = () => {
  usePageTracking();
  
  const authPaths = ['/login', '/signup', '/admin-login', '/reset-password'];
  const generalPublicRoutes = publicRoutes.filter(r => !authPaths.includes(r.path));
  const authRoutes = publicRoutes.filter(r => authPaths.includes(r.path));

  return (
    <>
      <FirebaseAuthListener /> 
      
      <Routes>
        <Route element={<RedirectIfLoggedIn />}>
          {authRoutes.map((route, idx) => (
            <Route key={`auth-${idx}`} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route element={<PublicLayout />}>
          {generalPublicRoutes.map((route, idx) => (
            <Route key={`public-${idx}`} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          {protectedUserRoutes.map((route, idx) => (
            <Route key={`user-${idx}`} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {protectedAdminRoutes.map((route, idx) => (
            <Route key={`admin-${idx}`} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/unauthorized" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes