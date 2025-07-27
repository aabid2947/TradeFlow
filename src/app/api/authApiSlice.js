
import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    loginWithGoogle: builder.mutation({
      query: (credentials) => {
          console.log(credentials)
          return{
        
        url: '/auth/google-signin',
        method: 'POST',
        body: credentials,
      }},
    }),
    signup: builder.mutation({
   
      query: (userInfo) =>  {
        return {
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }},
    }),
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User']
    }),
    updateProfile: builder.mutation({
   
      query: (userInfo) =>  {
        return {
        url: '/auth/profile',
        method: 'PUT',
        body: userInfo,
      }},
    }),
      getAllUsers: builder.query({
      query: () => ({
        url: '/users/all',
        method: 'GET',
      }),
      providesTags: ['User'], 
    }),
    signupAdmin: builder.mutation({
   
    query: (adminInfo) =>  {
        return {
        url: '/admin/register',
        method: 'POST',
        body: adminInfo,
      }},
    }),
      getAllAdmin: builder.query({
      query: () => ({
        url: '/admin/all',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    verifyEmailOtp: builder.mutation({
    query: (body) =>  {
        return {
        url: '/auth/verify-email-otp',
        method: 'POST',
        body: body,
      }},
    }),
    forgotPassword: builder.mutation({
    query: (adminInfo) =>  {
        return {
        url: '/auth/forgot-password',
        method: 'POST',
        body: adminInfo,
      }},
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'PUT',
        body: body,
      }),
    }),

    
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
  useUpdateProfileMutation
} = authApiSlice;