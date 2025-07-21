"use client"

import {
  LayoutDashboard,
  Shield,
  Users,
  BarChart3,
  PieChart,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Tag,
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
import sidebarLogo from "@/assets/sidebarLogo.svg"; 
import userPic from "@/assets/UserImage.svg"; 
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"


// This part of the data can still be used for other sections
const navigationData = {
  reports: [
    { title: "Purchase History", icon: BarChart3, url: "#" },
    { title: "Review", icon: PieChart, url: "#" },
  ],
  pricing: [
    { title: "Report Item 1", icon: BarChart3, url: "#" },
    { title: "Report Item 2", icon: BarChart3, url: "#" },
  ],
}

const scrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar { width: 8px; }
  .modern-scrollbar::-webkit-scrollbar-track { background-color: #f8fafc; }
  .modern-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 0px; }
  .modern-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
  .modern-scrollbar { scrollbar-width: thin; scrollbar-color: #e2e8f0 #f8fafc; }
`

export default function SidebarComponent({
  isOpen,
  setIsOpen,
  activeView,
  onNavigate,
  categories = [], // Receive categories
  activeCategory, // Receive active category
  onCategorySelect, // Receive category selection handler
}) {
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

  const handleNavigationClick = (view) => {
    navigate("/user", { state: { view: view } })
    if (onNavigate) {
      onNavigate(view)
    }
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }
   const handleMouseEnter = () => {
   if (window.innerWidth >= 768) {
     setIsOpen(true);
   }
 };

 const handleMouseLeave = () => {
   if (window.innerWidth >= 768) {
     setIsOpen(false);
   }
 };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
      onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out mt- ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:w-20 md:translate-x-0"
        }`}
      >
        <SidebarProvider className="border-none">
          <Sidebar collapsible="none" className="flex flex-col h-full w-full border-none">
            <SidebarHeader
              className={`p-4 border-b border-gray-100 flex items-center ${isOpen ? "justify-between" : "justify-center"}`}
            >
              <div className={`flex items-center ${isOpen ? "gap-2" : "justify-center w-full"}`}>
                <img src={sidebarLogo} alt="Logo" className="h-12" />
              </div>
              <button onClick={() => setIsOpen(false)} className={`md:hidden p-1 ${isOpen ? "" : "hidden"}`}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </SidebarHeader>

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
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
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
                        <div className={`${isOpen ? "pl-4 mt-2 space-y-1" : "hidden"}`}>
                          {/* DYNAMICALLY RENDER CATEGORIES */}
                          {categories.map((category) => (
                            <SidebarMenuItem key={category}>
                              <SidebarMenuButton
                                onClick={() => {
                                  onCategorySelect(category)
                                   setIsOpen(false)
                                }}
                                isActive={activeView === "services" && activeCategory === category}
                                className={`h-9 w-full flex items-center rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200 justify-start px-3 text-sm`}
                              >
                                <div className="flex items-center gap-3">
                                  <Tag className="w-3.5 h-3.5" />
                                  <span>{category}</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Other static sidebar groups like Reports and Pricing */}
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
      className={`h-9 w-full flex items-center rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
        isOpen ? "justify-start px-3 text-sm" : "justify-center px-0"
      }`}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (item.title === "Purchase History") {
            handleNavigationClick("history");
            setIsOpen(false)
          }
          if (item.title === "Review") {
            handleNavigationClick("review");
            setIsOpen(false)
          }
        }}
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
                <Button variant="ghost" size="sm" className={`h-8 text-gray-700 hover:bg-gray-50 ${isOpen ? "w-full justify-start px-2 text-sm" : "w-8 justify-center px-0"}`}>
                  <Settings className={`w-4 h-4 ${isOpen ? "mr-3" : ""}`} /> <span className={`${isOpen ? "" : "hidden"}`}>Settings</span>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" className={`h-8 text-gray-700 hover:bg-gray-50 ${isOpen ? "w-full justify-start px-2 text-sm" : "w-8 justify-center px-0"}`}>
                  <LogOut className={`w-4 h-4 ${isOpen ? "mr-3" : ""}`} /> <span className={`${isOpen ? "" : "hidden"}`}>Log out</span>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </aside>
    </>
  )
}