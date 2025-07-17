// src/app/api/serviceApiSlice.js
import { apiSlice } from './apiSlice';

// Assuming your apiSlice looks something like this:
// const apiSlice = createApi({
//   ...
//   tagTypes: ['Service', 'User'], // Make sure 'Service' tag is defined
// });


export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: '/services',
        method: 'GET',
      }),
      // Provides a 'Service' tag to the cached data.
      // This allows us to invalidate this data later.
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Service', id: _id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
      keepUnusedDataFor: 3600,
    }),
    getServiceById: builder.query({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: 'GET',
      }),
       providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation({
      query: (serviceData) => ({
        url: `/services`,
        method: 'POST',
        // The backend expects an array of services.
        body: [serviceData],
      }),
      // After a successful creation, invalidate the 'LIST' tag
      // to force a refetch of the services list.
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
  }),
});

// Export the new mutation hook along with the existing query hooks.
export const { useGetServicesQuery, useGetServiceByIdQuery, useCreateServiceMutation } = serviceApiSlice;
