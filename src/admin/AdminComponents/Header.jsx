"use client"
import { useEffect, useState } from "react"
import { ChevronDown, Menu, User, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import userPic from "@/assets/UserImage.svg"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"

export default function Header({ onMenuClick, onNavigate }) {
  const [welcomeText, setWelcomeText] = useState("");
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullText = `Welcome Back, ${user?.name || 'User'}`;

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

  const generateRandomColor = (name) => {
  if (!name) return '#1987BF';
  
  const colors = [
    '#1987BF', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#3498db', '#8e44ad',
    '#27ae60', '#f1c40f', '#e74c3c', '#95a5a6', '#d35400'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
 const avatarBgColor = generateRandomColor(user?.name);


  
  const handleLogout = async () => {
    try {
      // You might not need unwrap() if you don't need to handle the promise here
      dispatch(logOut());
      navigate("/"); // Redirect to home or login page after logout
    }
    catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="fixed top-0 right-0 z-30 left-0 lg:left-64 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
            {/* Left Section: Includes hamburger for mobile and title */}
            <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onMenuClick} 
                  className="lg:hidden" // Only show on screens smaller than lg (1024px)
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </Button>

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

            {/* Right Section - Profile Dropdown */}
           <div className="flex items-center gap-3">
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-2 hover:bg-gray-100 flex items-center gap-2 rounded-full">
            <Avatar className="h-7 w-7 border border-gray-200">
          {user.avatar && user.avatar.trim() !== '' && <AvatarImage src={user.avatar} alt={user?.name} />}
          <AvatarFallback 
            className="text-white text-xs font-medium"
            style={{ backgroundColor: avatarBgColor }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
            {/* <DropdownMenuItem 
                onClick={() => onNavigate('profile')} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 cursor-pointer rounded-none"
            >
               <User className="w-4 h-4 text-gray-500" />
               <span className="font-medium">Profile</span>
            </DropdownMenuItem> */}
            
      
            {/* <div className="h-px bg-gray-200 mx-2 my-1"></div> */}
            
            <DropdownMenuItem 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 transition-colors duration-150 focus:outline-none cursor-pointer rounded-none"
            >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="font-medium">Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>
        </div>
    </header>
  )
}