
import HomePageHeader from "../components/HomePage/Header"
import ServicesSection from "../components/HomePage/ServiceSection"
import PricingSection from "../components/HomePage/PriceSection"
import StatsBanner from "../components/HomePage/StatsBanner"
import TrustSection from "../components/HomePage/TrustSection"
import CustomerReviews from "../components/HomePage/CustomerReviewSection"
import LandingPageFooter from "../components/HomePage/Footer"
import SubscriptionSection from "../components/HomePage/SubsciptionSection"
import FAQSection from "../components/HomePage/FAQSection"
import ServicesShowcase from "../components/HomePage/ServiceShowCaseComponent"
import HeroSection from "../components/HomePage/HeroSection"
export default function LandingPage() {

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30">

      {/* Main content area, with a left margin on desktop to make space for the sidebar */}
    
        {/* A single, unified header that handles its own responsiveness */}
        <HomePageHeader />
        <HeroSection/>
        <ServicesSection/>
        <ServicesShowcase/>
        <PricingSection/>
        <StatsBanner/>
        <TrustSection/>
        <CustomerReviews/>
        <FAQSection/>
        <SubscriptionSection/>
        <LandingPageFooter/>


    </div>
  )
}
