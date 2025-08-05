"use client"

import { Search, RotateCcw, ChevronDown, MoreVertical, Menu, X, User,LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import userPic from "@/assets/UserImage.svg"
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import sidebarLogo from "@/assets/sidebarLogo.svg"

export default function DashboardHeader({ sidebarOpen, setSidebarOpen }) {
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

  const handleNavigateProfile = () => {
      // Navigate to the same dashboard URL but pass 'profile' in the state
      // The UserDashBoard component will detect this and switch its view.
      navigate('/user', { state: { view: 'profile' }, replace: true });
  };

  const toggleSidebar = () => {
    console.log(!sidebarOpen)
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100/50 px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-full transition-all duration-200 ease-in-out text-gray-600 hover:bg-gray-100"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center overflow-hidden " onClick={() => navigate("/")}>
            <img src={sidebarLogo} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="flex flex-col">
            <h1 className="hidden md:block text-lg font-semibold text-gray-900 md:text-xl">
              <span>{welcomeText.substring(0, 13)}</span>
              {welcomeText.length > 13 && <span className="text-[#1987BF] font-bold">{welcomeText.substring(13)}</span>}
              {welcomeText.length < fullText.length && <span className="animate-pulse text-gray-900">|</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 hidden md:block">
              Here is the information about all your verifications
            </p>
          </div>
        </div>

        {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-9 px-2 flex items-center gap-2 rounded-full hover:bg-gray-100" aria-label="User profile menu">
        <Avatar className="h-7 w-7 border border-gray-200">
          <AvatarImage src={user.avatar} alt={user?.name} />
          <AvatarFallback className="bg-[#1987BF]/10 text-[#1987BF] text-xs font-medium">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700 hidden lg:inline">{user?.name}</span>
        <ChevronDown className="h-3 w-3 text-gray-500 hidden lg:inline" />
        <MoreVertical className="h-4 w-4 text-gray-500 lg:hidden" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
      <DropdownMenuItem 
        onClick={handleNavigateProfile} 
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 cursor-pointer rounded-none"
      >
        <User className="w-4 h-4 text-gray-500" />
        <span className="font-medium">My Profile</span>
      </DropdownMenuItem>
      
      <div className="h-px bg-gray-200 mx-2 my-1"></div>
      
      <DropdownMenuItem 
        onClick={handleLogout} 
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:bg-red-50 cursor-pointer rounded-none"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span className="font-medium">Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
      </div>
    </header>
  )
}