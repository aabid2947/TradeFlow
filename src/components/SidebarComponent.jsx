import {
  Search,
  LayoutDashboard,
  Shield,
  Building2,
  FileCheck,
  Users,
  ScanText,
  BarChart3,
  PieChart,
  DollarSign,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import sidebarLogo from "../assets/sidebarLogo.svg"
import userPic from "../assets/UserImage.svg"

const navigationData = {
  dashboard: [{ title: "Dashboard", icon: LayoutDashboard, url: "#", iconColor: "text-orange-500" }],
  services: [
    { title: "Verification API", icon: Shield, url: "#" },
    { title: "KYC Verification", icon: Shield, url: "#", isActive: true },
    { title: "Banking Verification", icon: Building2, url: "#" },
    { title: "Business Verification", icon: Building2, url: "#" },
    { title: "Employment Check", icon: Users, url: "#" },
    { title: "Document Check", icon: FileCheck, url: "#" },
    { title: "Document OCR", icon: ScanText, url: "#" },
     // Adding more items to demonstrate scrolling
    { title: "Service Item 1", icon: Shield, url: "#" },
    { title: "Service Item 2", icon: Shield, url: "#" },
    { title: "Service Item 3", icon: Shield, url: "#" },
  ],
  reports: [
    { title: "Account Report", icon: BarChart3, url: "#" },
    { title: "Data Analytics", icon: PieChart, url: "#" },
 
  ],
  pricing: [   { title: "Report Item 1", icon: BarChart3, url: "#" },
    { title: "Report Item 2", icon: BarChart3, url: "#" }],
}

// CSS for the modern scrollbar is injected via a style tag
const scrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .modern-scrollbar::-webkit-scrollbar-track {
    background-color: #f8fafc; /* slate-50 */
  }
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0; /* slate-200 */
    border-radius: 0px; /* Rectangular corners */
  }
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1; /* slate-300 */
  }
  /* For Firefox */
  .modern-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 #f8fafc;
  }
`

export default function SidebarComponent({ isOpen, setIsOpen }) {
  const [isServicesOpen, setIsServicesOpen] = useState(true)

  return (
    <>
      <style>{scrollbarStyles}</style>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Main sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 w-68 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* All sidebar components must be wrapped in the SidebarProvider */}
        <SidebarProvider className='border-none'>
          {/* The Sidebar component itself acts as the main container */}
          <Sidebar className="flex flex-col h-full w-full border-none">
            {/* Header (Not part of the scrollable area) */}
            <SidebarHeader className="p-4 border-b border-gray-100 flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={sidebarLogo} alt="Logo" className="h-8" />
              </div>
              <button onClick={() => setIsOpen(false)} className="md:hidden p-1">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </SidebarHeader>
            <SidebarHeader className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <SidebarInput placeholder="Search" className="pl-10 h-9 bg-gray-50 border-gray-200 text-sm" />
              </div>
            </SidebarHeader>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto modern-scrollbar">
              <SidebarContent className="px-3 py-2">
                {/* Navigation Groups are placed inside the scrollable area */}
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationData.dashboard.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild className="h-9 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <a href={item.url} className="flex items-center gap-3">
                              <item.icon className={`w-4 h-4 ${item.iconColor || "text-gray-500"}`} />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-start font-semibold text-sm text-[#1A89C1] uppercase tracking-wide">
                    Services
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <button onClick={() => setIsServicesOpen(!isServicesOpen)} className="flex items-center justify-between w-full h-9 px-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span>API Verification</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                        </button>
                      </SidebarMenuItem>
                      {isServicesOpen && (
                        <div className="pl-4 mt-2 space-y-1">
                          {navigationData.services.map((item) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild isActive={item.isActive} className={`h-9 px-3 text-sm w-full flex items-center justify-start rounded-md ${item.isActive ? "bg-[#E8F3FA] text-[#1A89C1] font-medium border-2 border-[#1A89C1]" : "text-gray-700 hover:bg-gray-50"}`}>
                                <a href={item.url} className="flex items-center gap-3">
                                  <item.icon className={`w-4 h-4 ${item.isActive ? "text-[#1A89C1]" : "text-gray-500"}`} />
                                  <span>{item.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Reports
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationData.reports.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild className="h-9 px-3 text-sm text-gray-700 hover:bg-gray-50">
                            <a href={item.url} className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-gray-500" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Price
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationData.pricing.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild className="h-9 px-3 text-sm text-gray-700 hover:bg-gray-50">
                            <a href={item.url} className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-gray-500" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </div>

            {/* Footer (Fixed at the bottom) */}
            <SidebarFooter className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userPic} alt="Rahul Singh" />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Rahul Singh</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start h-8 px-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-3" /> Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-8 px-2 text-sm text-gray-700 hover:bg-gray-50">
                  <LogOut className="w-4 h-4 mr-3" /> Log out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </aside>
    </>
  )
}
