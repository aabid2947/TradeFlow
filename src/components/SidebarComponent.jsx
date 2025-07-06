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
  CheckCircle,
  ChevronDown,
  X, // Import the X icon for the close button
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
// Assuming these are not used, but keeping them just in case
// import { highlightedTextColor } from "../constants/colors";
// import sidebarLogo from "../assets/sidebarLogo.svg";

const navigationData = {
  dashboard: [
    { title: "Dashboard", icon: LayoutDashboard, url: "#", iconColor: "text-orange-500" },
  ],
  services: [
    { title: "Verification API", icon: Shield, url: "#" },
    { title: "KYC Verification", icon: Shield, url: "#", isActive: true },
    { title: "Banking Verification", icon: Building2, url: "#" },
    { title: "Business Verification", icon: Building2, url: "#" },
    { title: "Employment Check", icon: Users, url: "#" },
    { title: "Document Check", icon: FileCheck, url: "#" },
    { title: "Document OCR", icon: ScanText, url: "#" },
  ],
  reports: [
    { title: "Account Report", icon: BarChart3, url: "#" },
    { title: "Data Analytics", icon: PieChart, url: "#" },
  ],
  pricing: [{ title: "Pricing", icon: DollarSign, url: "#" }],
}

// The component now accepts isOpen and setIsOpen props to control its state
export default function SidebarComponent({ isOpen, setIsOpen }) {
  const [isServicesOpen, setIsServicesOpen] = useState(true)

  return (
    <>
      {/* Backdrop for mobile, shown when the sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* The main sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarProvider>
          <Sidebar className="h-full mt-2 border-r border-gray-200">
            {/* Header */}
            <SidebarHeader className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Assuming sidebarLogo is an SVG or image URL */}
                {/* <img src={sidebarLogo} alt="Logo" className="h-8"/> */}
                <span className="font-bold text-xl">YourLogo</span>
              </div>
              {/* Close button for mobile view */}
              <button onClick={() => setIsOpen(false)} className="md:hidden">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </SidebarHeader>
            <SidebarHeader className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <SidebarInput placeholder="Search" className="pl-10 h-9 bg-gray-50 border-gray-200 text-sm" />
              </div>
            </SidebarHeader>

            {/* Scrollable Content */}
            <SidebarContent className="px-3 py-2 flex-1 overflow-y-auto">
              {/* Dashboard */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationData.dashboard.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="h-9 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
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

              {/* Services Dropdown */}
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 py-2 text-start font-semibold text-sm text-[#1A89C1] uppercase tracking-wide">
                  Services
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className="flex items-center justify-between w-full h-9 px-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span>API Verification</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </SidebarMenuItem>

                    {isServicesOpen && (
                      <div className="pl-4 mt-2 space-y-1">
                        {navigationData.services.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={item.isActive}
                              className={`h-9 px-3 text-sm w-full flex items-center justify-start rounded-md ${
                                item.isActive
                                  ? "bg-[#E8F3FA] text-[#1A89C1] font-medium border-2 border-[#1A89C1]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <a href={item.url} className="flex items-center gap-3">
                                <item.icon
                                  className={`w-4 h-4 ${
                                    item.isActive ? "text-[#1A89C1]" : "text-gray-500"
                                  }`}
                                />
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

              {/* Reports */}
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

              {/* Pricing */}
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Pricing
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

            {/* Footer */}
            <SidebarFooter className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://placehold.co/32x32/E2E8F0/4A5568?text=RS" alt="Rahul Singh" />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">RS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Rahul Singh</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Log out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </aside>
    </>
  )
}
