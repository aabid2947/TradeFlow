import UserDashBoard from "../pages/UserDashBoard";
// import Login from '@/pages/Login';
import AdminDashBoard from "../pages/AdminDashBoard"
import ServicePage from "../pages/ServicePage";
import ErrorPage from "../pages/ErrorPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import RecentlyPurchased from "../components/AdminComponents/RecentlyPurchased";
import AdminRecentPurchasedListPage from "../pages/Admin/RecentPurchasedPage";
import CouponOfferPage from "../pages/Admin/CouponOfferPage";
import AdminLoginPage from "../pages/AdminLoginPage";
const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
        path: '/admin-login',
    element: <AdminLoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    // errorElement: <ErrorPage />
  },
  {
    path:'/coupon-offer',
    element:<CouponOfferPage/>
  },
  {
    path: '/user',
    element: <UserDashBoard />,
    errorElement: <ErrorPage />
  },
  {
    path: '/admin',
    element: <AdminDashBoard />,
    errorElement: <ErrorPage />
  },
  {
    path: '/purchase-list',
    element: <AdminRecentPurchasedListPage/>,
    errorElement: <ErrorPage />
  },
  {
    path:'/service',
    element:<ServicePage/>,
    errorElement: <ErrorPage />
  },

   {
      path: '*',
      element: <div>404 Not Found</div>, // Add a 404 page
    },
];

export default publicRoutes;
