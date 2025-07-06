import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function UserDetailsCard() {
  return (
    <a href="/user-details" className="block  group">
      <Card className="max-w-88 max-h-90 shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-300 ease-in-out group-hover:-translate-x-1 group-hover:-translate-y-1">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-lg font-semibold text-gray-900">User Details</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                value="Tushar Rodrick"
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-700 text-sm h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">PAN</label>
              <Input
                value="DAPVH1867R"
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-700 text-sm h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">DOB</label>
              <Input
                value="DD-MM-YYYY"
                placeholder="DD-MM-YYYY"
                className="bg-gray-50 border-gray-200 text-gray-500 text-sm h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
