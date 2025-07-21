
import { apiSlice } from './apiSlice';

const VERIFICATION_URL = '/verification';

export const verificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyService: builder.mutation({
      query: ({ serviceKey, payload }) => ({
        url: `${VERIFICATION_URL}/verify`,
        method: 'POST',
        body: { serviceKey, payload },
      }),
       keepUnusedDataFor: 0,
       refetchOnMountOrArgChange: true,

      // After a successful verification, refetch the user's profile.
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useVerifyServiceMutation } = verificationApiSlice;