import UserDashBoard from "@/user/UserDashBoard";
import ServicePage from "@/user/ServicePage";
import ErrorPage from "@/pages/ErrorPage";

export const protectedUserRoutes = [
  {
    // This route handles the main dashboard where content is switched by state.
    path: '/user',
    element: <UserDashBoard />,
    errorElement: <ErrorPage />
  },
   
  {
    // This route is now based on the category name passed in the URL.
    path: '/user/service/:category',
    element: <ServicePage />,
    errorElement: <ErrorPage />
  },
];