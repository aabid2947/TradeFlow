// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Retrieve user data from localStorage to persist state across sessions
const storedUser = localStorage.getItem('user');
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null, // The user object { _id, name, email, role }
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action is called on successful login
    setCredentials: (state, action) => {
      // The backend now returns a 'data' object with the user and token
      const { data } = action.payload;
      const { token, ...userData } = data; // Separate the token from the rest of the user data

      state.user = userData; // Contains { _id, name, email, role }
      state.token = token;

      // Store the user object and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },
    // This action is called on logout
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access to the user state
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUserRole = (state) => state.auth.user?.role;