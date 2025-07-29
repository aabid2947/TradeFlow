import { apiSlice } from './apiSlice';

const COUPONS_URL = '/coupons';

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query for admins to get all coupons
    getAllCoupons: builder.query({
      query: () => ({
        url: COUPONS_URL,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Coupon', id: _id })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),

    // Query for users to validate a coupon code before payment
    validateCouponCode: builder.query({
      query: (couponCode) => ({
        url: `${COUPONS_URL}/code/${couponCode}`,
        method: 'GET',
      }),
      providesTags: (result, error, code) => [{ type: 'Coupon', id: code }],
    }),

    // Mutation for admins to create a new coupon
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: COUPONS_URL,
        method: 'POST',
        body: couponData,
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    // Mutation for admins to update an existing coupon
    updateCoupon: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `${COUPONS_URL}/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    // Mutation for admins to delete a coupon
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `${COUPONS_URL}/${couponId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, couponId) => [
          { type: 'Coupon', id: couponId },
          { type: 'Coupon', id: 'LIST' },
        ],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useValidateCouponCodeQuery,
  useLazyValidateCouponCodeQuery, 
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApiSlice;