import { Outlet, useLocation } from 'react-router-dom';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import NotificationPermissionHandler from '../utils/NotificationPermissoinHandler';

const PublicLayout = () => {
  const location = useLocation();
  const hideWhatsAppIconOn = ['/login', '/signup', '/admin-login', '/reset-password'];
  const shouldShowWhatsAppIcon = !hideWhatsAppIconOn.includes(location.pathname);

  return (
    <>
      {/* This handler will now only appear on general public routes */}
      <NotificationPermissionHandler />
      <Outlet />
      {shouldShowWhatsAppIcon && <WhatsAppIcon />}
    </>
  );
};

export default PublicLayout;