"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Minus, HelpCircle, Search, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const faqData = [
  // ... (same as before)
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
    <Card className="group overflow-hidden border border-gray-200 hover:border-[#1987BF]/30 transition-all duration-300 hover:shadow-lg bg-white">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full text-left p-6 hover:bg-gray-50/50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {faq.popular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#1987BF]/10 text-[#1987BF] border border-[#1987BF]/20">
                    Popular
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{faq.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1987BF] transition-colors duration-200 pr-4">
                {highlightText(faq.question, searchTerm)}
              </h3>
            </div>
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center
                transition-all duration-300 group-hover:border-[#1987BF] group-hover:bg-[#1987BF]/10
                ${isOpen ? "border-[#1987BF] bg-[#1987BF]/10 rotate-180" : ""}
              `}
            >
              {isOpen ? (
                <Minus className="w-4 h-4 text-[#1987BF]" />
              ) : (
                <Plus className="w-4 h-4 text-gray-600 group-hover:text-[#1987BF]" />
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
      </CardContent>
    </Card>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState([1]) // First item open by default
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

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
          {/* Left Column - Content */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#1987BF]/10 text-[#1987BF] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <HelpCircle className="w-4 h-4" />
                  Support Center
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently asked Questions</h2>

                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Most questions and concerns about VerifyMyKyc can be found here. Our platform has become the most
                  popular and trusted verification solution. Check out some answers you're looking for.
                </p>

                <Button className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <span className="flex items-center gap-2">
                    View All Documentation
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#1987BF] mb-2">24/7</div>
                  <div className="text-gray-600 text-sm font-medium">Support Available</div>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#1987BF] mb-2">2min</div>
                  <div className="text-gray-600 text-sm font-medium">Avg Response Time</div>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-[#1987BF]/30 text-gray-700 hover:text-[#1987BF] transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Start Live Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-[#1987BF]/30 text-gray-700 hover:text-[#1987BF] transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 mr-3" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-[#1987BF]/30 text-gray-700 hover:text-[#1987BF] transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Search and Filters */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white border-gray-200 focus:border-[#1987BF] focus:ring-[#1987BF]/20 rounded-xl shadow-sm"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={`
                        rounded-full transition-all duration-200
                        ${
                          selectedCategory === category
                            ? "bg-[#1987BF] hover:bg-[#1987BF]/90 text-white shadow-md"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1987BF]/30"
                        }
                      `}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Popular Questions */}
              {searchTerm === "" && selectedCategory === "All" && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#1987BF] rounded-full"></span>
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