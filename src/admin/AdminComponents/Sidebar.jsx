"use client"
import { Home, BarChart2, Users, MoreVertical, User, LogOut, Settings, ClipboardList, Info, MessageCircle, Sparkles, X } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import userPic from "@/assets/UserImage.svg"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser } from "../../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/auth/authSlice"

const navigationItems = [
  { title: "Dashboard", icon: Home, key: "dashboard" },
  { title: "Analytics", icon: BarChart2, key: "analytics" },
 // Renamed for clarity
  { title: "Orders", icon: ClipboardList, key: "orders" },
  { title: "Coupons", icon: Sparkles, key: "coupons" }, // Used Sparkles for coupons
  { title: "Services", icon: Info, key: "services" },
  { title: "Register Admin", icon: Users, key: "register" }, // Renamed for clarity
  { title: "Feedback", icon: MessageCircle, key: "feedback" },
    { title: "Shared Dashboard", icon: Users, key: "shared" },
  { title: "Blog", icon: MessageCircle, key: "blog" },

]

export default function AdminDashboardSidebar({ isOpen, setIsOpen, activeView, onNavigate }) {
  const user = useSelector(selectCurrentUser) || {
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    avatar: "/avatar-placeholder.png",
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // A helper function to handle navigation and close the sidebar on mobile
  const handleNavigationClick = (viewKey) => {
    onNavigate(viewKey);
    if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint
      setIsOpen(false);
    }
  }

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
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#2A3042] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarProvider>
          <Sidebar collapsible="none" className="flex flex-col h-full">
            <SidebarHeader className="p-4 border-b border-gray-700 flex flex-row justify-between items-center cursor-pointer" >
              <div className="flex items-center gap-2 ">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-5 bg-blue-500 rounded-full" />
                  <div className="w-2 h-5 bg-blue-500 rounded-full" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3" />
                </div>
                <span className="text-white text-2xl font-bold">VerifyKyc</span>
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-1">PRO</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="cursor-pointer lg:hidden p-1">
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </SidebarHeader>
            <SidebarContent className="flex-1 p-2 overflow-y-auto">
              <SidebarGroup>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => handleNavigationClick(item.key)}
                        className={`cursor-pointer flex items-center gap-3 transition-all duration-150
                        ${activeView === item.key
                            ? "text-white font-semibold bg-gray-700/60" // Active state with background
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50" // Inactive state
                          }
                        px-3 py-2 rounded-lg`}
                      >
                        <item.icon className={`w-5 h-5 ${activeView === item.key ? "text-white" : "text-gray-400"}`} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4  border-t border-gray-700 absolute bottom-0 w-full cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                     <Avatar className="h-7 w-7 border border-gray-200">
          {user.avatar && user.avatar.trim() !== '' && <AvatarImage src={user.avatar} alt={user?.name} />}
          <AvatarFallback 
            className="text-white text-xs font-medium"
            style={{ backgroundColor: avatarBgColor }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                      aria-label="User menu"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    {/* <DropdownMenuItem
                      onClick={() => onNavigate('profile')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 cursor-pointer rounded-none"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">My Profile</span>
                    </DropdownMenuItem> */}

                    {/* <DropdownMenuItem 
        disabled 
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 cursor-not-allowed rounded-none opacity-50"
      >
        <Settings className="w-4 h-4 text-gray-400" />
        <span className="font-medium">Settings</span>
      </DropdownMenuItem> */}

                    {/* <div className="h-px bg-gray-200 mx-2 my-1"></div> */}

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:bg-red-50 cursor-pointer rounded-none"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>
      {/* Overlay for mobile view. This was already correctly implemented. */}
      {isOpen && (
        <div
          className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-30 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
