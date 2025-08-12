"use client"

import {
  LayoutDashboard, Shield, User, BarChart3, PieChart, Settings, LogOut,
  ChevronDown, Tag, Building, Scale, FileText, Scan, Database,
  AlertTriangle, MapPin, MoreVertical, IdCard, Briefcase, LayoutGrid // Added LayoutGrid for "All Services"
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import userPic from "@/assets/UserImage.svg"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

// Generate a random color for the avatar background
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

// UPDATED: Added "All Services" as the first option
const serviceCategories = [
  { value: 'All Services', label: 'All Services', icon: LayoutGrid },
  { value: 'Identity Verification', label: 'Identity Verification', icon: User },
  { value: 'Financial & Business Checks', label: 'Financial & Business Checks', icon: Building },
  { value: 'Legal & Compliance Checks', label: 'Legal & Compliance Checks', icon: Scale },
  // { value: 'Health & Government Records', label: 'Health & Government Records', icon: FileText },
  { value: 'Biometric & AI-Based Verification', label: 'Biometric & AI-Based Verification', icon: Scan },
  { value: 'Profile & Database Lookup', label: 'Profile & Database Lookup', icon: Database },
  // { value: 'Criminal Verification', label: 'Criminal Verification', icon: AlertTriangle },
  // { value: 'Land Record Check', label: 'Land Record Check', icon: MapPin },
  // { value: 'PAN', label: 'PAN', icon: IdCard },
  { value: 'Empoyer Verification', label: 'Empoyer Verification', icon: Briefcase },

  // { value: 'CIN', label: 'CIN', icon: Briefcase  }
];

const navigationData = {
  reports: [
    { title: "Purchase History", icon: BarChart3, url: "#" },
    { title: "Verification Results", icon: PieChart, url: "#" },
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
  activeView,
  onNavigate,
  activeCategory,
  onCategorySelect,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleProfileClick = () => {
    navigate('/user', { state: { view: 'profile' }, replace: true });
    setShowDropdown(!showDropdown);
  };


  const handleLogout = async () => {
    try {
      setShowDropdown(false);
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
  };

  const avatarBgColor = generateRandomColor(user?.name);

  const MenuButton = ({ icon: Icon, label, isActive, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center transition-all duration-200 ease-in-out ${isOpen ? 'px-4 py-3 rounded-xl mx-2' : 'p-3 mx-auto rounded-xl w-10 h-12 justify-center'} ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${className}`}
    >
      <Icon className={`${isOpen ? 'w-5 h-5 mr-2' : 'w-5 h-5'} transition-all duration-200`} />
      {isOpen && <span className="font-medium text-xs truncate">{label}</span>}
      {!isOpen && <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">{label}</div>}
    </button>
  );

  const SubMenuButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center px-4 py-2.5 mx-2 my-1 rounded-lg transition-all duration-200 ease-in-out text-xs ${isActive ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-200'}`}
    >
      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="font-medium truncate">{label}</span>
    </button>
  );

  return (
    <>
      <style>{scrollbarStyles}</style>

      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => { }}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 z-30 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transition-all duration-300 ease-out ${isOpen ? "w-64" : "w-20"
          } ${isOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'
          }`}
        style={{
          top: window.innerWidth >= 1024 ? '72px' : '64px',
          height: 'calc(100vh - 73px)'
        }}
      >
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto overflow-x-hidden modern-scrollbar  py-4 ">
            <div className="mb-6 w-[96%] ">
              <MenuButton
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={activeView === "dashboard"}
                onClick={() => handleNavigationClick("dashboard")}
              />
            </div>

            <div className="mb-6  w-[96%] ">
              {isOpen && (
                <div className="px-6 mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</h3>
                </div>
              )}
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`group relative w-full flex items-center transition-all duration-200 ease-in-out ${isOpen ? 'px-4 py-3 rounded-xl mx-2 justify-between' : 'p-3 mx-auto rounded-xl w-12 h-12 justify-center'
                  } ${activeView === "services"
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <div className={`flex items-center ${isOpen ? 'gap-2' : 'gap-0'}`}>
                  <Shield className="w-5 h-5" />
                  {isOpen && <span className="font-medium text-xs">Verifications</span>}
                </div>
                {isOpen && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                )}
                {!isOpen && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    API Verification
                  </div>
                )}
              </button>

              {isServicesOpen && (
                <div className={`mt-2 space-y-0.5 pb-2 ${isOpen ? '' : 'hidden md:block'}`}>
                  {serviceCategories.map((categoryItem) => {
                    const IconComponent = categoryItem.icon;
                    const categoryLabel = categoryItem.label;

                    return isOpen ? (
                      <SubMenuButton
                        key={categoryItem.value}
                        icon={IconComponent}
                        label={categoryLabel}
                        isActive={activeView === "services" && activeCategory === categoryLabel}
                        onClick={() => onCategorySelect(categoryLabel)}
                      />
                    ) : (
                      <button
                        key={categoryItem.value}
                        onClick={() => onCategorySelect(categoryLabel)}
                        className={`group relative w-12 h-12 mx-auto mb-2 rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center ${activeView === "services" && activeCategory === categoryLabel
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          {categoryLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-6">
              {isOpen && (
                <div className="px-6 mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</h3>
                </div>
              )}
              <div className="space-y-1  w-[96%] ">
                {navigationData.reports.map((item) => (
                  <MenuButton
                    key={item.title}
                    icon={item.icon}
                    label={item.title}
                    isActive={
                      (item.title === "Purchase History" && activeView === "history") ||
                      (item.title === "Verification Results" && activeView === "verification_history")
                    }
                    onClick={() => {
                      if (item.title === "Purchase History") {
                        handleNavigationClick("history");
                      }
                      if (item.title === "Verification Results") {
                        handleNavigationClick("verification_history");
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Fixed User Profile Section */}
          <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-3 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            {isOpen && (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 relative">
                  <Avatar className="h-7 w-7 border border-gray-200">
                    {user.avatar && user.avatar.trim() !== '' && <AvatarImage src={user.avatar} alt={user?.name} />}
                    <AvatarFallback
                      className="text-white text-xs font-medium"
                      style={{ backgroundColor: avatarBgColor }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>


                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                  </div>

                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    aria-label="User menu"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[60] ">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">My Profile</span>
                    </button>

                    <div className="h-px bg-gray-200 mx-2 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isOpen && (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <Avatar className="w-10 h-10 ring-2 ring-white cursor-pointer">
                    <AvatarImage src={userPic} alt={user?.name || "User"} />
                    <AvatarFallback
                      className="text-white font-medium"
                      style={{ backgroundColor: avatarBgColor }}
                    >
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    {user?.name || 'User'}
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 hover:bg-red-50 hover:text-red-600 text-gray-600 group relative"
                >
                  <LogOut className="w-4 h-4" />
                  <div className="absolute left-12 bg-gray-900 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    Log out
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}