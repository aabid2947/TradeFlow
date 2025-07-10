// src/features/auth/authApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
  query: (userInfo) => {
    // First, log the data
    console.log('User info submitted to signup mutation:', userInfo);

    // Then, return the query configuration object
    return {
      url: '/auth/signup',
      method: 'POST',
      body: userInfo,
    };
  },
}), 
    // You could add a "get user profile" query here as well
    // getProfile: builder.query({ ... })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useSignupMutation } = authApi;