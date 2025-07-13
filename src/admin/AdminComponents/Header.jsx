import { Search, RotateCcw, ChevronDown, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import userPic from "@/assets/UserImage.svg"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"

// The header now accepts an onMenuClick function to toggle the sidebar on mobile
export default function Header({ onMenuClick }) {
  const [welcomeText, setWelcomeText] = useState("")
  const fullText = "Welcome Back, Rahul Singh"
  const dispatch = useDispatch()

  
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setWelcomeText(fullText.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100) // Adjust typing speed here
    
    return () => clearInterval(typingInterval)
  }, [])
    const handleLogout = async () => {
    try {
      await dispatch(logOut())
      navigate("/"); // redirect after logout
    }
    catch (error) {
      console.error()
    }

  }

  return (
    <header className="w-full bg-white p-4 md:border-b md:border-gray-100">
      <div className="flex items-center justify-between">
        {/* Left Section: Includes hamburger for mobile and welcome text */}
        <div className="flex items-center gap-4">
          {/* Hamburger button, only visible on mobile screens */}
          <button onClick={onMenuClick} className="cursor-pointer text-gray-600 hover:text-gray-900 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          {/* Welcome Text */}
          <div className="hidden lg:flex flex-col">
            <h1 className="text-lg text-start font-semibold text-gray-900 md:text-xl">
              <span className="text-gray-900">{welcomeText.substring(0, 13)}</span>
              {welcomeText.length > 13 && (
                <span className="text-blue-600">{welcomeText.substring(13)}</span>
              )}
              {/* Cursor animation */}
              {welcomeText.length < fullText.length && (
                <span className="animate-pulse">|</span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1 hidden lg:block">
              Here is the information about all your verifications
            </p>
          </div>
        </div>

        {/* Right Section - Actions and Profile - Hidden on mobile */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:h-9 md:w-9 hover:bg-gray-100">
            <Search className="hidden md:h-4 md:w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:h-9 md:w-9  hover:bg-gray-100">
            <RotateCcw className="hidden md:h-4 md:w-4 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 hover:bg-gray-100 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userPic}alt="Rahul Singh" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">RS</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Rahul Singh</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cursor-pointer w-48 bg-white border-[#1A89C1] ">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem  className="cursor-pointer" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}