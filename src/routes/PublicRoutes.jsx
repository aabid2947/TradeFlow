import UserDashBoard from "../pages/UserDashBoard";
// import Login from '@/pages/Login';
import AdminDashBoard from "../pages/AdminDashBoard"
import ServicePage from "../pages/ServicePage";
import ErrorPage from "../pages/ErrorPage";
import LandingPage from "../pages/LandingPage";
const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />
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
