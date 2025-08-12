import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { protectedAdminRoutes } from './ProtectedAdminRoutes';
import { protectedUserRoutes } from './ProtectedUserRoute';
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from './ProtectedRoutes';
import { publicRoutes, RedirectIfLoggedIn } from './PublicRoutes';
import PublicLayout from './PublicLayout';
import { Toaster } from 'react-hot-toast'; 
import NotificationPermissionHandler from '../utils/NotificationPermissoinHandler';

const AppRoutes = () => {
  const location = useLocation();
  
  const authPaths = ['/login', '/signup', '/admin-login', '/reset-password'];
  const generalPublicRoutes = publicRoutes.filter(r => !authPaths.includes(r.path));
  const authRoutes = publicRoutes.filter(r => authPaths.includes(r.path));

  // --- MODIFIED: Added Tidio Chat visibility logic ---
  useEffect(() => {
    const tidioScriptId = 'tidio-chat-script';
    
    // Define which paths should show the chat widget
    const showTidioOnPaths = ['/']; // Start with the homepage
    const shouldShow = showTidioOnPaths.includes(location.pathname) || location.pathname.startsWith('/user');

    // Find the Tidio API object
    const tidioApi = window.tidioChatApi;

    if (shouldShow) {
      // If the script doesn't exist, create and append it
      if (!document.getElementById(tidioScriptId)) {
        const script = document.createElement('script');
        script.id = tidioScriptId;
        script.src = "//code.tidio.co/xalkjzzpyytmhnzdek3pkdvbwzge6rih.js";
        script.async = true;
        document.body.appendChild(script);
      } else if (tidioApi) {
        // If the script exists and API is available, ensure it's visible
        tidioApi.show();
      }
    } else {
      // If on a page where it should be hidden, use the API to hide it
      if (tidioApi) {
        tidioApi.hide();
      }
    }
    
    // No cleanup function is needed, as we want the script to persist 
    // and just be hidden or shown for a better UX.
  }, [location.pathname]); // Re-run this effect whenever the route changes

  return (
    <>
        <Toaster position="top-center" reverseOrder={false} />
      <NotificationPermissionHandler/>
      
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

export default AppRoutes;