"use client"

import { Lock, Info, ShieldCheck, Globe, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function TopBar() {
    const navigate = useNavigate()
  return (
    <div className="bg-[#1E6F6B] text-white py-2 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-8">
        {/* Left Section - Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button  onClick={()=>navigate("/login")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
            <Lock className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button onClick={()=>navigate("/signup")} className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
            <Info className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
          <button href="#" className="flex items-center gap-2 hover:text-gray-200 transition-colors duration-200">
            <ShieldCheck className="w-4 h-4" />
            <span>How to get verified</span>
          </button>
        </nav>

        {/* Right Section - Language Selector */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors duration-200">
          <Globe className="w-4 h-4" />
          <span>English</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}
