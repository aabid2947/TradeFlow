import UserDashBoard from "../pages/UserDashBoard";
// import Login from '@/pages/Login';
import AdminDashBoard from "../pages/AdminDashBoard"

const publicRoutes = [
  {
    path: '/user',
    element: <UserDashBoard />,
  },
  {
    path: '/admin',
    element: <AdminDashBoard />
  },
];

export default publicRoutes;
