
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
    signup: builder.mutation({
   
      query: (userInfo) =>  {
           console.log(userInfo)
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
      getAllUsers: builder.query({
      query: () => ({
        url: '/users/all',
        method: 'GET',
      }),
      providesTags: ['User'], // Optional: for caching
    }),
    signupAdmin: builder.mutation({
   
      query: (adminInfo) =>  {
           console.log(adminInfo)
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
      providesTags: ['User'], // Optional: for caching
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery, useGetAllUsersQuery,useSignupAdminMutation,useGetAllAdminQuery  } = authApiSlice;