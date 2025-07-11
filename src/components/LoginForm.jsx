"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingLabel } from "./FloatingLabel"
import { AuthCard } from "../cards/AuthCard"

// --- API INTEGRATION: STEP 1 ---
// Import the necessary hooks and actions from our new Redux structure
import { useLoginMutation } from "@/app/api/authApiSlice" // Adjust path if needed
import { setCredentials } from "@/features/auth/authSlice" // Adjust path if needed

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  // --- API INTEGRATION: STEP 2 ---
  // Instantiate hooks for navigation, Redux dispatch, and the API mutation
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error: apiError }] = useLoginMutation()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    // The 6-character check is good for UI feedback, but the server has the final say.
    // else if (formData.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters"
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- API INTEGRATION: STEP 3 ---
  // Update the handleSubmit function to call the real API
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      // Call the login mutation and `unwrap` it to handle success/error with try/catch.
      const response = await login(formData).unwrap()
      
      // On success, dispatch the `setCredentials` action.
      // The backend returns { success: true, data: { user, token } }
      // We pass the inner 'data' object to our action.
      dispatch(setCredentials({ user: response.data, accessToken: response.data.token }))
      
      // Navigate the user to the home page or dashboard.
      navigate("/")
      
    } catch (err) {
      // RTK Query places API error details in `err.data`.
      console.error("Failed to log in:", err)
      // The error can be displayed using the `apiError` object.
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
        <AuthCard title="Welcome Back" subtitle="Sign in to your account to continue">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- API INTEGRATION: STEP 4 (Optional but recommended) --- */}
            {/* Display a general error message from the API */}
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center text-sm" role="alert">
                {apiError.data?.message || "Invalid credentials. Please try again."}
              </div>
            )}

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
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#1987BF] border-gray-300 rounded focus:ring-[#1987BF] focus:ring-2"
                />
                <span className="text-gray-600">Remember me</span>
              </label>

              <button
                type="button"
                className="text-[#1987BF] hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <button
                type="button"
                className="text-[#1987BF] hover:text-blue-700 font-semibold transition-colors duration-200"
                onClick={() => navigate('/signup')} // Functional navigation
              >
                Sign up here
              </button>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}