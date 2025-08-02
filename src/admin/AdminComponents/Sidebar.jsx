"use client"
import { Home, BarChart2, Users, ClipboardList, Info, MessageCircle, Sparkles, X } from "lucide-react"

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

import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../features/auth/authSlice"

const navigationItems = [
  { title: "Dashboard", icon: Home, key: "dashboard" },
  { title: "Analytics", icon: BarChart2, key: "analytics" },
  { title: "Users", icon: Users, key: "shared" }, // Renamed for clarity
  { title: "Orders", icon: ClipboardList, key: "orders" },
  { title: "Coupons", icon: Sparkles, key: "coupons" }, // Used Sparkles for coupons
  { title: "Services", icon: Info, key: "services" },
  { title: "Register Admin", icon: Users, key: "register" }, // Renamed for clarity
  { title: "Feedback", icon: MessageCircle, key: "feedback" },
  { title: "My Profile", icon: ProfileIcon, key: "profile" }, // Added Profile
]

export default function AdminDashboardSidebar({ isOpen, setIsOpen, activeView, onNavigate }) {
  const user = useSelector(selectCurrentUser) || {
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    avatar: "/avatar-placeholder.png",
  }
  
  // A helper function to handle navigation and close the sidebar on mobile
  const handleNavigationClick = (viewKey) => {
    onNavigate(viewKey);
    if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint
        setIsOpen(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#2A3042] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarProvider>
          <Sidebar collapsible="none" className="flex flex-col h-full">
            <SidebarHeader className="p-4 border-b border-gray-700 flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-5 bg-blue-500 rounded-full" />
                  <div className="w-2 h-5 bg-blue-500 rounded-full" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3" />
                </div>
                <span className="text-white text-2xl font-bold">VerifyKyc</span>
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-1">PRO</span>
              </div>
              {/* --- THIS IS THE NEW CLOSE BUTTON --- */}
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
                        ${
                          activeView === item.key
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

            <SidebarFooter className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar || "/avatar-placeholder.png"} alt={user?.name} />
                      <AvatarFallback className="bg-gray-600 text-white text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                  </div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>
      {/* Overlay for mobile view. This was already correctly implemented. */}
      {isOpen && (
        <div
          className={`fixed inset-0 modal-overlay bg-black bg-opacity-30 backdrop-blur-sm z-30 lg:hidden transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
