import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook to get URL parameters
import { useGetBlogBySlugQuery } from "@/app/api/blogApiSlice"; // Import the hook

import HomePageHeader from "./homeComponents/Header";
import StatsBanner from "./homeComponents/StatsBanner";
import LandingPageFooter from "./homeComponents/Footer";
import TrustHero from "./BlogComponents/TrustHero";
import TrustFeatures from "./BlogComponents/TrustSection";
import VerificationFeatures from "./BlogComponents/VerificationFeature";
import HowIDVWorks from "./BlogComponents/HowIdvWorks";
import ProductBenefitsCarousel from "./BlogComponents/ProductBenefit";
import Loader from "../components/Loader";


export default function BlogPage() {
  const { slug } = useParams(); // Get the slug from the URL, e.g., /blog/:slug
  const { data: blogResponse, isLoading, error, isSuccess } = useGetBlogBySlugQuery(slug, {
    skip: !slug, // Don't run the query if there's no slug
  });
  const blogData = blogResponse?.data;


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (isLoading) {
    return <Loader/>
  }

  if (error) {
   return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-[#1A89C1] text-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-3">💿 Oops!</h1>
        <p className="text-lg mb-2">Blog Not Found.</p>
        <p className="text-sm opacity-90 mb-6">
          {error?.statusText || error?.message || "Unexpected application error."}
        </p>
        <a
          href="/"
          className="inline-block bg-white text-[#1A89C1] font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Go back home
        </a>
      </div>
    </div>
  );
  }

  // if (!isSuccess || !blogData) {
  //   return <div className="flex justify-center items-center h-screen text-2xl"></div>;
  // }
 
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30">
      <HomePageHeader />
      {/* Pass the fetched blogData to each component */}
      <TrustHero data={blogData} />
      <VerificationFeatures data={blogData} />
      <HowIDVWorks data={blogData} />
      <StatsBanner />
      <ProductBenefitsCarousel data={blogData} />
      <TrustFeatures data={blogData} />
      <LandingPageFooter />
    </div>
  );
}