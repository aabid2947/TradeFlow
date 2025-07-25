
import HomePageHeader from "./homeComponents/Header"
import ServicesSection from "./homeComponents/ServiceSection"
import PricingSection from "./homeComponents/PriceSection"
import StatsBanner from "./homeComponents/StatsBanner"
import TrustSection from "./homeComponents/TrustSection"
import CustomerReviews from "./homeComponents/CustomerReviewSection"
import LandingPageFooter from "./homeComponents/Footer"
import SubscriptionSection from "./homeComponents/SubsciptionSection"
import FAQSection from "./homeComponents/FAQSection"
import ServicesShowcase from "./homeComponents/ServiceShowCaseComponent"
import HeroSection from "./homeComponents/HeroSection"
import TopBar from "./homeComponents/TopBar"
import TrustHero from "./BlogComponents/TrustHero"
import TrustFeatures from "./BlogComponents/TrustSection"
import VerificationFeatures from "./BlogComponents/VerificationFeature"
import HowIDVWorks from "./BlogComponents/HowIdvWorks"
import ProductBenefitsCarousel from "./BlogComponents/ProductBenefit"

export default function BlogPage() {

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30">

      {/* Main content area, with a left margin on desktop to make space for the sidebar */}
    
        {/* A single, unified header that handles its own responsiveness */}
        {/* <TopBar/> */}
        <HomePageHeader />
       <TrustHero/>
        {/* <ServicesShowcase/> */}
        <VerificationFeatures/>
        <HowIDVWorks/>
        <StatsBanner/>
        <ProductBenefitsCarousel/>
        <TrustFeatures/>
        <LandingPageFooter/>


    </div>
  )
}
