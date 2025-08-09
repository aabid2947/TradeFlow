import UserDashBoard from "@/user/UserDashBoard";
import ServicePage from "@/user/ServicePage";
import ErrorPage from "@/pages/ErrorPage";
import ServiceExecutionPage from "@/user/ServiceExecutionPage"; // <-- IMPORT NEW PAGE

export const protectedUserRoutes = [
  {
    // This route handles the main dashboard where content is switched by state.
    path: '/user',
    element: <UserDashBoard />,
    errorElement: <ErrorPage />
  },
  {
    // This route is for the list of services within a category.
    path: '/user/service/:category',
    element: <ServicePage />,
    errorElement: <ErrorPage />
  },
  {
    // NEW: This route is for the dedicated service execution "sandbox" page.
    path: '/user/try/:serviceKey',
    element: <ServiceExecutionPage />,
    errorElement: <ErrorPage />
  }
];
