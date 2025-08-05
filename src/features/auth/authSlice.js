// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('user');
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
  isLoading: false, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action will be called once Firebase has determined the auth state.
    setAuthReady: (state) => {
      state.isLoading = false;
    },
    
    setCredentials: (state, action) => {
      const { data } = action.payload;
      const { token, ...userData } = data;

      state.user = userData;
      state.token = token;
      state.isLoading = false; 

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },

    updateUser: (state, action) => {
      const updatedUserData = action.payload;
      state.user = { 
        ...state.user, 
        ...updatedUserData,
        promotedCategories: updatedUserData.promotedCategories || state.user?.promotedCategories || []
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },

    refreshUser: (state, action) => {
      const freshUserData = action.payload;
      state.user = freshUserData;
      localStorage.setItem('user', JSON.stringify(freshUserData));
    },

    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

// Export action creators
export const { setAuthReady, setCredentials, logOut, updateUser, refreshUser } = authSlice.actions; 

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUserRole = (state) => state.auth.user?.role;
export const selectIsAuthLoading = (state) => state.auth.isLoading; 
export const selectPromotedCategories = (state) => state.auth.user?.promotedCategories || [];
export const selectIsSubscribedTo = (category) => (state) => {
  const categories = state.auth.user?.promotedCategories || [];
  return categories.includes(category);
};