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
    simpleSignup: builder.mutation({
      query: (userInfo) => ({
        url: `${AUTH_URL}/simple-register`,
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: (result, error, id) => [{ type: 'User', id: 'PROFILE' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data)
          if (data) {
            dispatch(updateUser(data)); 
          }
        } catch (error) {
          console.error('Failed to update user profile in state:', error);
        }
      },
    }),

    getUserById: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, // Backend route will be GET /api/users/:userId
        method: 'GET',
      }),
      // Provides a tag for this specific user, useful if this user's data is updated elsewhere
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
   


    updateProfile: builder.mutation({
      query: (userInfo) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userInfo,
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
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
        query: ({userId}) => ({
            url: `${USERS_URL}/${userId}/send-reminder`,
            method: 'POST',
        }),
        invalidatesTags: ['Subscription']
    }),
    
    extendSubscription: builder.mutation({
      query: ({ userId, category, duration }) => ({
        url: `${USERS_URL}/admin/extend-subscription`,
        method: 'POST',
        body: { userId, category, duration },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: 'PROFILE' },
        { type: 'User', id: userId },
         { type: 'Transaction', id: 'LIST' },
      ],
    }),
     promoteUserToSubcategory: builder.mutation({
      query: ({ userId, subcategory, multiplier }) => ({
        url: `${USERS_URL}/admin/promote-subcategory`,
        method: 'POST',
        body: { userId, subcategory, multiplier },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),

    // The revokeSubscription mutation is now used for demotion
    // revokeSubscription: builder.mutation({
    //   query: ({ userId, category }) => ({
    //     url: `${USERS_URL}/admin/revoke-subscription`,
    //     method: 'POST',
    //     body: { userId, category },
    //   }),
    //   invalidatesTags: (result, error, { userId }) => [
    //     { type: 'User', id: 'PROFILE' },
    //     { type: 'User', id: userId },
    //     { type: 'User', id: 'LIST' },
    //   ],
    // }),

    revokeSubscription: builder.mutation({
      query: ({ userId, category }) => ({
        url: `${USERS_URL}/admin/revoke-subscription`,
        method: 'POST',
        body: { userId, category },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: 'PROFILE' },
        { type: 'User', id: userId },
         { type: 'Transaction', id: 'LIST' },
      ],
    }),
        updateAvatar: builder.mutation({
      query: (formData) => ({
        url: `${USERS_URL}/profile/avatar`, // Corrected URL
        method: 'PUT',
        body: formData,
        // FormData is handled automatically by the browser
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
           if (data?.success && data?.avatar) {
             dispatch(updateUser({ avatar: data.avatar }));
           }
        } catch (err) {
          console.error('Failed to update avatar:', err);
        }
      },
    }),
     subscribeToNewsletter: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/newsletter-subscribe`,
        method: 'POST',
        body: credentials,
      }),
       invalidatesTags: ['User']
    }),

  }),
});

export const { 
  useLoginMutation, 
  useSignupMutation, 
  useGetProfileQuery, 
  useGetAllUsersQuery,
  useGetUserByIdQuery, 
  useSignupAdminMutation,
  useGetAllAdminQuery,
  useLoginWithGoogleMutation,
  useVerifyEmailOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, 
  useUpdateProfileMutation,
    usePromoteUserToSubcategoryMutation,
  
  usePromoteUserCategoryMutation,
  useDemoteUserCategoryMutation,
  useUpdateAvatarMutation,
  useGetSubscriptionStatusQuery, 
  useSimpleSignupMutation,
  useRemindSubscriptionMutation,
  useExtendSubscriptionMutation,
  useRevokeSubscriptionMutation,
  useSubscribeToNewsletterMutation
} = authApiSlice;