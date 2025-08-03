import { apiSlice } from './apiSlice';

const PRICING_URL = '/pricing';

export const pricingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPricingPlans: builder.query({
      query: () => ({
        url: PRICING_URL,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'PricingPlan', id: _id })),
              { type: 'PricingPlan', id: 'LIST' },
            ]
          : [{ type: 'PricingPlan', id: 'LIST' }],
      // Keep this data for a while as it doesn't change often
      keepUnusedDataFor: 3600, 
    }),
  }),
});

export const { useGetPricingPlansQuery } = pricingApiSlice;