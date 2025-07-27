"use client"

import {
  LayoutDashboard, Shield, Users, BarChart3, PieChart, Settings, LogOut,
  ChevronDown, X, Tag, User, Building, Scale, FileText, Scan, Database,
  AlertTriangle, MapPin, Menu // Import Menu icon
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import sidebarLogo from "@/assets/sidebarLogo.svg"
import userPic from "@/assets/UserImage.svg"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"

const serviceCategories = [
  { value: 'Identity Verification', label: 'Identity Verification', icon: User },
  { value: 'Financial & Business Checks', label: 'Financial & Business Checks', icon: Building },
  { value: 'Legal & Compliance Checks', label: 'Legal & Compliance Checks', icon: Scale },
  { value: 'Health & Government Records', label: 'Health & Government Records', icon: FileText },
  { value: 'Biometric & AI-Based Verification', label: 'Biometric & AI-Based Verification', icon: Scan },
  { value: 'Profile & Database Lookup', label: 'Profile & Database Lookup', icon: Database },
  { value: 'Criminal Verification', label: 'Criminal Verification', icon: AlertTriangle },
  { value: 'Land Record Check', label: 'Land Record Check', icon: MapPin }
];

const navigationData = {
  reports: [
    { title: "Purchase History", icon: BarChart3, url: "#" },
    { title: "Review", icon: PieChart, url: "#" },
  ],
};

const scrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar { width: 6px; }
  .modern-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 3px; }
  .modern-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 3px; }
  .modern-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.7); }
  .modern-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.4) transparent; }
`;

export default function SidebarComponent({
  isOpen,
  setIsOpen,
  activeView,
  onNavigate,
  categories = [],
  activeCategory,
  onCategorySelect,
}) {
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

  const handleNavigationClick = (view) => {
    navigate("/user", { state: { view: view } });
    if (onNavigate) {
      onNavigate(view);
    }
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const category = serviceCategories.find(cat => cat.value === categoryName || cat.label === categoryName);
    return category ? category.icon : Tag;
  };

  const MenuButton = ({ icon: Icon, label, isActive, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center transition-all duration-200 ease-in-out ${isOpen ? 'px-4 py-3 rounded-xl mx-2' : 'p-3 mx-auto rounded-xl w-10 h-12 justify-center'} ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${className}`}
    >
      <Icon className={`${isOpen ? 'w-5 h-5 mr-3' : 'w-5 h-5'} transition-all duration-200`} />
      {isOpen && <span className="font-medium text-sm truncate">{label}</span>}
      {!isOpen && <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">{label}</div>}
    </button>
  );

  const SubMenuButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center px-4 py-2.5 mx-2 my-1 rounded-lg transition-all duration-200 ease-in-out text-sm ${isActive ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-200'}`}
    >
      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
      <span className="font-medium truncate">{label}</span>
    </button>
  );

  return (
    <>
      <style>{scrollbarStyles}</style>
      
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transition-all duration-300 ease-out ${isOpen ? "w-72" : "w-20"} md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header with Menu Toggle and Logo */}
        <div className="h-16 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>
            <img src={sidebarLogo} alt="Logo" className="h-10 w-auto" />
          </div>
        </div>

        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto modern-scrollbar py-4">
            <div className="mb-6">
              <MenuButton icon={LayoutDashboard} label="Dashboard" isActive={activeView === "dashboard"} onClick={() => handleNavigationClick("dashboard")} />
            </div>

            <div className="mb-6">
              {isOpen && <div className="px-6 mb-3"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</h3></div>}
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`group relative w-full flex items-center transition-all duration-200 ease-in-out ${isOpen ? 'px-4 py-3 rounded-xl mx-2 justify-between' : 'p-3 mx-auto rounded-xl w-12 h-12 justify-center'} ${activeView === "services" ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <div className={`flex items-center ${isOpen ? 'gap-3' : 'gap-0'}`}>
                  <Shield className="w-5 h-5" />
                  {isOpen && <span className="font-medium text-sm">API Verification</span>}
                </div>
                {isOpen && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />}
                {!isOpen && <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">API Verification</div>}
              </button>

              {isServicesOpen && isOpen && (
                <div className="mt-2 space-y-0.5 pb-2">
                  {categories.map((category) => {
                    const IconComponent = getCategoryIcon(category);
                    return <SubMenuButton key={category} icon={IconComponent} label={category} isActive={activeView === "services" && activeCategory === category} onClick={() => { onCategorySelect(category); if (window.innerWidth < 768) { setIsOpen(false); } }} />;
                  })}
                </div>
              )}
            </div>

            <div className="mb-6">
              {isOpen && <div className="px-6 mb-3"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</h3></div>}
              <div className="space-y-1">
                {navigationData.reports.map((item) => (
                  <MenuButton key={item.title} icon={item.icon} label={item.title} isActive={(item.title === "Purchase History" && activeView === "history") || (item.title === "Review" && activeView === "review")} onClick={() => { if (item.title === "Purchase History") { handleNavigationClick("history"); } if (item.title === "Review") { handleNavigationClick("review"); } }} />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4">
            {isOpen && (
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50">
                <Avatar className="w-10 h-10 ring-2 ring-white"><AvatarImage src={userPic} alt="Rahul Singh" /><AvatarFallback className="bg-blue-500 text-white font-medium">RS</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">Rahul Singh</p><p className="text-xs text-gray-500">Administrator</p></div>
              </div>
            )}
            <div className={`space-y-2 ${isOpen ? '' : 'flex flex-col items-center space-y-3'}`}>
              <Button variant="ghost" size={isOpen ? "sm" : "icon"} className={`${isOpen ? 'w-full justify-start h-10' : 'w-10 h-10'} hover:bg-gray-100 group relative`}>
                <Settings className="w-4 h-4" />
                {isOpen && <span className="ml-3">Settings</span>}
                {!isOpen && <div className="absolute left-12 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">Settings</div>}
              </Button>
              <Button onClick={handleLogout} variant="ghost" size={isOpen ? "sm" : "icon"} className={`${isOpen ? 'w-full justify-start h-10' : 'w-10 h-10'} hover:bg-red-50 hover:text-red-600 text-gray-600 group relative`}>
                <LogOut className="w-4 h-4" />
                {isOpen && <span className="ml-3">Log out</span>}
                {!isOpen && <div className="absolute left-12 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">Log out</div>}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
