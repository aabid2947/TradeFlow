import { Heart, Shield, Clock, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ServiceCard({
  imageSrc,
  alt = "",
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  buttonState, // "purchased" | "subscribe"
}) {
  const isPurchased = buttonState === "purchased"

  // In a real app, you might use React Router's Link component
  // For this example, a simple anchor tag is used for navigation
  return (
    <a href="/service" className="block w-full min-w-66 px-2 mx-auto group">
      <Card className="overflow-hidden border border-[#1A89C1] p-1 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 ease-in-out group-hover:-translate-y-2">
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[4/2.8] overflow-hidden">
            <img
              src={imageSrc}
              alt={alt || serviceName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <CardContent className="p-1 space-y-2">
          <div className="flex items-center justify-between gap-4 ">
            {/* Demand Badge */}
            <div className="">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                {demandLevel}
              </Badge>
            </div>
            {/* Heart Icon */}
            <button className=" p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 ">
            {serviceName}
          </h3>
          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {verificationCount} Verification
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {durationDays} days
              </span>
            </div>
          </div>

          {/* Price and Action Button */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-orange-500">₹ {price}</div>
            <Button
              size="sm"
              className={`${
                isPurchased
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5`}
              // Prevent the button click from triggering the card's navigation
              onClick={(e) => e.preventDefault()}
            >
              {isPurchased && <Check className="w-4 h-4" />}
              {isPurchased ? "Purchased" : "Subscribe"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
