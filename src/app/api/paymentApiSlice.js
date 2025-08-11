// store/slices/paymentApiSlice.js

import { apiSlice } from './apiSlice';
import { authApiSlice } from './authApiSlice';
const PAYMENT_URL = '/payment';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to create a Razorpay order for a subscription.
     * @param {string} planName - The name of the pricing plan (e.g., "Personal").
     * @param {string} planType - The type ('monthly' or 'yearly').
     * @param {string} [couponCode] - Optional: The coupon code to apply.
     */
    createSubscriptionOrder: builder.mutation({
      // The arguments received by the component hook (e.g., useCreateSubscriptionOrderMutation)
      query: ({ planName, planType, couponCode }) => ({
        url: `${PAYMENT_URL}/order`,
        method: 'POST',
        // CRITICAL FIX: The keys in the body MUST match the backend controller.
        body: { planName, planType, couponCode },
      }),
    }),

     createDynamicSubscriptionOrder: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/dynamic-order`,
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * @desc Mutation to verify a subscription payment and activate it.
     * @param {object} verificationData - Object containing Razorpay details and transactionId.
     */
       verifySubscriptionPayment: builder.mutation({
      query: (verificationData) => ({
        url: `${PAYMENT_URL}/verify`,
        method: 'POST',
        body: verificationData,
      }),
      // This invalidation logic is perfect. It ensures user and transaction data is refetched.
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: 'PROFILE' },
        { type: 'Transaction', id: 'LIST' },
        { type: 'Coupon', id: 'LIST' }
      ],
      // This onQueryStarted logic is also excellent for ensuring the UI updates instantly.
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApiSlice.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
        } catch (error) {
          console.error('Payment verification succeeded, but profile refetch failed:', error);
        }
      },
    }),
  }),
});

export const { 
  useCreateSubscriptionOrderMutation, 
  useCreateDynamicSubscriptionOrderMutation,
  useVerifySubscriptionPaymentMutation 
} = paymentApiSlice;