// src/app/api/serviceApiSlice.js
import { apiSlice } from './apiSlice';

const SERVICES_URL = '/services';

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all services query
    getServices: builder.query({
      query: () => SERVICES_URL,
      // Provides the 'Service' tag. Any mutation that invalidates 'Service' will trigger this query to refetch.
      providesTags: ['Service'], 
      keepUnusedDataFor: 5, // Optional: keep data in cache for 5 seconds after unsubscription
    }),
    getServiceById: builder.query({
        query: (serviceId) => `${SERVICES_URL}/${serviceId}`,
        providesTags: (result, error, id) => [{type: 'Service', id}]
    })
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery } = serviceApiSlice;