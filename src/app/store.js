// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApiSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: true, // Enable Redux DevTools
});