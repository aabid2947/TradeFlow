"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { setCredentials } from "@/features/auth/authSlice"
import { useAdminLoginMutation } from "@/app/api/adminApiSlice"
import { useDispatch } from "react-redux"

export default function AdminLoginPage() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [Error,setError] = useState("")
    const [login, { isLoading, error: apiError }] = useAdminLoginMutation()
  const navigate = useNavigate()

  const validateForm = (formData) => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }
   

    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

   const handleSubmit = async (e) => {
    setLoading(true)
     e.preventDefault()
     const formData = {
       "email":email,
       "password":password
     }
     if (!validateForm(formData)) return
 
     try {
       // Call the login mutation and `unwrap` it to handle success/error with try/catch.
       const response = await login(formData).unwrap()
       
       // On success, dispatch the `setCredentials` action.
       // The backend returns { success: true, data: { user, token } }
       // We pass the inner 'data' object to our action.
       dispatch(setCredentials({ admin: response.data, accessToken: response.data.token }))
       
       // Navigate the user to the home page or dashboard.
       navigate("/admin")
       
     } catch (err) {
       // RTK Query places API error details in `err.data`.
       console.error("Failed to log in:", err)
       // The error can be displayed using the `apiError` object.
     }
     finally{
      setLoading(false)
     }
   }
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
         {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center text-sm" role="alert">
                {apiError.data?.message || "Invalid credentials. Please try again."}
              </div>
            )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
