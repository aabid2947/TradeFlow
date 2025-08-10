"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Shield, Zap, Star, ArrowRight, Globe, Lock } from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Footer from "./homeComponents/Footer"
import Header from "./homeComponents/Header"
import { Badge } from "@/components/ui/badge"

import useRazorpay from "@/hooks/useRazorpay"
import { useCreateSubscriptionOrderMutation, useVerifySubscriptionPaymentMutation } from "@/app/api/paymentApiSlice"
import { selectCurrentUser } from "@/features/auth/authSlice"
import SubscriptionComponent from "./homeComponents/SubsciptionSection"
// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('professional'); // Default highlighted plan
  const navigate = useNavigate()
  const razorpayLoaded = useRazorpay()
  const user = useSelector(selectCurrentUser)

  const [createSubscriptionOrder, { isLoading: isCreatingOrder }] = useCreateSubscriptionOrderMutation()
  const [verifySubscriptionPayment, { isLoading: isVerifyingPayment }] = useVerifySubscriptionPaymentMutation()

  const handlePurchase = async (planName, planType) => {
    if (!user) {
      toast.info("Please log in to purchase a plan.")
      navigate("/login")
      return
    }

    if (!razorpayLoaded) {
      toast.error("Payment gateway is still loading. Please wait a moment.")
      return
    }

    try {
      const orderData = await createSubscriptionOrder({ planName, planType }).unwrap()

      if (orderData.paymentSkipped) {
        toast.success("Subscription activated successfully!")
        navigate("/user")
        return
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Verify My KYC",
        description: `Subscription for ${planName} - ${planType} plan`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            await verifySubscriptionPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId: orderData.transactionId,
            }).unwrap()

            toast.success("Payment successful! Your subscription is active.")
            navigate("/user")
          } catch (verifyError) {
            toast.error(verifyError.data?.message || "Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        notes: {
          transactionId: orderData.transactionId,
          userId: user._id,
        },
        theme: {
          color: "#2563EB",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      toast.error(err.data?.message || "An error occurred. Please try again.")
    }
  }

  const isLoading = isCreatingOrder || isVerifyingPayment;

  // Hardcoded pricing data for the main plans
  const plans = [
    {
      id: "personal",
      name: "Personal",
      description: "For Individuals",
      monthlyPrice: "₹4,999",
      yearlyPrice: "₹38,499",
      features: [
        "25 Verifications Included",
        "Aadhaar & PAN",
        "Driving License & Voter ID",
        "Address Verification",
        "Criminal Check",
        "Profile Lookup",
      ],
      buttonText: "Choose Plan ",
      buttonVariant: "outline",
    },
    {
      id: "professional",
      name: "Professional",
      description: "For Small Businesses",
      monthlyPrice: "₹18,999",
      yearlyPrice: "₹1,46,299",
      features: [
        "100 Verifications Included",
        "All Personal Features +",
        "Passport & RC",
        "Bank & GSTIN Verification",
        "Employment Check",
        "Liveness & Face Match",
        "CoWIN",
      ],
      buttonText: "Choose Plan",
      buttonVariant: "primary",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For Corporates / High-Volume Needs",
      monthlyPrice: "₹89,999",
      yearlyPrice: "₹6,92,999",
      features: [
        "500 Verifications Included",
        "All Professional Features +",
        "Unlimited Category Access",
        "Custom Distribution",
        "All 20+ Verification Types",
        "SLA Support & Reporting",
        "Dedicated Manager",
      ],
      buttonText: "Choose Plan",
      buttonVariant: "outline",
    },
  ]

  // Hardcoded data for service display section
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

  // Hardcoded data for features section
  const features = [
    { icon: Shield, title: "Bank-grade Security", description: "End-to-end encryption and compliance with industry standards" },
    { icon: Zap, title: "Lightning Fast", description: "Get verification results in seconds, not hours" },
    { icon: Globe, title: "Pan-India Coverage", description: "Comprehensive verification across all Indian states" },
    { icon: Lock, title: "Privacy First", description: "No data storage policy ensures complete privacy" },
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <motion.div
        className="bg-gradient-to-br from-blue-50 to-sky-100 py-20 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight" variants={itemVariants}>
            Simple, Transparent <span className="text-blue-600">Pricing</span>
          </motion.h1>
          <motion.p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto" variants={itemVariants}>
            Choose the perfect plan for your verification needs. All plans include access to our comprehensive suite of verification services.
          </motion.p>

          <motion.div className="flex items-center justify-center gap-3 mb-8" variants={itemVariants}>
            <span className={`text-lg font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isAnnual ? "bg-blue-600" : "bg-gray-700"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-6" : "translate-x-1"}`}/>
            </button>
            <span className={`text-lg font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>Annual</span>
            {/* {isAnnual && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm">Save on yearly billing!</Badge>} */}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="py-20 bg-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const isPlanActive = user?.activeSubscriptions?.some(
                (sub) => sub.category === plan.name && new Date(sub.expiresAt) > new Date()
              );
              const isSelected = plan.id === selectedPlanId;

              return (
              <motion.div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border cursor-pointer ${isSelected ? "border-blue-500 scale-105" : "border-gray-200 hover:scale-[1.02]"} ${isPlanActive ? "border-green-500" : ""} flex flex-col`}
                variants={itemVariants}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {/* {isSelected && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-sky-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      Most Popular
                    </div>
                  </div>
                )} */}

                {/* {isPlanActive && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Active Plan
                    </Badge>
                  </div>
                )} */}

                <div className="p-8 flex-1">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
                    <div className="mb-6 h-20 flex flex-col justify-center">
                      <div className="text-5xl font-extrabold text-gray-900">
                        {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {isAnnual ? "/year" : "/month"}
                      </div>
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card's onClick from firing
                      handlePurchase(plan.name, isAnnual ? 'yearly' : 'monthly')
                    }}
                    disabled={isLoading || isPlanActive}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${ isSelected ? "bg-gradient-to-r from-blue-600 to-sky-700 text-white hover:shadow-lg transform hover:-translate-y-1" : "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"} ${isLoading && "opacity-50 cursor-not-allowed"}`}
                  >
                    { (isLoading ? "Processing..." : plan.buttonText)}
                  </button>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </motion.div>

      {/* <motion.div
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
              Access our complete suite of verification services with any plan. Pay-per-use pricing for maximum flexibility.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {verificationServices.map((service, index) => (
              <motion.div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border ${service.popular ? "border-blue-200" : "border-gray-100"}`}
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
      </motion.div> */}

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

      {/* <motion.div
        className="py-20 bg-gradient-to-r from-blue-700 to-sky-800 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport
        ={{ once: true, amount: 0.3 }}
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
            <button onClick={()=>navigate("/contact-us")} className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </motion.div> */}
      <SubscriptionComponent/>
      <Footer/>
    </div>
  )
}

export default PricingPage;