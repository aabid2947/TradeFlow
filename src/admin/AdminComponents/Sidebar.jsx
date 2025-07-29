"use client"
import { Home, BarChart2, Users, ClipboardList, Info, MessageCircle, Sparkles, X } from "lucide-react"

// NOTE: Assuming these component paths are correct from your project structure.
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

// NOTE: Assuming sidebarLogo is correctly imported from your project structure.
// import sidebarLogo from "@/assets/sidebarLogo.svg"
// For v0 preview, we'll use a placeholder or remove it if not directly visible in the new design.

import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../features/auth/authSlice"

const navigationItems = [
  { title: "Dashboard", icon: Home, key: "dashboard" },
  { title: "Analytics", icon: BarChart2, key: "analytics" },
  { title: "Clients", icon: Users, key: "clients" },
  { title: "Orders", icon: Users, key: "orders" },
  { title: "Coupon", icon: ClipboardList, key: "coupons" },
  { title: "Services", icon: Info, key: "services" },
  { title: "Register", icon: MessageCircle, key: "register" },
  { title: "Feedback", icon: MessageCircle, key: "feedback" },
]

export default function AdminDashboardSidebar({ isOpen, setIsOpen, activeView, onNavigate }) {
  // Mock user data for v0 preview, replace with actual useSelector in your project
  const user = useSelector(selectCurrentUser) || {
    name: "Lucy Lavender",
    email: "lucy.lavender@example.com",
    role: "UX Designer",
    avatar: "/lucy-lavender.png", // Placeholder for the image
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
                        onClick={() => onNavigate(item.key)}
                        className={`cursor-pointer flex items-center gap-3 transition-all duration-150
                        ${
                          activeView === item.key
                            ? "text-white font-semibold" // Active state: white text, bold
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50" // Inactive state: gray text, hover effect
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
{/* 
              <div className="p-2 mt-4">
                <Card className="shadow-sm bg-gray-700 border-gray-600 text-white">
                  {" "}
                  <CardContent className="flex flex-col items-start gap-2 p-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" /> 
                    <h4 className="text-sm font-semibold text-white">Plan about to expire</h4>
                    <p className="text-xs text-gray-300">Enjoy 10% off when renewing your plan today.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-center w-full text-xs text-blue-300 hover:bg-gray-600 hover:text-white"
                    >
                      Renew Now
                    </Button>
                  </CardContent>
                </Card>
              </div> */}
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-700 bg-[#222736] fixed bottom-0 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar || "/avatar-placeholder.png"} alt={user?.name} />
                      <AvatarFallback className="bg-gray-600 text-white text-sm">
                        {user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#222736]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                  </div>
                </div>
                {/* Removed MoreVertical button as it's not in the image */}
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>
      {/* Overlay for mobile view. */}
      {isOpen && (
        <div
          className={`fixed inset-0 modal-overlay bg-transparent blur-bg-sm bg-opacity-30 backdrop-blur-sm z-30 lg:hidden transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
