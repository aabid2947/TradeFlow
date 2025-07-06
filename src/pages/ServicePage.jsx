import { useState } from "react"
import SidebarComponent from "../components/SidebarComponent"
import DashboardHeader from "../components/DashboardHeader"
import ServicesList from "../components/ServicesList"
import { UserInfoCard } from "../cards/UserInfoCard"
import { UserDetailsCard } from "../cards/UserDetailsCard"

export default function ServicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-gray-50">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area, with a left margin on desktop to make space for the sidebar */}
      <div className="flex flex-col flex-1 md:ml-70">
        {/* A single, unified header that handles its own responsiveness */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* The main content now uses a responsive grid layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 lg:p-8">
          {/* Each component is a grid item */}
          <div className="lg:col-span-1">
            <ServicesList />
          </div>
          <div className="lg:col-span-1">
            <UserDetailsCard />
          </div>
          <div className="lg:col-span-1">
            <UserInfoCard />
          </div>
        </main>
      </div>
    </div>
  )
}
