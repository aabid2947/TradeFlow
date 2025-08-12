"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Minus, HelpCircle, Search, MessageCircle, Phone, Mail,Contact,ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
const faqData = [
  {
    id: 1,
    category: "Getting Started",
    question: "How does VerifyMyKyc work?",
    answer:
      "VerifyMyKyc uses advanced AI and machine learning algorithms to verify identity documents in real-time. Simply upload your document through our secure web interface, and our system validates it against multiple databases and security checks within seconds. Our platform supports over 50+ document types and provides instant verification results with detailed compliance reports.",
    popular: true,
  },
  {
    id: 2,
    category: "Security",
    question: "Is my data secure with VerifyMyKyc?",
    answer:
      "Absolutely. We use bank-grade encryption (AES-256) and comply with international security standards including ISO 27001, SOC 2, and GDPR. Your data is encrypted both in transit and at rest, stored in secure data centers, and we never store sensitive information longer than necessary. We also provide detailed audit logs and compliance reports for your peace of mind.",
    popular: true,
  },
  {
    id: 3,
    category: "Enterprise",
    question: "Does VerifyMyKyc work for large teams and enterprises?",
    answer:
      "Yes, VerifyMyKyc is designed to scale with your business needs. We offer enterprise plans with bulk verification capabilities, team management features,custom integrations, and 24/7 priority support. Our platform can handle millions of verifications per month with 99.9% uptime guarantee.",
    popular: false,
  },
  {
    id: 4,
    category: "Account",
    question: "How do I create a new account?",
    answer:
      "Creating an account is simple and takes less than 2 minutes. Click the 'Sign Up' button, provide your email and basic business information, verify your email address through the confirmation link we send, and you'll be ready to start verifying documents immediately. No credit card required for the trial period.",
    popular: true,
  },
  {
    id: 5,
    category: "Pricing",
    question: "What are your pricing plans?",
    answer:
      "We offer flexible pricing plans to suit businesses of all sizes. Our plans start from ₹2 per verification for basic document checks, with volume discounts available. Enterprise customers get custom pricing based on their specific needs, including dedicated support, custom integrations, and SLA guarantees. Contact our sales team for a personalized quote.",
    popular: false,
  },
  {
    id: 6,
    category: "Integration",
    question: "How easy is it to use VerifyMyKyc ?",
    answer:
      "Our REST is designed for developers and can be integrated in minutes. We provide comprehensive documentation, SDKs for popular programming languages (Python, Node.js, PHP, Java), code examples, and sandbox environment for testing. Most integrations are completed within a few hours, and our technical support team is available to assist you.",
    popular: false,
  },
  {
    id: 7,
    category: "Support",
    question: "What kind of support do you provide?",
    answer:
      "We provide multiple support channels including 24/7 live chat, email support, phone support for enterprise customers, comprehensive documentation, video tutorials, and a community forum. Our average response time is under 2 hours, and we offer dedicated account managers for enterprise clients.",
    popular: false,
  },
  {
    id: 8,
    category: "Compliance",
    question: "Are you compliant with regulatory requirements?",
    answer:
      "Yes, we maintain compliance with major regulatory frameworks including KYC/AML regulations, GDPR, CCPA, PCI DSS, and local data protection laws. We regularly undergo third-party security audits and maintain certifications like ISO 27001 and SOC 2 Type II. We also provide compliance reports and audit trails for your regulatory needs.",
    popular: false,
  },
]
const categories = ["All", ...Array.from(new Set(faqData.map((faq) => faq.category)))]

const FAQItem = ({
  faq,
  isOpen,
  onToggle,
  searchTerm,
}) => {
  const highlightText = (text, term) => {
    if (!term) return text
    const regex = new RegExp(`(${term})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="group overflow-hidden border border-gray-200 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg bg-white rounded-lg">
      <div className="p-0">
        <button
          onClick={onToggle}
          className="w-full text-left p-6 hover:bg-gray-50/50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {faq.popular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    Popular
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{faq.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 pr-4">
                {highlightText(faq.question, searchTerm)}
              </h3>
            </div>
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center
                transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-500/10
                ${isOpen ? "border-blue-500 bg-blue-500/10 rotate-180" : ""}
              `}
            >
              {isOpen ? (
                <Minus className="w-4 h-4 text-blue-600" />
              ) : (
                <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              )}
            </div>
          </div>
        </button>

        {/* Expandable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-6 pb-6 pt-2">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{highlightText(faq.answer, searchTerm)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState([1]) // First item open by default
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const navigate = useNavigate()

  const toggleItem = (id) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularFAQs = faqData.filter((faq) => faq.popular)

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Content (Not Sticky) */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <HelpCircle className="w-4 h-4" />
                  Support Center
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently asked Questions</h2>

                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Most questions and concerns about VerifyMyKyc can be found here. Our platform has become the most
                  popular and trusted verification solution. Check out some answers you're looking for.
                </p>

                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <span className="flex items-center gap-2">
                    View All Documentation
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button> */}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600 text-sm font-medium">Support Available</div>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2min</div>
                  <div className="text-gray-600 text-sm font-medium">Avg Response Time</div>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h3>
                <div className="space-y-3">
                  {/* <button className="w-full justify-start bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500/30 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-3 rounded-lg flex items-center">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Start Live Chat
                  </button> */}
                  <button onClick={()=>navigate("/contact-us")} className="w-full justify-start bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500/30 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-3 rounded-lg flex items-center">
                    <Contact className="w-4 h-4 mr-3" />
                    Contact us
                  </button>
                  {/* <button className="w-full justify-start bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500/30 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-3 rounded-lg flex items-center">
                    <Phone className="w-4 h-4 mr-3" />
                    Schedule Call
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ Items (Sticky) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-8 space-y-8 max-h-screen overflow-y-auto">
              {/* Search and Filters */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 w-full bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl shadow-sm outline-none"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium
                        ${
                          selectedCategory === category
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-500/30"
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Questions */}
              {searchTerm === "" && selectedCategory === "All" && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Most Popular Questions
                  </h3>
                  <div className="space-y-4">
                    {popularFAQs.slice(0, 3).map((faq, index) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isOpen={openItems.includes(faq.id)}
                        onToggle={() => toggleItem(faq.id)}
                        searchTerm={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Questions */}
              <div>
                {searchTerm || selectedCategory !== "All" ? (
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""} found
                  </h3>
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    All Questions
                  </h3>
                )}

                <div className="space-y-4">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                      <div key={faq.id}>
                        <FAQItem
                          faq={faq}
                          isOpen={openItems.includes(faq.id)}
                          onToggle={() => toggleItem(faq.id)}
                          searchTerm={searchTerm}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                      <p className="text-gray-600">Try adjusting your search terms or browse all categories</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}