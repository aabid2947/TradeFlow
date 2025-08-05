import { useState } from "react"
import { ChevronDown } from "lucide-react"

const Step = ({ stepNumber, title, description, isOpen, onClick }) => (
  <div className="relative mb-6">
    {stepNumber < 4 && <div className="absolute left-[15px] top-8 h-full w-0.5 bg-gray-300" />}
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm z-10 transition-all duration-200 ${isOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600 hover:bg-green-400 hover:text-white'}`}>
        {stepNumber}
      </div>
      <div className={`flex-1 bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${isOpen ? 'bg-white border-l-4 border-green-500' : 'hover:bg-gray-100'}`} onClick={() => onClick(stepNumber)}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>{title}</h3>
          <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function HowIDVWorks({ data }) {
  const {
    howItWorksTitle = 'How IDV works',
    howItWorksDescription = 'Our solution combines AI-powered automation with human feedback.',
    howItWorksImage,
    howItWorksSteps = []
  } = data || {};

  const [openStep, setOpenStep] = useState(1);
  const handleStepClick = (stepNumber) => setOpenStep(stepNumber === openStep ? 0 : stepNumber);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-2">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img src={howItWorksImage?.url || 'https://placehold.co/450x600'} width="450" height="600" alt="Identity verification process" className="rounded-lg object-cover shadow-lg" />
              {/* ... Image overlay elements ... */}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 mb-4">{howItWorksTitle}</h2>
              <p className="text-gray-600 md:text-lg">{howItWorksDescription}</p>
            </div>
            <div className="relative">
              {howItWorksSteps.map((step, index) => (
                <Step key={index + 1} stepNumber={index + 1} title={step.title} description={step.description} isOpen={openStep === index + 1} onClick={handleStepClick} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}