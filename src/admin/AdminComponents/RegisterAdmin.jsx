"use client"

import React, { useState, useEffect } from "react"
import { Trash2, UserPlus, CheckCircle, XCircle, Users, Shield, Mail, Lock, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSignupAdminMutation, useGetAllAdminQuery } from "@/app/api/authApiSlice"; // Adjust the import path as needed

// Mock UI components (as provided)
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
)

const CardHeader = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
)

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const Input = ({ className, ...props }) => (
  <input className={`w-full p-3 border rounded-lg ${className}`} {...props} />
)

const Button = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  }
  const sizes = {
    default: "px-4 py-2",
    icon: "p-2 w-10 h-10"
  }
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}

// Animated Input Component
function AnimatedInput({ icon: Icon, error, label, ...props }) {
  const [focused, setFocused] = useState(false)
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        {label}
      </label>
      <div className="relative">
        <Input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`pl-10 transition-all duration-300 ${
            error 
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
              : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } ${focused ? "transform scale-[1.02]" : ""}`}
        />
        <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
          focused ? "text-blue-500" : "text-gray-400"
        }`} />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Admin Card Component
function AdminCard({ admin, onDelete, index }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-bl-full" />
        
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
          >
            {admin.avatar}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">{admin.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{admin.email}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {admin.role || 'Admin'}
              </span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(admin.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function RegisterAdmin() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  
  // RTK Query hooks for API interaction
  const [signupAdmin, { isLoading: isSubmitting }] = useSignupAdminMutation();
  const { data: fetchedAdmins, isLoading: isLoadingAdmins, isError, error } = useGetAllAdminQuery();

  const admins = React.useMemo(() => {
    if (!fetchedAdmins) return [];
    console.log(fetchedAdmins)
    // Format data for the UI, creating avatars and mapping id
    return fetchedAdmins.data.map(admin => ({
      ...admin,
      id: admin._id, // Assuming the API returns _id
      avatar: admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    }));
  }, [fetchedAdmins]);
  
  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email format is invalid"
    if (!password.trim()) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (validateForm()) {
      try {
        await signupAdmin({ name, email, password }).unwrap();
        setMessage({ type: "success", text: `Admin ${name} registered successfully!` });
        setName("");
        setEmail("");
        setPassword("");
        setErrors({});
        setTimeout(() => setMessage(null), 4000);
      } catch (err) {
        setMessage({ type: "error", text: err.data?.message || "Failed to register admin" });
        setTimeout(() => setMessage(null), 4000);
      }
    } else {
      setMessage({ type: "error", text: "Please correct the errors in the form." });
      setTimeout(() => setMessage(null), 4000);
    }
  }

  const handleDelete = (id) => {
    // Note: Deleting is currently a UI-only action.
    // A 'deleteAdminMutation' would be needed for full functionality.
    const adminToDelete = admins.find(admin => admin.id === id);
    // setAdmins is removed as the source of truth is now the API via RTK Query.
    // To implement delete, a mutation is required.
    setMessage({ 
      type: "success", 
      text: `${adminToDelete?.name || 'Admin'} has been removed (UI only).` 
    });
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-lg ${
                message.type === "success" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
              }`}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                {message.type === "success" ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </motion.div>
              <p className="font-medium">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="xl:col-span-1">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <CardTitle className="text-2xl font-bold flex items-center gap-3 relative z-10">
                  <UserPlus className="w-7 h-7" /> Add New Admin
                </CardTitle>
                <p className="text-blue-100 mt-2 relative z-10">Create a new administrator account</p>
              </CardHeader>
              
              <CardContent className="space-y-6 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatedInput icon={User} label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter admin name" error={errors.name} />
                  <AnimatedInput icon={Mail} label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" error={errors.email} />
                  <AnimatedInput icon={Lock} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create secure password" error={errors.password} />
                  <motion.div whileTap={{ scale: 0.98 }} className="pt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          Creating Admin...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="w-5 h-5" /> Create Admin
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="xl:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-blue-600" /> Current Admins
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {isLoadingAdmins ? 'Loading...' : `${admins.length} administrator${admins.length !== 1 ? 's' : ''} registered`}
                    </p>
                  </div>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {admins.length} Active
                  </motion.div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <AnimatePresence mode="popLayout">
                  {isLoadingAdmins ? (
                    <div className="text-center py-12">Loading Admins...</div>
                  ) : isError ? (
                    <div className="text-center py-12 text-red-500">{error.message || 'Failed to fetch admins.'}</div>
                  ) : admins.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admins Yet</h3>
                      <p className="text-gray-500">Create your first admin to get started</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {admins.map((admin, index) => (
                        <AdminCard key={admin.id} admin={admin} onDelete={handleDelete} index={index} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}