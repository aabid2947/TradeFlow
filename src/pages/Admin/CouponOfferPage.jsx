// src/pages/HomePage.jsx
import { useState } from "react"
import SidebarComponent from "@/components/SidebarComponent"
import DashboardHeader from "@/components/DashboardHeader"
import RecentlyPurchased from "../../components/AdminComponents/RecentlyPurchased"
import CouponsOffers from "../../components/AdminComponents/CouponOffer"

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
