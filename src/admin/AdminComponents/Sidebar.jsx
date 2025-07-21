"use client"

import {
  Home,
  BarChart2,
  Users,
  ClipboardList,
  Info,
  MessageCircle,
  Sparkles,
  MoreVertical,
  X, // Import the 'X' icon for the close button
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import sidebarLogo from "@/assets/sidebarLogo.svg"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../features/auth/authSlice"


const navigationItems = [
  { title: "Dashboard", icon: Home, key: "dashboard" },
  { title: "Analytics", icon: BarChart2, key: "analytics" },
  { title: "Clients", icon: Users, key: "clients" },
  { title: "Coupon", icon: ClipboardList, key: "coupons" },
  { title: "Services", icon: Info, key: "services" },
  { title: "Register", icon: MessageCircle, key: "register" },
  { title: "Feedback", icon: MessageCircle, key: "feedback" },
];

export default function AdminDashboardSidebar({ isOpen, setIsOpen, activeView, onNavigate }) {
  const user = useSelector(selectCurrentUser)
  return (
    <>


      <div
        className={`fixed inset-y-0 left-0 z-40 w-64  bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarProvider>
          <Sidebar collapsible="none" className="flex flex-col h-full">
            <SidebarHeader className="p-4 border-b border-gray-100 flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={sidebarLogo} alt="Logo" className="h-12" />
              </div>
              <button onClick={() => setIsOpen(false)} className="cursor-pointer lg:hidden p-1">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </SidebarHeader>

            <SidebarContent className="flex-1 p-2 overflow-y-auto">
              <SidebarGroup>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.key)}
                        className={`cursor-pointer
    flex items-center gap-3 
    transition-all duration-150
    ${activeView === item.key
                            ? 'text-[#1A89C1] font-bold border border-2 bg-[#1A89C1]/10 border-[#1A89C1] px-4 py-3 rounded-lg'
                            : 'text-gray-700 hover:text-gray-900 px-3 py-2'}
  `}
                      >
                        <item.icon
                          className={`w-5 h-5 ${activeView === item.key ? 'text-[#1A89C1]' : 'text-gray-500'
                            }`}
                        />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              <div className="p-2 ">
                <Card className="shadow-sm bg-gray-50 border-gray-200">
                  <CardContent className="flex flex-col items-start gap-2 p-4">
                    <Sparkles className="w-5 h-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Plan about to expire</h4>
                    <p className="text-xs text-gray-600">Enjoy 10% off when renewing your plan today.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-center w-full  text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Renew Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="https://placehold.co/36x36/E2E8F0/4A5568?text=RC" alt={user?.name} />
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-36 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>

      {/* Overlay for mobile view.
        It appears when the sidebar is open and covers the main content.
        Clicking the overlay will close the sidebar. It's hidden on large screens.
      */}
      {isOpen && (
        <div
          className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-30 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
