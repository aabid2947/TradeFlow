
import AdminDashBoard from "@/admin/AdminDashBoard"

import ErrorPage from "@/pages/ErrorPage";

export const protectedAdminRoutes = [

    // {
    //     path: '/coupon-offer',
    //     element: <CouponOfferPage />
    // },

    {
        path: '/admin',
        element: <AdminDashBoard />,
        errorElement: <ErrorPage />
    },
    // {
    //     path: '/purchase-list',
    //     element: <AdminRecentPurchasedListPage />,
    //     errorElement: <ErrorPage />
    // },

];

