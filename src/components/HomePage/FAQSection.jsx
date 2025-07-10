"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const faqData = [
  {
    question: "How does VerifyMyKyc work?",
    answer:
      "VerifyMyKyc uses advanced AI and machine learning algorithms to verify identity documents in real-time. Simply upload your document, and our system will validate it against multiple databases and security checks within seconds.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, absolutely. We use bank-grade encryption and comply with international security standards including ISO 27001 and SOC 2. Your data is encrypted both in transit and at rest, and we never store sensitive information longer than necessary.",
  },
  {
    question: "Does VerifyMyKyc work in large team?",
    answer:
      "Yes, VerifyMyKyc is designed to scale with your business. We offer enterprise plans with bulk verification capabilities, team management features, API access, and dedicated support for large organizations.",
  },
  {
    question: "How do create a new account?",
    answer:
      "Creating an account is simple. Click the 'Sign Up' button, provide your email and basic information, verify your email address, and you'll be ready to start verifying documents immediately. No credit card required for the trial.",
  },
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState([])

  const toggleItem = (index) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently asked Questions</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Most questions and concerns about VerifyMyKyc can be found. Our platform has become popular and most
              trusted. Checkout some answers you are looking for.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium">
              Read more
            </Button>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Collapsible key={index} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                    <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                    {openItems.includes(index) ? (
                      <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
