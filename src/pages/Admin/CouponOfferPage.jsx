// src/pages/HomePage.jsx
import { useState } from "react"
import SidebarComponent from "@/components/AdminComponents/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import CouponsOffers from "../../../admin/AdminComponents/CouponOffer"

export default function CouponOfferPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-gray-100">
         {/* Pass state and setter to the SidebarComponent */}
         <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
   
         {/* Main content area */}
         <div className="flex flex-col flex-1 md:ml-70">
           {/* Mobile Header with Hamburger Menu */}
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
           {/* <RecentlyPurchased/> */}
           <CouponsOffers/>
         </div>
       </div>
  )
}
