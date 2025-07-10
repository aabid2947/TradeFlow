import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SubscriptionBg from "../../assets/SubscriptionBg.svg"

export default function SubscriptionSection() {
  return (
    <div className="w-full max-w-2xl mx-auto p-8">
     
      <div className="bg-[#5394FF] rounded-2xl p-8 text-center text-white" >
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4">Subscribe for insights</h2>

        {/* Subtitle */}
        <p className="text-blue-100 mb-8 leading-relaxed">
          Get fresh insights delivered to your inbox every week. Discover trends, tips, and strategies to help you grow.
        </p>

        {/* Email Subscription Form */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white border-0 text-gray-900 placeholder:text-gray-500 h-12 px-4 rounded-lg"
          />
          <Button className="bg-green-500 hover:bg-green-600 text-white font-medium h-12 px-6 rounded-lg whitespace-nowrap">
            Subscribe
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-blue-200 leading-relaxed">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </div>
  )
}
