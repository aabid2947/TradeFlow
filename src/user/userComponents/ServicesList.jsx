import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetServicesQuery } from "../../app/api/serviceApiSlice"

export default function ServicesList() {
  const [activeServiceId, setActiveServiceId] = useState(null)
  const { data: apiResponse, isLoading, isError, error } = useGetServicesQuery();

  // Extract services from API response
  const services = apiResponse?.data || [];

  // Initialize active service to first item when data loads
  useEffect(() => {
    if (services.length > 0 && !activeServiceId) {
      setActiveServiceId(services[0].service_key);
    }
  }, [services, activeServiceId]);

  const handleOptionClick = (serviceId) => {
    setActiveServiceId(serviceId);
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">PAN Card Verification</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <h2 className="text-base font-medium text-gray-900 mb-4">Offerings</h2>

        {/* Verification Options List */}
        <div className="space-y-0">
          {services.map((service) => {
            const isActive = service.service_key === activeServiceId;
            
            return (
              <div
                key={service.service_key}
                onClick={() => handleOptionClick(service.service_key)}
                className={`flex items-center justify-between py-4 px-4 -mx-4 cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-blue-50 border-r-4 border-blue-500" 
                    : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${isActive ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                  {service.name}
                </span>
                {!isActive && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}