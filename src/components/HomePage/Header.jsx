import { ChevronDown, Search, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const navigationItems = [
  { name: "Products", hasDropdown: true },
  { name: "Solutions", hasDropdown: true },
  { name: "Pricing", hasDropdown: false },
  { name: "Resources", hasDropdown: true },
  { name: "Company", hasDropdown: true },
  { name: "Contact sales", hasDropdown: false },
]

export default function HomePageHeader() {
  return (
    <header className="w-full bg-white border-b-2 border-blue-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Verify Me Sync</span>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.hasDropdown ? (
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 data-[active]:bg-transparent data-[state=open]:bg-transparent text-gray-700 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-md transition-colors">
                      {item.name}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </NavigationMenuTrigger>
                  ) : (
                    <NavigationMenuLink className="text-gray-700 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      {item.name}
                    </NavigationMenuLink>
                  )}
                  {item.hasDropdown && (
                    <NavigationMenuContent>
                      <div className="w-48 p-2">
                        <div className="text-sm text-gray-600 p-2">Coming soon...</div>
                      </div>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md">
              Book Demo
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
