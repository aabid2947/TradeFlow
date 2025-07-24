import { apiSlice } from '@/app/api/apiSlice';

const REVIEWS_URL = '/reviews';
const SERVICES_URL = '/services';
const USERS_URL = '/users';

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a new review
    createReview: builder.mutation({
      query: (reviewData) => {
        console.log(builder,reviewData)
        return{
        url: REVIEWS_URL,
        method: 'POST',
        body: reviewData, 
      }},
      // Invalidates lists to refetch after creation
      invalidatesTags: (result, error, arg) => [
          { type: 'Review', id: 'LIST' }, 
          { type: 'Review', id: 'ME' },
          { type: 'Transaction', id: 'LIST' } // Invalidate transactions to reflect reviewed status
        ],
    }),

    // ** NEW ** Mutation to update a review
    updateReview: builder.mutation({
      query: ({ reviewId, ...reviewData }) => ({
        url: `${REVIEWS_URL}/${reviewId}`,
        method: 'PATCH', // Using PATCH as per backend spec
        body: reviewData, // { rating, comment }
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'ME' },
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

 
    getAllReviews: builder.query({
        query: () => ({
           
            url: `${REVIEWS_URL}/all`, 
            method: 'GET',
        }),
        providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Review', id: _id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),


    
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
