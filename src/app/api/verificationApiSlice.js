import { apiSlice } from './apiSlice';

const VERIFICATION_URL = '/verification'; // Note: The base URL in apiSlice might already include '/api'

/**
 * @file Verification API Slice
 * @description This slice now handles the execution of a service for a user
 * who has already been verified to have an active subscription by the backend middleware.
 */
export const verificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to execute a subscribed service.
     * @param {string} serviceKey - The unique key for the service.
     * @param {object|FormData} payload - The input data for the service.
     */
    executeSubscribedService: builder.mutation({
      query: ({ serviceKey, payload }) => {
        // The body now just needs serviceKey and payload
        const body = { serviceKey, payload };
        
        // FormData is not typically needed here unless the payload itself contains files,
        // which the backend logic for subscribed services would need to handle.
        // Assuming JSON for simplicity as per the new backend flow.
        return {
          url: `${VERIFICATION_URL}/verify`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['VerificationResult'],
      // This action does not create a transaction, so we only need to invalidate
      // the user's profile if we were tracking usage counts there.
      // For now, no invalidations are strictly necessary on individual use.
    }),
     getVerificationHistory: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `${VERIFICATION_URL}/verification-history`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'VerificationResult', id: _id })),
              { type: 'VerificationResult', id: 'LIST' },
            ]
          : [{ type: 'VerificationResult', id: 'LIST' }],
      keepUnusedDataFor: 5, // Cache for 5 seconds
    }),
  
  }),
});

export const { useExecuteSubscribedServiceMutation,useGetVerificationHistoryQuery } = verificationApiSlice;