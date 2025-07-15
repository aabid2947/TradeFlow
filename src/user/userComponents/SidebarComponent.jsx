"use client"

import {
  LayoutDashboard,
  Shield,
  Building2,
  FileCheck,
  Users,
  ScanText,
  BarChart3,
  PieChart,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import sidebarLogo from "@/assets/sidebarLogo.svg"; // Replaced with placeholder
import userPic from "@/assets/UserImage.svg"; // Replaced with placeholder
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"

// This data is for display purposes; navigation is handled by the component logic.
const navigationData = {
  services: [
    { title: "Verification API", icon: Shield, url: "#" },
    { title: "KYC Verification", icon: Shield, url: "#" },
    { title: "Banking Verification", icon: Building2, url: "#" },
    { title: "Business Verification", icon: Building2, url: "#" },
    { title: "Employment Check", icon: Users, url: "#" },
    { title: "Document Check", icon: FileCheck, url: "#" },
    { title: "Document OCR", icon: ScanText, url: "#" },
    { title: "Service Item 1", icon: Shield, url: "#" },
    { title: "Service Item 2", icon: Shield, url: "#" },
    { title: "Service Item 3", icon: Shield, url: "#" },
  ],
  reports: [
    { title: "Account Report", icon: BarChart3, url: "#" },
    { title: "Data Analytics", icon: PieChart, url: "#" },
  ],
  pricing: [
    { title: "Report Item 1", icon: BarChart3, url: "#" },
    { title: "Report Item 2", icon: BarChart3, url: "#" },
  ],
}

const scrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .modern-scrollbar::-webkit-scrollbar-track {
    background-color: #f8fafc;
  }
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 0px;
  }
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
  }
  .modern-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 #f8fafc;
  }
`

export default function SidebarComponent({ isOpen, setIsOpen, activeView, onNavigate }) {
  const [isServicesOpen, setIsServicesOpen] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await dispatch(logOut())
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles navigation for primary sidebar items.
   * It ensures the user is on the main '/user' route before updating the view state.
   * This is crucial for navigating back from detail pages like '/user/service/:id'.
   * @param {string} view - The view to display ('dashboard' or 'services').
   */
  const handleNavigationClick = (view) => {
    // Navigate to the main UserDashboard page, passing the desired view in the state.
    // The UserDashboard will read this state and set its own view accordingly.
    navigate("/user", { state: { view: view } })

    // Directly call the onNavigate prop for instant UI updates if already on the page.
    if (onNavigate) {
      onNavigate(view)
    }

    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-40 transition-opacity   ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out mt- ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:w-20 md:translate-x-0"
        }`}
      >
        <SidebarProvider className="border-none">
          <Sidebar collapsible="none" className="flex flex-col h-full w-full border-none">
            {/* Sidebar Header */}
            <SidebarHeader
              className={`p-4 border-b border-gray-100 flex items-center ${isOpen ? "justify-between" : "justify-center"}`}
            >
              <div className={`flex items-center ${isOpen ? "gap-2" : "justify-center w-full"}`}>
                <img src={sidebarLogo} alt="Logo" className={`${isOpen ? "h-12" : "h-12"}`} />
              </div>
              <button onClick={() => setIsOpen(false)} className={`md:hidden p-1 ${isOpen ? "" : "hidden"}`}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </SidebarHeader>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto modern-scrollbar">
              <SidebarContent className="px-3 py-2">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNavigationClick("dashboard")}
                          isActive={activeView === "dashboard"}
                          className={`h-9 w-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                            isOpen ? "justify-start px-3" : "justify-center px-0"
                          }`}
                        >
                          <div className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}>
                            <LayoutDashboard className="w-4 h-4 text-orange-500" />
                            <span className={`${isOpen ? "" : "hidden"}`}>Dashboard</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel
                    className={`px-3 py-2 text-start font-semibold text-sm text-[#1A89C1] uppercase tracking-wide ${isOpen ? "" : "hidden"}`}
                  >
                    Services
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <button
                          onClick={() => {
                            handleNavigationClick("services")
                            setIsServicesOpen(!isServicesOpen)
                          }}
                          className={`flex items-center justify-between w-full h-9 px-3 text-sm font-medium rounded-md hover:bg-gray-50 ${
                            activeView === "services" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          } ${isOpen ? "" : "justify-center px-0"}`}
                        >
                          <div className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}>
                            <Shield className="w-4 h-4" />
                            <span className={`${isOpen ? "" : "hidden"}`}>API Verification</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""} ${isOpen ? "" : "hidden"}`}
                          />
                        </button>
                      </SidebarMenuItem>
                      {isServicesOpen && (
                        <div className={`${isOpen ? "pl-4 mt-2 space-y-1" : "space-y-1"}`}>
                          {navigationData.services.map((item) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                asChild
                                className={`h-9 w-full flex items-center rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                                  isOpen ? "justify-start px-3 text-sm" : "justify-center px-0"
                                }`}
                              >
                                <a
                                  href="#"
                                  onClick={(e) => e.preventDefault()}
                                  className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}
                                >
                                  <item.icon
                                    className={`w-4 h-4 ${activeView === "services" ? "text-[#1A89C1]" : "text-gray-500"}`}
                                  />
                                  <span className={`${isOpen ? "" : "hidden"}`}>{item.title}</span>
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
                  <SidebarGroupLabel
                    className={`px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide ${isOpen ? "" : "hidden"}`}
                  >
                    Reports
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationData.reports.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            className={`h-9 w-full flex items-center rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                              isOpen ? "justify-start px-3 text-sm" : "justify-center px-0"
                            }`}
                          >
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}
                            >
                              <item.icon className="w-4 h-4 text-gray-500" />
                              <span className={`${isOpen ? "" : "hidden"}`}>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel
                    className={`px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide ${isOpen ? "" : "hidden"}`}
                  >
                    Price
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationData.pricing.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            className={`h-9 w-full flex items-center rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                              isOpen ? "justify-start px-3 text-sm" : "justify-center px-0"
                            }`}
                          >
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className={`flex items-center ${isOpen ? "gap-3" : "gap-0"}`}
                            >
                              <item.icon className="w-4 h-4 text-gray-500" />
                              <span className={`${isOpen ? "" : "hidden"}`}>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </div>

            {/* Sidebar Footer */}
            <SidebarFooter className={`p-3 border-t border-gray-100 ${isOpen ? "" : "flex flex-col items-center"}`}>
              <div className={`flex items-center gap-3 mb-3 ${isOpen ? "" : "hidden"}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userPic} alt="Rahul Singh" />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Rahul Singh</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <div className={`space-y-1 ${isOpen ? "" : "flex flex-col items-center"}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                    isOpen ? "w-full justify-start px-2 text-sm" : "w-8 justify-center px-0"
                  }`}
                >
                  <Settings className={`w-4 h-4 ${isOpen ? "mr-3" : ""}`} />{" "}
                  <span className={`${isOpen ? "" : "hidden"}`}>Settings</span>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                    isOpen ? "w-full justify-start px-2 text-sm" : "w-8 justify-center px-0"
                  }`}
                >
                  <LogOut className={`w-4 h-4 ${isOpen ? "mr-3" : ""}`} />{" "}
                  <span className={`${isOpen ? "" : "hidden"}`}>Log out</span>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </aside>
    </>
  )
}
