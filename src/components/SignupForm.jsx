// SignUpForm.jsx - (This file would likely be in src/pages/SignUpPage.jsx or a similar components folder)

"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/cards/AuthCard"
import { FloatingLabel } from "@/components/FloatingLabel"

// --- API INTEGRATION: STEP 1 ---
// Import the necessary hooks and actions
import { useSignupMutation } from "@/features/auth/authApiSlice" // Adjust path as needed
import { setCredentials } from "@/features/auth/authSlice" // Adjust path as needed

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // --- API INTEGRATION: STEP 2 ---
  // Instantiate hooks for navigation, dispatch, and our API mutation.
  // The `useSignupMutation` hook returns:
  // 1. A trigger function (`signup`) to call the API.
  // 2. An object with the mutation's state (`isLoading`, `isSuccess`, `error`, etc.).
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading, error: apiError }] = useSignupMutation()

  // This client-side validation remains unchanged. It's good practice
  // to validate on the client before sending a request.
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Full name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- API INTEGRATION: STEP 3 ---
  // Update the handleSubmit function to call the real API.
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      // The backend only needs name, email, and password.
      const { name, email, password } = formData
      
      // Call the signup mutation and `unwrap()` it to handle success/error with try/catch.
      const userData = await signup({ name, email, password }).unwrap()

      // On success, dispatch the `setCredentials` action to save the token/user in Redux.
      dispatch(setCredentials(userData))
      
      // Navigate the user to the home page or dashboard.
      navigate("/")
      
    } catch (err) {
      // RTK Query places API error details in `err.data`.
      // You can use this to display server-side validation errors.
      console.error("Failed to sign up:", err)
      if (err.data?.message) {
        // You could set a general error message state here if you wish.
        // For now, we'll rely on the `apiError` object rendered below.
      }
    }
  }

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthCard title="Create Account" subtitle="Join thousands of users who trust our platform">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- API INTEGRATION: STEP 4 (Optional but recommended) --- */}
            {/* Display a general error message from the API */}
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center text-sm" role="alert">
                {apiError.data?.message || "An error occurred during signup."}
              </div>
            )}
            
            <FloatingLabel
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={errors.name}
              icon={User}
              type="text"
              autoComplete="name"
            />

            <FloatingLabel
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              icon={Mail}
              type="email"
              autoComplete="email"
            />

            <FloatingLabel
              label="Password"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
              icon={Lock}
              type="password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
            />

            <FloatingLabel
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={errors.confirmPassword}
              icon={Lock}
              type="password"
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              autoComplete="new-password"
            />

            {/* No changes needed below, the UI elements will automatically work */}
            {/* with the `isLoading` state provided by the `useSignupMutation` hook. */}

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-[#1987BF] border-gray-300 rounded focus:ring-[#1987BF] focus:ring-2 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <button type="button" className="text-[#1987BF] hover:text-blue-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#1987BF] hover:text-blue-700 font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-[#1987BF] hover:text-blue-700 font-semibold transition-colors duration-200"
                onClick={() => navigate('/login')} // Make this button functional
              >
                Log in here
              </button>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}