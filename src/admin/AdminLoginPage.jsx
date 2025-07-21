

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/features/auth/authSlice"
import { useLoginMutation } from "@/app/api/authApiSlice" // <-- Use the standard login mutation


export default function AdminLoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [apiError, setApiError] = useState("")

  const validateForm = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!password) {
      newErrors.password = "Password is required"
    }
    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")
    if (!validateForm()) return

    const formData = { email, password }

    try {
      const response = await login(formData).unwrap()
      
      if (response.data.role !== 'admin') {
        setApiError("Access denied. You do not have admin privileges.")
        return; 
      }

      dispatch(setCredentials(response))
      
      // Navigate the admin to their dashboard on success
      navigate("/admin")
      
    } catch (err) {
      const errorMessage = err.data?.message || 'Login failed. Please check your credentials.'
      setApiError(errorMessage)
      console.error("Failed to log in as admin:", err)
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
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02]"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
