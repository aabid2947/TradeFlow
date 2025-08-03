import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: baseQuery,
  // Add 'Subscription' to the list of tagTypes
  tagTypes: ['Service', 'User', 'Transaction', 'Review', 'Coupon', 'Subscription','VerificationResult'],
  endpoints: (builder) => ({}),
});