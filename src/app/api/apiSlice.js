// src/app/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base query function
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create the root API slice
export const apiSlice = createApi({
  reducerPath: 'api', // a unique key to identify this slice
  baseQuery: baseQuery,
  // Tag types are used for caching and invalidation
  tagTypes: ['Service', 'User', 'Admin'], 
  endpoints: (builder) => ({}), // Endpoints will be injected from other files
});