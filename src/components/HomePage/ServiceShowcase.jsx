import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const servicesData = [
  {
    category: "DOCUMENT VERIFICATION",
    title: "PAN Card, Aadhaar Card, Driving License, Passport",
    description:
      "Verify official government documents instantly with our advanced AI-powered verification system. Ensure authenticity and prevent fraud.",
    illustration: "💻📄",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    category: "COMPANY & CREDENTIAL VERIFICATION",
    title: "GST Registration, FSSAI License, MSME Certificate, Company Registration",
    description:
      "Comprehensive business verification services to validate company credentials, licenses, and registrations for B2B transactions.",
    illustration: "🏢📊",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    category: "BACKGROUND & RECORD CHECKS",
    title: "Criminal and Court Record Verification (CCRV), Police FIR checks",
    description:
      "Thorough background verification including criminal records, court cases, and police verification for employment and tenant screening.",
    illustration: "🔍👮",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    category: "BIOMETRIC & LIKENESS CHECKS",
    title: "Face Match, Likeness Detection",
    description:
      "Advanced biometric verification using facial recognition technology to ensure identity authenticity and prevent impersonation.",
    illustration: "👤🔍",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    category: "SPECIALIZED CHECKS",
    title: "Covid Vaccination Certificate Verification, etc.",
    description:
      "Specialized verification services including vaccination certificates, medical records, and other custom verification requirements.",
    illustration: "💉📋",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

export default function ServicesShowcase() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select the Best Services for</h2>
          <h2 className="text-3xl font-bold mb-4">
            Your <span className="text-blue-600">Company</span>/<span className="text-blue-600">Personal</span> use
          </h2>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {servicesData.map((service, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row items-center gap-6 p-6">
                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wide ${service.color}`}>
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                    <Button variant="link" className={`${service.color} p-0 h-auto font-medium text-sm`}>
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  {/* Illustration */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-32 h-32 ${service.bgColor} rounded-2xl flex items-center justify-center text-4xl`}
                    >
                      {service.illustration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  )
}
