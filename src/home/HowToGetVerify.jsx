"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, Play, FileText, Shield, Clock, CheckCircle, User, CreditCard, Car, Vote, IdCard, Building, Banknote, Smartphone, Mail, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "./homeComponents/Header"
import Footer from "./homeComponents/Footer"
import { useNavigate } from "react-router-dom"

export default function HowToVerifyPage() {
  const [expandedSection, setExpandedSection] = useState("start")
  const navigate = useNavigate()
  
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? "" : sectionId)
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  const verificationSteps = [
    {
      id: "start",
      title: "Start Verification",
      icon: <Play className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>Begin your KYC journey by visiting our secure platform. No app download needed — it works instantly on web or mobile.</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800"><strong>💡 Pro Tip:</strong> Make sure you have a stable internet connection for the best experience.</p>
          </div>
        </div>
      ),
    },
    {
      id: "choose-document",
      title: "Choose What You Want to Verify",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">Select the document or ID you want to verify from our supported options:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Aadhaar", icon: <User className="w-4 h-4" />, desc: "Government ID verification" },
              { name: "PAN Card", icon: <CreditCard className="w-4 h-4" />, desc: "Tax identification" },
              { name: "Driving License", icon: <Car className="w-4 h-4" />, desc: "Driving permit verification" },
              { name: "Voter ID", icon: <Vote className="w-4 h-4" />, desc: "Electoral identity proof" },
              { name: "Passport", icon: <IdCard className="w-4 h-4" />, desc: "International travel document" },
              { name: "Vehicle RC", icon: <Car className="w-4 h-4" />, desc: "Vehicle registration" },
              { name: "Bank Account", icon: <Banknote className="w-4 h-4" />, desc: "Banking details verification" },
              { name: "UPI ID", icon: <Smartphone className="w-4 h-4" />, desc: "Digital payment verification" },
              { name: "GST/Business", icon: <Building className="w-4 h-4" />, desc: "Business registration details" }
            ].map((doc, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">{doc.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "enter-details",
      title: "Enter Your Details",
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>Fill in your basic information or document number. The process is simple and secure.</p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800"><strong>⚠️ Note:</strong> For some documents like Aadhaar, you may receive an OTP to confirm your identity.</p>
          </div>
          <p>Make sure to enter accurate information to ensure successful verification.</p>
        </div>
      ),
    },
    {
      id: "instant-verification",
      title: "Instant Verification",
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">Within seconds, your details are verified in real-time through trusted and government-authorized sources.</p>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">You'll see confirmation of:</h4>
            <div className="space-y-3">
              {[
                { item: "Name Match", desc: "Verify if the name matches official records" },
                { item: "Document Validity", desc: "Check if the document is authentic and active" },
                { item: "Key Details", desc: "Confirm DOB, address, and other important information" }
              ].map((check, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{check.item}</p>
                    <p className="text-sm text-gray-600">{check.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Secure and Private",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p><strong>Your data is safe with us:</strong></p>
          <div className="space-y-3">
            {[
              "🔒 Aadhaar number is always masked",
              "🚫 No sensitive information is stored",
              "📋 We follow strict data protection policies",
              "🛡️ Bank-level security encryption"
            ].map((item, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-green-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "get-verified",
      title: "Get Verified, Instantly",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">Whether you're opening a bank account, joining a platform, or verifying identity for any service — Verify My KYC makes it instant, easy, and trustworthy.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold">✅ 95%+ Coverage Across India</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold">⚡ Verification Speed: ~0.5 to 3 Seconds</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-semibold">🔒 Trusted by Top Brands</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-orange-800 font-semibold">🏆 India's #1 KYC Verification Platform</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Header/>
      {/* <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Get Verified</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Fast, Secure & Seamless Identity Verification
            </p>
            <div className="text-lg text-blue-200">
              Follow these simple steps to verify your identity in seconds
            </div>
          </motion.div>
        </div>
      </div> */}
       <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Get Verified</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fast, Secure & Seamless Identity Verification
            </p>
             <div className="text-lg text-blue-200">
              Follow these simple steps to verify your identity in seconds
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {verificationSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(step.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">{step.icon}</div>
                        <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedSection === step.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === step.id ? "auto" : 0,
                    opacity: expandedSection === step.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="border-t border-gray-200 pt-6">{step.content}</div>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="shadow-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-8">
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Verified?</h3>
                <p className="text-gray-700 mb-6">
                  Start your instant KYC verification process now. It takes less than a minute!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={()=>navigate("/user")}  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Start Verification Now
                  </button>
                  <div onClick={()=>navigate("/contact-us")} className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
                    <Mail className="w-5 h-5 mr-2" />
                    Need Help? Contact Us
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center p-6 bg-green-50 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">95%+</div>
              <div className="text-sm text-green-800">Coverage Across India</div>
            </Card>
            <Card className="text-center p-6 bg-blue-50 border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;3s</div>
              <div className="text-sm text-blue-800">Average Verification Time</div>
            </Card>
            <Card className="text-center p-6 bg-purple-50 border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">9+</div>
              <div className="text-sm text-purple-800">Document Types Supported</div>
            </Card>
            <Card className="text-center p-6 bg-orange-50 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-orange-800">Available Service</div>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  )
}