// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entity: null, // Can be either a user or an admin object
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null, // 'user' or 'admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, admin, accessToken } = action.payload;
      
      if (user) {
        state.entity = user;
        state.role = 'user';
        localStorage.setItem('role', 'user');
      } else if (admin) {
        state.entity = admin;
        state.role = 'admin';
        localStorage.setItem('role', 'admin');
      }
      
      state.token = accessToken;
      localStorage.setItem('token', accessToken);
    },
    logOut: (state) => {
      state.entity = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access to state
export const selectCurrentEntity = (state) => state.auth.entity;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;