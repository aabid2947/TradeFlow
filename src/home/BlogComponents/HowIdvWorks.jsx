import { useState } from "react"
import { ChevronDown } from "lucide-react"

const Step = ({ stepNumber, title, description, isOpen, onClick }) => {
  return (
    <div className="relative mb-6">
      {/* Vertical Line - connects the dots */}
      {stepNumber < 4 && (
        <div className="absolute left-[15px] top-8 h-full w-0.5 bg-gray-300" />
      )}

      {/* Step Content */}
      <div className="flex items-start gap-4">
        {/* Icon/Number */}
        <div
          className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm z-10 transition-all duration-200 ${
            isOpen 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600 hover:bg-green-400 hover:text-white'
          }`}
        >
          {stepNumber}
        </div>

        {/* Step Card */}
        <div
          className={`flex-1 bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
            isOpen ? 'bg-white border-l-4 border-green-500' : 'hover:bg-gray-100'
          }`}
          onClick={() => onClick(stepNumber)}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
              {title}
            </h3>
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          
          {/* Expandable Description */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IDVStepper() {
  const [openStep, setOpenStep] = useState(1) // Step 1 is open by default

  const handleStepClick = (stepNumber) => {
    setOpenStep(stepNumber === openStep ? 0 : stepNumber) // Toggle or open
  }

  const steps = [
    {
      title: "User takes a photo of their identity document",
      description:
        "Veriff guides the user through the entire process with real-time feedback and automatically identifies the document type, so the user doesn't have to manually enter data. This makes the process quicker and minimizes typing errors.",
    },
    {
      title: "The user takes a selfie",
      description:
        "After the document, the user is prompted to take a live selfie. This helps in comparing the user's face with the document photo to ensure identity.",
    },
    {
      title: "Get a decision",
      description:
        "Veriff's AI and human experts analyze the submitted data to provide a quick and accurate verification decision.",
    },
    {
      title: "Onboard your customer",
      description:
        "Once verified, your customer can proceed with onboarding, accessing services, or completing transactions seamlessly.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-2">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=450&h=600&q=80"
                width="450"
                height="600"
                alt="User taking a photo of an identity document with a smartphone"
                className="rounded-lg object-cover shadow-lg"
              />
              {/* Overlay to show it's ID verification */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="w-16 h-12 bg-white/80 rounded border-2 border-dashed border-white mb-2" />
                  <p className="text-xs font-medium">ID Document</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text and Stepper */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 mb-4">
                How IDV works
              </h2>
              <p className="text-gray-600 md:text-lg">
                Veriff's Identity and Document Verification solution combines AI-powered automation with reinforced
                learning from human feedback, and if required, manual validation. With support for more than 12,000
                document specimens from more than 230 countries and territories, we offer speed, convenience, and
                reduced friction to convert more users, mitigate fraud, and comply with regulations.
              </p>
            </div>

            {/* Stepper Section */}
            <div className="relative">
              {steps.map((step, index) => (
                <Step
                  key={index + 1}
                  stepNumber={index + 1}
                  title={step.title}
                  description={step.description}
                  isOpen={openStep === index + 1}
                  onClick={handleStepClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}