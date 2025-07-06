import UserDashBoard from "../pages/UserDashBoard";
// import Login from '@/pages/Login';
import AdminDashBoard from "../pages/AdminDashBoard"

const publicRoutes = [
  {
    path: '/',
    element: <UserDashBoard />,
  },
  {
    path: '/user',
    element: <UserDashBoard />,
  },
  {
    path: '/admin',
    element: <AdminDashBoard />
  },
   {
      path: '*',
      element: <div>404 Not Found</div>, // Add a 404 page
    },
];

export default publicRoutes;
