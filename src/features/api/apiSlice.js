import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logout } from '../auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = getState().auth.token
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  
  // If we get a 401, check if this is a protected endpoint before trying to refresh
  // if (result.error && result.error.status === 401) {
  //   const url = typeof args === 'string' ? args : args.url
    
  //   // List of public endpoints that don't require authentication
  //   const publicEndpoints = ['/listings']
  //   const isPublicEndpoint = publicEndpoints.some(endpoint => url.includes(endpoint) && !url.includes('/my-listings'))
    
  //   // If it's a public endpoint, don't try to refresh token or logout
  //   if (isPublicEndpoint) {
  //     return result
  //   }
    
  //   const refreshToken = api.getState().auth.refreshToken
    
  //   if (refreshToken) {
  //     // Try to refresh the token
  //     const refreshResult = await baseQuery(
  //       {
  //         url: '/users/refresh-token',
  //         method: 'POST',
  //         body: { refreshToken }
  //       },
  //       api,
  //       extraOptions
  //     )
      
  //     if (refreshResult.data && refreshResult.data.success) {
  //       // Store the new token
  //       api.dispatch(setCredentials({
  //         user: api.getState().auth.user,
  //         token: refreshResult.data.data.token,
  //         refreshToken: refreshResult.data.data.refreshToken
  //       }))
  //       // Retry the original query
  //       result = await baseQuery(args, api, extraOptions)
  //     } else {
  //       // Refresh failed, logout user
  //       api.dispatch(logout())
  //     }
  //   } else {
  //     api.dispatch(logout())
  //   }
  // }
  
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile', 'Listing', 'Trade', 'Chat', 'Message'],
  endpoints: (builder) => ({
    // Authentication endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    googleAuth: builder.mutation({
      query: (googleData) => ({
        url: '/users/google-auth',
        method: 'POST',
        body: googleData,
      }),
    }),
    
    logout: builder.mutation({
      query: (body) => ({
        url: '/users/logout',
        method: 'POST',
        body: body || {},
      }),
    }),
    
    logoutAll: builder.mutation({
      query: () => ({
        url: '/users/logout-all',
        method: 'POST',
      }),
    }),
    
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/users/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    // Profile endpoints
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['Profile'],
    }),
    
    // Dashboard stats endpoint
    getDashboardStats: builder.query({
      query: () => '/users/dashboard-stats',
      providesTags: ['Profile', 'Trade', 'Listing'],
    }),
    
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
    // User management endpoints
    getAllUsers: builder.query({
      query: () => '/users/all',
      providesTags: ['User'],
    }),
    
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    transferTokens: builder.mutation({
      query: (transferData) => ({
        url: '/users/transfer-tokens',
        method: 'POST',
        body: transferData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    deactivateAccount: builder.mutation({
      query: () => ({
        url: '/users/deactivate',
        method: 'PUT',
      }),
    }),

    // Listing endpoints
    createListing: builder.mutation({
      query: (listingData) => ({
        url: '/listings',
        method: 'POST',
        body: listingData,
      }),
      invalidatesTags: ['Listing', 'Profile'],
    }),

    getActiveListings: builder.query({
      query: () => ({
        url: '/listings',
        method: 'GET'
      }),
      providesTags: ['Listing'],
      // Don't retry on auth failures for this public endpoint
      transformErrorResponse: (response) => {
        // If it's a 401 on listings, it's likely because the backend route needs fixing
        // Don't trigger logout for this endpoint
        return response
      }
    }),

    getMyListings: builder.query({
      query: () => '/listings/my-listings',
      providesTags: ['Listing'],
    }),

    updateListing: builder.mutation({
      query: ({ id, ...listingData }) => ({
        url: `/listings/${id}`,
        method: 'PUT',
        body: listingData,
      }),
      invalidatesTags: ['Listing'],
    }),

    // Trade endpoints
    initiateTrade: builder.mutation({
      query: (tradeData) => ({
        url: '/trades/initiate',
        method: 'POST',
        body: tradeData,
      }),
      invalidatesTags: ['Trade', 'Profile', 'Listing'],
    }),

    getTradeDetails: builder.query({
      query: (tradeId) => `/trades/${tradeId}`,
      providesTags: (result, error, tradeId) => [{ type: 'Trade', id: tradeId }],
    }),

    confirmPayment: builder.mutation({
      query: (tradeId) => ({
        url: `/trades/${tradeId}/confirm-payment`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, tradeId) => [{ type: 'Trade', id: tradeId }],
    }),

    completeTrade: builder.mutation({
      query: (tradeId) => ({
        url: `/trades/${tradeId}/complete-trade`,
        method: 'POST',
      }),
      invalidatesTags: ['Trade', 'Profile', 'Listing'],
    }),

    // Get user trades
    getUserTrades: builder.query({
      query: ({ status, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (status) params.append('status', status);
        return `/trades/my-trades?${params}`;
      },
      providesTags: ['Trade'],
    }),

    // Get pending trades for seller (notifications)
    getPendingTrades: builder.query({
      query: () => '/trades/pending-for-me',
      providesTags: ['Trade'],
    }),

    // Payment endpoints
    createPaymentOrder: builder.mutation({
      query: (orderData) => ({
        url: '/payments/create-order',
        method: 'POST',
        body: orderData,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/verify-payment',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Profile'], // Invalidate profile to refresh balance
    }),

    // Withdrawal endpoints
    withdrawFunTokens: builder.mutation({
      query: (withdrawalData) => ({
        url: '/payments/withdraw',
        method: 'POST',
        body: withdrawalData,
      }),
      invalidatesTags: ['Profile', 'WithdrawalHistory'], // Invalidate profile to refresh balance and withdrawal history
    }),

    getWithdrawalHistory: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/payments/withdrawals?page=${page}&limit=${limit}`,
      providesTags: ['WithdrawalHistory'],
    }),

    // Chat endpoints
    startChat: builder.mutation({
      query: (chatData) => ({
        url: '/chats/start',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: ['Chat'],
    }),

    getUserChats: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams({ 
          page: page.toString(), 
          limit: limit.toString() 
        });
        return `/chats?${params}`;
      },
      providesTags: ['Chat'],
    }),

    getChatDetails: builder.query({
      query: (chatId) => `/chats/${chatId}`,
      providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, ...messageData }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Chat', id: chatId },
        { type: 'Message', id: chatId },
        'Chat' // Invalidate chat list to update last message
      ],
    }),

    getChatMessages: builder.query({
      query: ({ chatId, page = 1, limit = 50 }) => {
        const params = new URLSearchParams({ 
          page: page.toString(), 
          limit: limit.toString() 
        });
        return `/chats/${chatId}/messages?${params}`;
      },
      providesTags: (result, error, { chatId }) => [{ type: 'Message', id: chatId }],
    }),

    markMessagesAsRead: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}/messages/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, chatId) => [
        { type: 'Chat', id: chatId },
        { type: 'Message', id: chatId },
        'Chat'
      ],
    }),

    getUnreadCount: builder.query({
      query: () => '/chats/unread-count',
      providesTags: ['Chat'],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),

    // Store message to backend for reference (used with Firebase)
    storeMessage: builder.mutation({
      query: (messageData) => ({
        url: '/chats/store-message',
        method: 'POST',
        body: messageData,
      }),
      // Don't invalidate tags since this is just for reference storage
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useGetDashboardStatsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  useTransferTokensMutation,
  useDeactivateAccountMutation,
  // Listing hooks
  useCreateListingMutation,
  useGetActiveListingsQuery,
  useGetMyListingsQuery,
  useUpdateListingMutation,
  // Trade hooks
  useInitiateTradeMutation,
  useGetTradeDetailsQuery,
  useConfirmPaymentMutation,
  useCompleteTradeMutation,
  useGetUserTradesQuery,
  useGetPendingTradesQuery,
  // Payment hooks
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  // Withdrawal hooks
  useWithdrawFunTokensMutation,
  useGetWithdrawalHistoryQuery,
  // Chat hooks
  useStartChatMutation,
  useGetUserChatsQuery,
  useGetChatDetailsQuery,
  useSendMessageMutation,
  useGetChatMessagesQuery,
  useMarkMessagesAsReadMutation,
  useGetUnreadCountQuery,
  useDeleteChatMutation,
  useStoreMessageMutation,
} = apiSlice
