// src/app/api/authApiSlice.js
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
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // You could add getProfile here as well, providing a 'User' tag
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User']
    })
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery } = authApiSlice;