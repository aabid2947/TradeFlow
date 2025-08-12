import { Outlet, useLocation } from 'react-router-dom';
import NotificationPermissionHandler from '../utils/NotificationPermissoinHandler';

/**
 * A layout that conditionally renders the notification prompt.
 * It ensures the prompt only appears on public and user routes, not on admin routes.
 */
const MainLayout = () => {
    const location = useLocation();

    // We do not want to ask for notification permission on any admin-facing page.
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {/* Only render the permission handler if it's NOT an admin route */}
            {!isAdminRoute && <NotificationPermissionHandler />}
            
            {/* This will render the actual page route */}
            <Outlet />
        </>
    );
};

export default MainLayout;