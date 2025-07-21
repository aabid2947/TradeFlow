
import { apiSlice } from './apiSlice';

const SERVICES_URL = '/services';

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: SERVICES_URL,
        method: 'GET',
      }),
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
        url: `${SERVICES_URL}/${serviceId}`,
        method: 'GET',
      }),
       providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation({
      query: (serviceData) => ({
        // The backend expects an array of services for bulk creation
        url: `${SERVICES_URL}/create`,
        method: 'POST',
        body: serviceData, 
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: builder.mutation({
      query: ({ id, ...changes }) => ({
        url: `${SERVICES_URL}/${id}`,
        method: 'PUT',
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `${SERVICES_URL}/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, serviceId) => [
        { type: 'Service', id: serviceId },
        { type: 'Service', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice;