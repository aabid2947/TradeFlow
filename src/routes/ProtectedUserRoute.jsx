import UserDashBoard from "@/user/UserDashBoard";
import ServicePage from "@/user/ServicePage"; // The detail page is now a full page
import ErrorPage from "@/pages/ErrorPage";

export const protectedUserRoutes = [
  {
    // This route handles the main dashboard where content is switched by state.
    path: '/user',
    element: <UserDashBoard />,
    errorElement: <ErrorPage />
  },
  {
    // This route is for displaying the details of a single service.
    path: '/user/service/:serviceId',
    element: <ServicePage />,
    errorElement: <ErrorPage />
  },
];