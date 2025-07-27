import { apiSlice } from './apiSlice';

const PAYMENT_URL = '/payment';

/**
 * @file Payment API Slice
 * @description This slice manages all API endpoints related to payment processing.
 */
export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to create a Razorpay order on the backend.
     * @param {string} serviceId - The ID of the service being purchased.
     */
    createPaymentOrder: builder.mutation({
    // Update to accept both serviceId and payload
    query: ({ serviceId, payload }) => ({
        url: `${PAYMENT_URL}/order`,
        method: 'POST',
        // Send them both in the body
        body: { serviceId, payload },
    }),
}),
    /**
     * @desc Mutation to verify a payment after Razorpay checkout.
     * This sends payment details and the original service payload to the backend.
     * @param {FormData} formData - The form data containing payment signature and service payload.
     */
    verifyPayment: builder.mutation({
      query: (formData) => ({
        url: `${PAYMENT_URL}/verify`,
        method: 'POST',
        body: formData,
        // This is crucial for sending multipart/form-data
        formData: true, 
      }),
      // After successful verification, invalidate user and transaction tags to refetch data.
      invalidatesTags: (result, error, arg) => [
        'User', 
        { type: 'Transaction', id: 'LIST' }
      ],
    }),
  }),
});

export const { 
  useCreatePaymentOrderMutation, 
  useVerifyPaymentMutation 
} = paymentApiSlice;
