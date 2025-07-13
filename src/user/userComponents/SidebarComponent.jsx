"use client";

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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import sidebarLogo from "@/assets/sidebarLogo.svg";
import userPic from "@/assets/UserImage.svg";
import { useDispatch } from "react-redux";
import { logOut } from "@/features/auth/authSlice";

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
};

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
`;

export default function SidebarComponent({ isOpen, setIsOpen, activeView, onNavigate }) {
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logOut());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles navigation for primary sidebar items.
   * It ensures the user is on the main '/user' route before updating the view state.
   * This is crucial for navigating back from detail pages like '/user/service/:id'.
   * @param {string} view - The view to display ('dashboard' or 'services').
   */
  const handleNavigationClick = (view) => {
    // Navigate to the main UserDashboard page, passing the desired view in the state.
    // The UserDashboard will read this state and set its own view accordingly.
    navigate('/user', { state: { view: view } });

    // Directly call the onNavigate prop for instant UI updates if already on the page.
    if (onNavigate) {
        onNavigate(view);
    }

    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
        setIsOpen(false);
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className={`fixed inset-0 modal-overlay bg-transparent bg-opacity-30 backdrop-blur-sm z-40  transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarProvider className="border-none">
          <Sidebar collapsible="none" className="flex flex-col h-full w-full border-none">
            <SidebarHeader className="p-4 border-b border-gray-100 flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={sidebarLogo} alt="Logo" className="h-12" />
              </div>
              <button onClick={() => setIsOpen(false)} className="md:hidden p-1">
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
                          className="h-9 px-3 text-sm font-medium w-full justify-start text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4 text-orange-500" />
                            <span>Dashboard</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
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
                        <button
                          onClick={() => {
                            handleNavigationClick("services");
                            setIsServicesOpen(!isServicesOpen);
                          }}
                          className={`flex items-center justify-between w-full h-9 px-3 text-sm font-medium rounded-md hover:bg-gray-50 ${
                            activeView === "services" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4" />
                            <span>API Verification</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                        </button>
                      </SidebarMenuItem>
                      {isServicesOpen && (
                        <div className="pl-4 mt-2 space-y-1">
                          {navigationData.services.map((item) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild className="h-9 px-3 text-sm w-full flex items-center justify-start rounded-md text-gray-700 hover:bg-gray-50">
                                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3">
                                  <item.icon className={`w-4 h-4 ${activeView === "services" ? "text-[#1A89C1]" : "text-gray-500"}`} />
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
                            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3">
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
                            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3">
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
                <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start h-8 px-2 text-sm text-gray-700 hover:bg-gray-50">
                  <LogOut className="w-4 h-4 mr-3" /> Log out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </aside>
    </>
  );
}