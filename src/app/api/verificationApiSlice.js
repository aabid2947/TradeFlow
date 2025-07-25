import { apiSlice } from './apiSlice';

const VERIFICATION_URL = '/api/verification';

/**
 * @file Verification API Slice
 * @description This slice now exclusively handles verification for FREE services.
 * Paid services are handled by the paymentApiSlice.
 */
export const verificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to verify a FREE service.
     * @param {string} serviceKey - The unique key for the service.
     * @param {object|FormData} payload - The input data for the service.
     */
    verifyService: builder.mutation({
      query: ({ serviceKey, payload }) => {
        // Handle both JSON and FormData for free services
        if (payload instanceof FormData) {
          payload.append('serviceKey', serviceKey);
          return {
            url: `${VERIFICATION_URL}/verify`,
            method: 'POST',
            body: payload,
            formData: true,
          };
        }
        return {
          url: `${VERIFICATION_URL}/verify`,
          method: 'POST',
          body: { serviceKey, payload },
        };
      },
      // After successful verification, invalidate user and transaction tags to refetch data.
      invalidatesTags: (result, error, arg) => [
        'User', 
        { type: 'Transaction', id: 'LIST' }
      ],
    }),
  }),
});

export const { useVerifyServiceMutation } = verificationApiSlice;
