"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, CheckCircle, Menu, X, Phone, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useNavigate } from "react-router-dom"
import AppLogo from "@/assets/sidebarLogo.svg"

const navigationItems = [
  {
    name: "Products",
    hasDropdown: true,
    items: [
      { name: "KYC Verification", href: "#", description: "Identity verification solutions" },
      { name: "Document Verification", href: "#", description: "Secure document validation" },
      { name: "Biometric Verification", href: "#", description: "Advanced biometric checks" },
      { name: "Business Verification", href: "#", description: "Company credential validation" },
    ],
  },
  {
    name: "Solutions",
    hasDropdown: true,
    items: [
      { name: "Financial Services", href: "#", description: "Banking & fintech solutions" },
      { name: "Healthcare", href: "#", description: "HIPAA compliant verification" },
      { name: "E-commerce", href: "#", description: "Online marketplace security" },
      { name: "Real Estate", href: "#", description: "Property transaction verification" },
    ],
  },
  { 
    name: "Pricing", 
    hasDropdown: false,  
    href:"/pricing",
    items: [
      { name: "Financial Services", href: "#", description: "Banking & fintech solutions" },
      { name: "Healthcare", href: "#", description: "HIPAA compliant verification" },
      { name: "E-commerce", href: "#", description: "Online marketplace security" },
      { name: "Real Estate", href: "#", description: "Property transaction verification" },
    ], 
  },
  {
    name: "Resources",
    hasDropdown: true,
    items: [
      { name: "Documentation", href: "#", description: "API guides and tutorials" },
      { name: "Case Studies", href: "#", description: "Customer success stories" },
      { name: "Blog", href: "#", description: "Industry insights and updates" },
      { name: "Help Center", href: "#", description: "Support and FAQs" },
    ],
  },
  {
    name: "Company",
    hasDropdown: true,
    items: [
      { name: "About Us", href: "about-us", description: "Our mission and team" },
      { name: "Careers", href: "#", description: "Join our growing team" },
      { name: "Press", href: "#", description: "News and media resources" },
      { name: "Contact", href: "contact-us", description: "Get in touch with us" },
    ],
  },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (href) => {
    if (href.startsWith('/') || href === 'about-us' || href === 'contact-us') {
      navigate(`/${href}`)
    } else if (href !== '#') {
      window.location.href = href
    }
  }

  return (
    <>
           <header
       className={`
       sticky top-0 z-50 transition-all duration-300 ease-out
       ${
         isScrolled
           ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
           : "bg-white border-b-2 border-blue-400"
       }
     `}
     >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={()=> navigate("/")}>
              <img src={AppLogo} className="w-32 h-32 text-white" />
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex items-center space-x-6 relative">
                {navigationItems.map((item, index) => (
                  <NavigationMenuItem key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <NavigationMenuTrigger
                          className={`
                          bg-transparent hover:bg-gray-50 data-[active]:bg-transparent data-[state=open]:bg-gray-50
                          text-gray-700 hover:text-[#1987BF] font-md text-[1.1rem] px-5 py-3 rounded-lg
                          transition-all duration-200 border border-transparent hover:border-gray-200
                          ${isScrolled ? "hover:shadow-sm" : ""}
                        `}
                        >
                          <span className="flex items-center gap-1">
                            {item.name}
                          </span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[480px] p-5 bg-white shadow-xl rounded-xl border border-gray-100">
                            <div className="space-y-3">
                              {item.items?.map((subItem) => (
                                <NavigationMenuLink key={subItem.name} asChild>
                                  <a
                                    href={subItem.href}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleNavigation(subItem.href)
                                    }}
                                    className="block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                                  >
                                    <div className="font-semibold text-gray-900 group-hover:text-[#1987BF] transition-colors duration-200 text-lg">
                                      {subItem.name}
                                    </div>
                                    <div className="text-base text-gray-600 mt-1">{subItem.description}</div>
                                  </a>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(item.href)
                          }}
                            className={`
                          bg-transparent font-semibold hover:bg-gray-50 data-[active]:bg-transparent data-[state=open]:bg-gray-50
                          text-gray-700 hover:text-[#1987BF] font-md text-[1.1rem] px-5 py-3 rounded-lg
                          transition-all duration-200 border border-transparent hover:border-gray-200
                          ${isScrolled ? "hover:shadow-sm" : ""}
                        `}
                        >
                          {item.name}
                        </button>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Side Actions */}
            <div className="flex items-center gap-5">
              {/* Demo Button */}
              <div className="hidden lg:block">
                <Button
                  className={`
                  bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                  text-white font-semibold px-7 py-4 rounded-lg shadow-lg hover:shadow-xl
                  transition-all duration-200 transform hover:scale-105 active:scale-95
                  flex items-center gap-2 group text-[1.1rem] 
                `}
                  type="button"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-12 w-12 p-0 hover:bg-gray-100 rounded-lg"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X  size={4000} className=" text-gray-600" />
                ) : (
                  <Menu size={4000}  className=" text-gray-600" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-gray-100 px-4
          ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="px-4 py-8 space-y-5 max-w-7xl mx-auto">
            {navigationItems.map((item) => (
              <div key={item.name} className="space-y-3">
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-900 hover:text-[#1987BF] transition-colors duration-200 py-3"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`
                      overflow-hidden transition-all duration-300 ease-out
                      ${activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}
                    >
                      <div className="pl-4 space-y-3 pt-3">
                        {item.items?.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault()
                              handleNavigation(subItem.href)
                              setIsMobileMenuOpen(false)
                            }}
                            className="block py-3 text-lg text-gray-600 hover:text-[#1987BF] transition-colors duration-200 cursor-pointer"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item.href)
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-900 hover:text-[#1987BF] transition-colors duration-200 py-3"
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}

            {/* Mobile Actions */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-center bg-transparent border-gray-200 text-gray-700 hover:border-[#1987BF] hover:text-[#1987BF] hover:bg-[#1987BF]/5 text-lg py-6"
                onClick={() => {
                  navigate('/contact-us')
                  setIsMobileMenuOpen(false)
                }}
              >
                <Phone className="w-5 h-5 mr-3" />
                Contact Sales
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg py-4"
                onClick={() => {
                  navigate('/signup')
                  setIsMobileMenuOpen(false)
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

 
    </>
  )
}