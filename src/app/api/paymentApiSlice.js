import { apiSlice } from './apiSlice';
import { authApiSlice } from './authApiSlice';
const PAYMENT_URL = '/payment';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to create a Razorpay order for a CATEGORY SUBSCRIPTION.
     * @param {string} category - The category to subscribe to.
     * @param {string} plan - The plan ('monthly' or 'yearly').
     * @param {string} [couponCode] - Optional: The coupon code to apply.
     */
    createSubscriptionOrder: builder.mutation({
      query: ({ category, plan, couponCode }) => ({
        url: `${PAYMENT_URL}/order`,
        method: 'POST',
        body: { category, plan, couponCode },
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
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: 'PROFILE' },
        { type: 'Transaction', id: 'LIST' },
        { type: 'Coupon', id: 'LIST' }
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // After payment is verified, dispatch an action to refetch the user's profile
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
  useVerifySubscriptionPaymentMutation 
} = paymentApiSlice;