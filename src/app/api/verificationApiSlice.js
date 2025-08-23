import { apiSlice } from './apiSlice';

const VERIFICATION_URL = '/verification';

export const verificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @desc Mutation to execute a subscribed service.
     * @param {string} serviceKey - The unique key for the service.
     * @param {object|FormData} payload - The input data for the service.
     */
    executeSubscribedService: builder.mutation({
      query: ({ serviceKey, payload }) => {
        let body;

        // Check if the payload is FormData (indicating a file upload).
        if (payload instanceof FormData) {
          // If so, append the serviceKey as a separate field.
          // The backend's multipart parser will place this in `req.body`.
          payload.append('serviceKey', serviceKey);
          // console.log(payload)
          body = payload;
        } else {
          // For standard JSON requests, create a flat object with serviceKey
          // and spread the rest of the payload properties.
          body = { serviceKey, ...payload };
        }
        
        return {
          url: `${VERIFICATION_URL}/verify`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['VerificationResult'],
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
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useExecuteSubscribedServiceMutation, useGetVerificationHistoryQuery } = verificationApiSlice;