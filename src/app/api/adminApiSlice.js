// src/app/api/adminApiSlice.js
import { apiSlice } from './apiSlice';

const ADMIN_URL = '/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin Login Mutation
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: `${ADMIN_URL}/login`,
        method: 'POST',
        body: credentials,
      }),
    }),

    // Create Service Mutation
    createService: builder.mutation({
      query: (serviceData) => ({
        url: `${ADMIN_URL}/services`,
        method: 'POST',
        body: serviceData,
      }),
      // After creating a service, invalidate the 'Service' tag to force a refetch of the service list
      invalidatesTags: ['Service'],
    }),

    // Update Service Mutation
    updateService: builder.mutation({
      query: ({ serviceId, ...updateData }) => ({
        url: `${ADMIN_URL}/services/${serviceId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Service'],
    }),

    // Delete Service Mutation
    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `${ADMIN_URL}/services/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = adminApiSlice;