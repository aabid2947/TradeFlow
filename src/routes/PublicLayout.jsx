import { Outlet, useLocation } from 'react-router-dom';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import NotificationPrompt from '@/components/NotificationPromot';
const PublicLayout = () => {
  const location = useLocation();
  const hideWhatsAppIconOn = ['/login', '/signup', '/admin-login', '/reset-password'];

  const shouldShowWhatsAppIcon = !hideWhatsAppIconOn.includes(location.pathname);

  return (
    <>
     {/* <NotificationPrompt />  */}
      <Outlet />
      {shouldShowWhatsAppIcon && <WhatsAppIcon />}
    </>
  );
};

export default PublicLayout;