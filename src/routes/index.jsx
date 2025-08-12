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

  // --- MODIFIED: Uses CSS injection to position the Tidio widget ---
  useEffect(() => {
    const tidioScriptId = 'tidio-chat-script';
    const styleElementId = 'tidio-position-style';

    // Define which paths should show the chat widget
    const showTidioOnPaths = ['/']; // Start with the homepage
    const shouldShow = showTidioOnPaths.includes(location.pathname) || location.pathname.startsWith('/user');

    const setupTidioWidget = () => {
      const tidioApi = window.tidioChatApi;
      if (!tidioApi) return;

      // --- NEW: CSS Injection for Positioning ---
      // Check if our custom style tag already exists
      if (!document.getElementById(styleElementId)) {
        const style = document.createElement('style');
        style.id = styleElementId;
        // This CSS targets the Tidio widget's iframe container.
        // We use !important to ensure our styles override Tidio's default styles.
        // 'bottom-10' in Tailwind is 2.5rem.
        style.innerHTML = `
          div#tidio-chat-iframe {
            bottom: 2.5rem !important;
            right: 2.5rem !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Use the API to show or hide the widget
      if (shouldShow) {
        tidioApi.show();
      } else {
        tidioApi.hide();
      }
    };

    // If the script doesn't exist, create and append it
    if (!document.getElementById(tidioScriptId)) {
      const script = document.createElement('script');
      script.id = tidioScriptId;
      script.src = "//code.tidio.co/xalkjzzpyytmhnzdek3pkdvbwzge6rih.js";
      script.async = true;
      document.body.appendChild(script);
      
      // Listen for the Tidio API to be ready
      document.addEventListener('tidioChat-ready', setupTidioWidget);
    } else {
      // If the script already exists, the API might be ready
      setupTidioWidget();
    }

    // Cleanup function to remove the event listener and style tag
    return () => {
      document.removeEventListener('tidioChat-ready', setupTidioWidget);
      const styleTag = document.getElementById(styleElementId);
      if (styleTag) {
        // You might want to keep the style tag if you navigate between pages
        // where Tidio is shown. Removing it is cleaner if the component unmounts entirely.
        // styleTag.remove(); 
      }
    };
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