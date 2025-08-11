"use client"

import { Lock, Info, ShieldCheck, Globe, ChevronDown, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, logOut } from "@/features/auth/authSlice"

export default function TopBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logOut())
    navigate("/login")
  }

  return (
    <div className="bg-[#1E6F6B] text-white py-2 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-8 md:mx-3">
        {/* Right Section - Language Selector (Currently hidden) */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors duration-200">
          {/* <Globe className="w-4 h-4" />
          <span>English</span>
          <ChevronDown className="w-3 h-3" /> */}
        </div>
        
        {/* Left Section - Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {user ? (
            <>
              <button onClick={() => navigate("/how-to-get-verify")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
                <ShieldCheck className="w-4 h-4" />
                <span>How to get verified</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
             <button onClick={() => navigate("/how-to-get-verify")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
                <ShieldCheck className="w-4 h-4" />
                <span>How to get verified</span>
              </button>
              <button onClick={() => navigate("/login")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button onClick={() => navigate("/signup")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
                <Info className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}