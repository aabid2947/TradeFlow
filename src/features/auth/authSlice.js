// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Retrieve user data from localStorage to persist state across sessions
const storedUser = localStorage.getItem('user');
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action is called on successful login
    setCredentials: (state, action) => {
      console.log('🔐 setCredentials called with:', action.payload);
      
      // The backend now returns a 'data' object with the user and token
      const { data } = action.payload;
      
      const { token, ...userData } = data; // Separate the token from the rest of the user data

      console.log('🔐 Login - Token:', token);
      console.log('🔐 Login - User Data:', userData);

      state.user = userData; // Contains the full user object from login
      state.token = token;

      // Store the user object and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      console.log('🔐 Stored user in localStorage:', userData);
    },

    // --- IMPROVED UPDATE USER REDUCER ---
    updateUser: (state, action) => {
      console.log('👤 updateUser called with:', action.payload);
      console.log('👤 Current user before update:', state.user);
      
      const updatedUserData = action.payload;
      
      // Ensure we're updating the user object completely
      state.user = { 
        ...state.user, 
        ...updatedUserData,
        // Specifically ensure promotedCategories is updated
        promotedCategories: updatedUserData.promotedCategories || state.user?.promotedCategories || []
      };
      
      console.log('👤 Updated user after merge:', state.user);
      
      // Store the updated user object in localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
      
      console.log('👤 Stored updated user in localStorage');
    },

    // Force refresh user data (useful for debugging)
    refreshUser: (state, action) => {
      console.log('🔄 refreshUser called with:', action.payload);
      
      const freshUserData = action.payload;
      state.user = freshUserData;
      localStorage.setItem('user', JSON.stringify(freshUserData));
      
      console.log('🔄 Force refreshed user:', freshUserData);
    },

    // This action is called on logout
    logOut: (state) => {
      console.log('🚪 Logging out user');
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

// Export action creators
export const { setCredentials, logOut, updateUser, refreshUser } = authSlice.actions;

export default authSlice.reducer;

// Enhanced selectors with debugging
export const selectCurrentUser = (state) => {
  const user = state.auth.user;
  return user;
};

export const selectCurrentToken = (state) => state.auth.token;

export const selectCurrentUserRole = (state) => state.auth.user?.role;

// New selector specifically for promoted categories
export const selectPromotedCategories = (state) => {
  const categories = state.auth.user?.promotedCategories || [];
  console.log('🏷️ selectPromotedCategories called, returning:', categories);
  return categories;
};

// Helper selector for checking subscription status
export const selectIsSubscribedTo = (category) => (state) => {
  const categories = state.auth.user?.promotedCategories || [];
  const isSubscribed = categories.includes(category);
  console.log(`🔍 Checking subscription for "${category}":`, isSubscribed, 'Available categories:', categories);
  return isSubscribed;
};