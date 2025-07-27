"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Shield, Zap, Star, ArrowRight, Globe, Lock } from "lucide-react"
import Footer from "./homeComponents/Footer"
import Header from "./homeComponents/Header"
import { useEffect } from "react"

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const PricingPage = () => {

  const [selectedPlan, setSelectedPlan] = useState("professional")

  // Pricing data - easily replaceable for dynamic content
  const verificationServices = [
    { name: "Address Verification", price: 299, popular: false },
    { name: "PAN Verification", price: 399, popular: true },
    { name: "Profile Lookup", price: 299, popular: false },
    { name: "GSTIN Verification", price: 299, popular: false },
    { name: "Aadhaar Verification", price: 299, popular: true },
    { name: "Driving License Verification", price: 299, popular: false },
    { name: "Bank Account Verification", price: 299, popular: false },
    { name: "Voter ID Verification", price: 299, popular: false },
    { name: "Liveness Detection", price: 299, popular: false },
    { name: "Face Match", price: 299, popular: false },
    { name: "Passport Verification", price: 299, popular: false },
    { name: "Company Verification", price: 299, popular: false },
    { name: "MSME Verification", price: 299, popular: false },
    { name: "FSSAI License Verification", price: 299, popular: false },
    { name: "Employment Verification", price: 299, popular: false },
    { name: "Vehicle RC Verification", price: 299, popular: false },
  ]

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for small businesses getting started",
      price: "Pay per use",
      features: [
        "Individual verification requests",
        "Standard processing time",
        "Email support",
        "Basic dashboard",
        "API access",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for growing businesses with regular needs",
      price: "₹2,499/month",
      originalPrice: "₹4,999",
      features: [
        "Up to 100 verifications/month",
        "Priority processing",
        "24/7 chat support",
        "Advanced analytics",
        "Webhook integration",
        "Custom branding",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "primary",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Custom solutions for large-scale operations",
      price: "Custom pricing",
      features: [
        "Unlimited verifications",
        "Instant processing",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
        "Advanced security features",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Bank-grade Security",
      description: "End-to-end encryption and compliance with industry standards",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get verification results in seconds, not hours",
    },
    {
      icon: Globe,
      title: "Pan-India Coverage",
      description: "Comprehensive verification across all Indian states",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "No data storage policy ensures complete privacy",
    },
  ]

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])
  

  return (
    <div className="min-h-screen bg-white text-gray-800">
        <Header/>
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-sky-100 py-20 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Simple, Transparent <span className="text-blue-600">Pricing</span>
          </motion.h1>
          <motion.p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto" variants={itemVariants}>
            Choose the perfect plan for your verification needs. All plans include access to our comprehensive suite of
            verification services.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>24/7 support</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        className="py-20 bg-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border ${
                  plan.popular ? "border-blue-500 scale-105" : "border-gray-200 hover:scale-[1.02]"
                } flex flex-col`}
                variants={itemVariants}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-sky-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 flex-1">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      {plan.originalPrice && (
                        <div className="text-lg text-gray-500 line-through mb-1">{plan.originalPrice}</div>
                      )}
                      <div className="text-5xl font-extrabold text-gray-900">{plan.price}</div>
                      {plan.id === "professional" && (
                        <div className="text-sm text-green-600 font-semibold mt-2">Save 50% for first 3 months</div>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.buttonVariant === "primary"
                        ? "bg-gradient-to-r from-blue-600 to-sky-700 text-white hover:shadow-lg transform hover:-translate-y-1"
                        : "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Verification Services */}
      <motion.div
        className="py-20 bg-gradient-to-br from-blue-50 to-sky-50 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" variants={itemVariants}>
              All Verification Services Included
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Access our complete suite of verification services with any plan. Pay-per-use pricing for maximum
              flexibility.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {verificationServices.map((service, index) => (
              <motion.div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border ${
                  service.popular ? "border-blue-200" : "border-gray-100"
                }`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  {service.popular && (
                    <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                      Popular
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">₹{service.price}</div>
                  <div className="text-sm text-gray-500">per verification</div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center mt-12" variants={itemVariants}>
            <button className="bg-gradient-to-r from-blue-600 to-sky-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
              Start Verifying Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="py-20 bg-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" variants={itemVariants}>
              Why Choose Our Platform?
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Built for businesses that need reliable, fast, and secure verification services.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-20 bg-gradient-to-r from-blue-700 to-sky-800 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6" variants={itemVariants}>
            Ready to Get Started?
          </motion.h2>
          <motion.p className="text-xl text-blue-100 mb-8" variants={itemVariants}>
            Join thousands of businesses that trust us for their verification needs.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </motion.div>
      <Footer/>
    </div>
  )
}

export default PricingPage
