import { ChevronRight } from "lucide-react"
import { useState } from "react"

const verificationOptions = [
  { name: "Verify PAN", isActive: true },
  { name: "Fetch Name On PAN Card", isActive: false },
  { name: "Fetch PAN Lite", isActive: false },
  { name: "Fetch PAN Advanced", isActive: false },
  { name: "Fetch PAN Lite Plus", isActive: false },
  { name: "Verify PAN V2", isActive: false },
  { name: "Fetch PAN Detailed", isActive: false },
  { name: "Verify Business PAN", isActive: false },
  { name: "Fetch PAN Essentials", isActive: false },
]

export default function ServicesList() {
  const [options, setOptions] = useState(verificationOptions)

  const handleOptionClick = (clickedIndex) => {
    setOptions(options.map((option, index) => ({
      ...option,
      isActive: index === clickedIndex
    })))
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
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`flex items-center justify-between py-4 px-4 -mx-4 cursor-pointer transition-colors ${
                option.isActive ? "bg-blue-50 border-r-4 border-blue-500" : "hover:bg-gray-50"
              }`}
            >
              <span className={`text-sm ${option.isActive ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                {option.name}
              </span>
              {!option.isActive && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}