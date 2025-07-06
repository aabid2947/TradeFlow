import { Search, RotateCcw, ChevronDown, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// The header now accepts an onMenuClick function to toggle the sidebar on mobile
export default function DashboardHeader({ onMenuClick }) {
  return (
    <header className="w-full bg-white p-4 md:border-b md:border-gray-100">
      <div className="flex items-center justify-between">
        {/* Left Section: Includes hamburger for mobile and welcome text */}
        <div className="flex items-center gap-4">
          {/* Hamburger button, only visible on mobile screens */}
          <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900 md:hidden">
            <Menu className="h-6 w-6" />
          </button>

          {/* Welcome Text */}
          <div className="flex flex-col">
            <h1 className="text-lg text-start font-semibold text-gray-900 md:text-xl">
              Welcome Back, <span className="text-blue-600">Rahul Singh</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 hidden md:block">
              Here is the information about all your verifications
            </p>
          </div>
        </div>

        {/* Right Section - Actions and Profile - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100">
            <Search className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100">
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 hover:bg-gray-100 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://placehold.co/24x24/DBEAFE/1E40AF?text=RS" alt="Rahul Singh" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">RS</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Rahul Singh</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
