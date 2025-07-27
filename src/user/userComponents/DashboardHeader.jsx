"use client"

import { Search, RotateCcw, ChevronDown, MoreVertical, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import userPic from "@/assets/UserImage.svg"
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

export default function DashboardHeader({ setSidebarOpen }) {
  const [welcomeText, setWelcomeText] = useState("");
  const user = useSelector(selectCurrentUser);
  const fullText = `Welcome Back, ${user?.name || 'User'}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setWelcomeText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [fullText]);

  const handleLogout = async () => {
    try {
      await dispatch(logOut());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100/50 px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left Section: Welcome text */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Hamburger button for mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
              <span className="text-gray-900">{welcomeText.substring(0, 13)}</span>
              {welcomeText.length > 13 && <span className="text-[#1987BF] font-bold">{welcomeText.substring(13)}</span>}
              {welcomeText.length < fullText.length && <span className="animate-pulse text-gray-900">|</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 hidden md:block">
              Here is the information about all your verifications
            </p>
          </div>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9 text-gray-600 hover:bg-gray-100" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9 text-gray-600 hover:bg-gray-100" aria-label="Refresh data">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 flex items-center gap-2 rounded-full hover:bg-gray-100" aria-label="User profile menu">
                <Avatar className="h-7 w-7 border border-gray-200">
                  <AvatarImage src={userPic} alt={user?.name} />
                  <AvatarFallback className="bg-[#1987BF]/10 text-[#1987BF] text-xs font-medium">RS</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 hidden lg:inline">{user?.name}</span>
                <ChevronDown className="h-3 w-3 text-gray-500 hidden lg:inline" />
                <MoreVertical className="h-4 w-4 text-gray-500 lg:hidden" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border rounded-lg shadow-lg p-1">
              <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}