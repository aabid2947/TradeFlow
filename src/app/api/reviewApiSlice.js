import { apiSlice } from '@/app/api/apiSlice';

const REVIEWS_URL = '/reviews';
const SERVICES_URL = '/services';

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a new review
     createReview: builder.mutation({
            query: (reviewData) => ({
                url: REVIEWS_URL,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: (result, error, { serviceId }) => [
                { type: 'Review', id: 'LIST' },
                { type: 'Review', id: 'ME' },
                { type: 'ServiceReviews', id: serviceId }
            ],
        }),

    // Mutation to update a review
         updateReview: builder.mutation({
            query: ({ reviewId, ...updateData }) => ({
                url: `${REVIEWS_URL}/${reviewId}`,
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: (result, error, { reviewId, serviceId }) => [
                { type: 'Review', id: reviewId },
                { type: 'Review', id: 'LIST' },
                { type: 'Review', id: 'ME' },
                { type: 'ServiceReviews', id: serviceId }
            ],
        }),
    
          getReviewsByService: builder.query({
        query: (serviceId) => ({
            url: `${REVIEWS_URL}/service/${serviceId}`, 
            method: 'GET',
        }),
        providesTags: (result, error, serviceId) => [
            { type: 'Review', id: 'LIST' },
            { type: 'ServiceReviews', id: serviceId }
        ],
    }),
    // Query for the current user to get their own reviews
    getMyReviews: builder.query({
            query: () => ({
                url: `${REVIEWS_URL}/me`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Review', id: _id })),
                        { type: 'Review', id: 'ME' },
                    ]
                    : [{ type: 'Review', id: 'ME' }],
        }),
 
    // Query for admin to get all reviews
    getAllReviews: builder.query({
        query: ({ page = 1, limit = 10 } = {}) => ({
            url: `${REVIEWS_URL}/all`, 
            method: 'GET',
            params: { page, limit },
        }),
        providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Review', id: _id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    
    // Mutation to delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${REVIEWS_URL}/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: 'Review', id: reviewId },
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'ME' },
        { type: 'Transaction', id: 'LIST' } 
      ],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useGetMyReviewsQuery,
  useGetAllReviewsQuery,
  useGetReviewsByServiceQuery,
  useDeleteReviewMutation,
} = reviewApiSlice;




