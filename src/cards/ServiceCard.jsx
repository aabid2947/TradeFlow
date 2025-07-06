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

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="overflow-hidden border border-[#1A89C1] p-1 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={imageSrc}
              alt={alt || serviceName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Heart Icon */}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>

          {/* Demand Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
              {demandLevel}
            </Badge>
          </div>
        </div>

        <CardContent className="p-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
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
            >
              {isPurchased && <Check className="w-4 h-4" />}
              {isPurchased ? "Purchased" : "Subscribe"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
