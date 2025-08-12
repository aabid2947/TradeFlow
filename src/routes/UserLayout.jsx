import { Outlet } from 'react-router-dom';
import NotificationPermissionHandler from '../utils/NotificationPermissoinHandler';

/**
 * This layout wraps all protected user routes to include shared components
 * like the notification handler.
 */
const UserLayout = () => {
    return (
        <>
            <NotificationPermissionHandler />
            <Outlet />
        </>
    );
};

export default UserLayout;