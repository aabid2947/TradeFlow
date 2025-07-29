import { apiSlice } from './apiSlice';
import { updateUser } from '@/features/auth/authSlice'; 

const AUTH_URL = '/auth';
const USERS_URL = '/users';
const ADMIN_URL = '/admin';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
    loginWithGoogle: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/google-signin`,
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userInfo) => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    // 2. UPDATE the getProfile query
     getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: (result, error, id) => [{ type: 'User', id: 'PROFILE' }],
      // This part is crucial and correctly implemented
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('🔐 getProfile - Fetched user data:', data);
          if (data ) {
            // This updates the auth slice with the fresh user data
            dispatch(updateUser(data)); 
          }
        } catch (error) {
          console.error('Failed to update user profile in state:', error);
        }
      },
    }),


    // 3. UPDATE the updateProfile mutation
    updateProfile: builder.mutation({
      query: (userInfo) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userInfo,
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
      // Also update the state immediately on successful profile update
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
            const { data } = await queryFulfilled;
            if (data && data.data) {
                dispatch(updateUser(data.data));
            }
        } catch (error) {
            console.error('Failed to update user profile in state after mutation:', error);
        }
      },
    }),
    
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/all`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'User', id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    signupAdmin: builder.mutation({
      query: (adminInfo) => ({
        url: `${ADMIN_URL}/register`,
        method: 'POST',
        body: adminInfo,
      }),
    }),
    getAllAdmin: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/all`,
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'ADMIN_LIST' }],
    }),
    verifyEmailOtp: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/verify-email-otp`,
        method: 'POST',
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (adminInfo) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: 'POST',
        body: adminInfo,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/reset-password`,
        method: 'PUT',
        body: body,
      }),
    }),
    
    promoteUserCategory: builder.mutation({
      query: ({ userId, category }) => ({
        url: `${USERS_URL}/${userId}/promote`,
        method: 'POST',
        body: { category },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),

    demoteUserCategory: builder.mutation({
      query: ({ userId, category }) => ({
        url: `${USERS_URL}/${userId}/demote`,
        method: 'POST',
        body: { category },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),
     getSubscriptionStatus: builder.query({
        query: () => ({
            url: `${USERS_URL}/me/subscriptions/status`,
            method: 'GET',
        }),
        providesTags: ['Subscription']
    }),
    remindSubscription: builder.mutation({
        query: (userId) => ({
            url: `${USERS_URL}/${userId}/send-reminder`,
            method: 'POST',
        }),
        providesTags: ['Subscription']
    })
  }),
});

export const { 
  useLoginMutation, 
  useSignupMutation, 
  useGetProfileQuery, 
  useGetAllUsersQuery,
  useSignupAdminMutation,
  useGetAllAdminQuery,
  useLoginWithGoogleMutation,
  useVerifyEmailOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, 
  useUpdateProfileMutation,
  usePromoteUserCategoryMutation,
  useDemoteUserCategoryMutation,
  useGetSubscriptionStatusQuery, 
  useRemindSubscriptionMutation
} = authApiSlice;