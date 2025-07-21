
import { apiSlice } from "@/app/api/apiSlice";

const TRANSACTIONS_URL = '/transactions';

export const transactionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyTransactions: builder.query({
            query: () => ({
                url: `${TRANSACTIONS_URL}/me`,
                method: 'GET',
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: (result, error, arg) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Transaction', id: _id })),
                        { type: 'Transaction', id: 'LIST' },
                    ]
                    : [{ type: 'Transaction', id: 'LIST' }],
        }),
        getAllTransactions: builder.query({
            query: () => ({
                url: `${TRANSACTIONS_URL}/admin/all`,
                method: 'GET',
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: (result, error, arg) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: 'Transaction', id: _id })), { type: 'Transaction', id: 'LIST' }] : [{ type: 'Transaction', id: 'LIST' }],
        }),
    }),
});

export const { useGetMyTransactionsQuery, useGetAllTransactionsQuery } = transactionApiSlice;