// src/features/service/serviceDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Stores the data object returned from a successful verification call
  verificationResult: null, 
  // Tracks the loading state of the verification process
  isLoading: false,
  // Stores any error message if the verification fails
  error: null,
};

const serviceDataSlice = createSlice({
  name: 'serviceData',
  initialState,
  reducers: {
    // Action to be called when the API call starts
    verificationPending: (state) => {
      state.isLoading = true;
      state.error = null;
      state.verificationResult = null;
    },
    // Action to be called on a successful API response
    verificationSuccess: (state, action) => {
      state.isLoading = false;
      state.verificationResult = action.payload; // Set the result data
    },
    // Action to be called on a failed API response
    verificationFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // Set the error message
    },
    // Action to clear the result and error, e.g., when the user navigates away
    clearVerificationState: (state) => {
      state.verificationResult = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

// Export the actions
export const {
  verificationPending,
  verificationSuccess,
  verificationFailed,
  clearVerificationState,
} = serviceDataSlice.actions;

// Export the reducer to be added to the store
export default serviceDataSlice.reducer;

// Export selectors for easy access in components
export const selectVerificationResult = (state) => state.serviceData.verificationResult;
export const selectVerificationIsLoading = (state) => state.serviceData.isLoading;
export const selectVerificationError = (state) => state.serviceData.error;