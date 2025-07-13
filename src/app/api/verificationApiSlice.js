// src/app/api/verificationApiSlice.js
import { apiSlice } from './apiSlice';

const VERIFICATION_URL = '/verification';

export const verificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This is a 'mutation' because it sends data to the server to perform an action.
    verifyService: builder.mutation({
      query: ({ serviceKey, payload }) => ({
        url: `${VERIFICATION_URL}/verify`,
        method: 'POST',
        // The body includes the unique key for the service and the data payload.
        // RTK Query will automatically handle setting the Content-Type header to
        // 'application/json' or 'multipart/form-data' if the payload is a FormData object.
        body: { serviceKey, payload },
      }),
      // After a successful verification, we should refetch the user's profile.
      // This is useful if your backend deducts credits or updates the user's usage history.
      invalidatesTags: ['User'],
    }),
  }),
});

// Export the auto-generated hook for use in your components.
export const { useVerifyServiceMutation } = verificationApiSlice;