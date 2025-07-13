// src/app/api/serviceApiSlice.js
import { apiSlice } from './apiSlice';

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => {
        console.log(90)
        return {
        url: '/services',
        method: 'GET',
      }},
      keepUnusedDataFor: 3600,  
    }),
    getServiceById: builder.query({
      query: (serviceId) => ({
        url: `/service/${serviceId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery } = serviceApiSlice;
