
import HomePageHeader from "../components/HomePage/Header"
import ServicesSection from "../components/HomePage/ServiceSection"
import PricingSection from "../components/HomePage/PriceSection"
import StatsBanner from "../components/HomePage/StatsBanner"
import TrustSection from "../components/HomePage/TrustSection"
import CustomerReviews from "../components/HomePage/CustomerReviewSection"
import LandingPageFooter from "../components/HomePage/Footer"
export default function LandingPage() {

  return (
    <div className="relative min-h-screen bg-gray-50">

      {/* Main content area, with a left margin on desktop to make space for the sidebar */}
    
        {/* A single, unified header that handles its own responsiveness */}
        <HomePageHeader />
        <ServicesSection/>
        <PricingSection/>
        <TrustSection/>
        <StatsBanner/>
        <CustomerReviews/>
        <LandingPageFooter/>


    </div>
  )
}
