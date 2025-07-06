import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function UserInfoCard() {
  return (
    <a href="/user-info" className="block group">
      <Card className="max-h-90 max-w-88 shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-300 ease-in-out group-hover:-translate-x-1 group-hover:-translate-y-1">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-lg font-semibold text-gray-900">User Information</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-6">
          {/* Information Fields */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <span className="text-sm text-gray-600">Name, Last Name</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">PAN:</span>
              <span className="text-sm text-gray-600">user@email.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Phone:</span>
              <span className="text-sm text-gray-600">+91 965 636 123</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Place:</span>
              <span className="text-sm text-gray-600">Hardcoded</span>
            </div>
          </div>

          {/* Verified Badge */}
          <div>
            <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs font-medium">
              Verified
            </Badge>
          </div>

          {/* Price and Buy Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-blue-600 font-semibold">
              <span className="text-lg">₹ 2.4</span>
              <span className="text-xs text-gray-500 ml-1">purchases</span>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-medium"
              onClick={(e) => e.preventDefault()}
            >
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
