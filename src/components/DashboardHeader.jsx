import { Search, RotateCcw, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import UserPic from  "../assets/UserImage.svg"
export default function DashboardHeader() {
  return (
    <header className="w-full bg-white border-b border-gray-100  py-4">
      <div className="flex items-start justify-between">
        {/* Left Section - Welcome Text */}
        <div className="flex flex-col">
          <h1 className="text-xl text-start font-semibold text-gray-900">
            Welcome Back, <span className="text-blue-600">Rahul Singh</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here is the information about all your verifications</p>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
            <Search className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Refresh Icon */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 hover:bg-gray-100 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={UserPic} alt="Rahul Singh" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">RS</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Rahul Singh</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
