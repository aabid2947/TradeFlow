import { Gauge, Target, FileCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const trustFeatures = [
  {
    icon: Gauge,
    title: "SPEED",
    color: "text-green-500",
  },
  {
    icon: Target,
    title: "ACCURACY",
    color: "text-green-500",
  },
  {
    icon: FileCheck,
    title: "COMPLIANCE",
    color: "text-green-500",
  },
]

const companyLogos = [
  { name: "Gartner", logo: "Gartner" },
  { name: "Forrester", logo: "Forrester" },
  { name: "Liminal", logo: "Liminal" },
  { name: "Acuity", logo: "ACUITY" },
  { name: "Chartis", logo: "Chartis" },
  { name: "QKS Group", logo: "QKSGroup" },
]

export default function TrustSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div>
            {/* Main Heading */}
            <h2 className="text-4xl font-bold text-gray-900 mb-12 leading-tight">
              How returning <span className="text-blue-500">customer trust</span> on our products.
            </h2>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <feature.icon className={`w-12 h-12 ${feature.color}`} />
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-500 font-medium">Verify</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                </div>
              ))}
            </div>

            {/* Company Logos */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {companyLogos.map((company, index) => (
                <div key={index} className="flex items-center justify-center p-4">
                  <span className="text-gray-600 font-medium text-sm">{company.logo}</span>
                </div>
              ))}
            </div>

            {/* Award Badge */}
            <Card className="bg-gradient-to-r from-green-800 to-green-900 text-white max-w-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 px-2 py-1 rounded text-xs font-medium">FEATURED</div>
                </div>
                <h3 className="text-xl font-bold mt-3 mb-2">CATEGORY LEADER</h3>
                <p className="text-sm text-green-100 mb-4">
                  Verify is a leader in the GRC 2023 Service Matrix™ for Identity Capture and Verification
                </p>
                <Button variant="link" className="text-white p-0 h-auto font-medium text-sm">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:pl-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Here's what the experts say</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Recognition for our tech innovation, leadership, and mission to make the internet a safer place.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium">
              Awards & recognition <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
