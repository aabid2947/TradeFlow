import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
    const token = getState().auth.token; //
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

//Root API slice
export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: baseQuery,
  tagTypes: ['Service', 'User', 'Transaction', 'Review'],
  endpoints: (builder) => ({}),
});