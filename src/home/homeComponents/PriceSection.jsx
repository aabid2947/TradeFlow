
"use client"

import { useState } from "react"
import { Check, Info, Star, Zap, Shield, Users, Building } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import useRazorpay from "@/hooks/useRazorpay"
import { useCreateSubscriptionOrderMutation, useVerifySubscriptionPaymentMutation } from "@/app/api/paymentApiSlice"
import { selectCurrentUser } from "@/features/auth/authSlice"

// Hardcoded data for the pricing plans displayed in this section
const pricingPlans = [
  {
    name: "Personal",
    monthlyPrice: "₹4,999",
    yearlyPrice: "₹38,499",
    description: "For Individuals",
    icon: Users,
    features: [
      { name: "25 Verifications/month", hasInfo: false },
      { name: "Aadhaar & PAN", hasInfo: false },
      { name: "Driving License & Voter ID", hasInfo: false },
      { name: "Address Verification", hasInfo: false },
      { name: "Criminal Check", hasInfo: false },
      { name: "Profile Lookup", hasInfo: true, tooltip: "Basic profile information checks." },
    ],
    cta: "Choose Plan",
  },
  {
    name: "Professional",
    monthlyPrice: "₹18,999",
    yearlyPrice: "₹1,46,299",
    description: "For Small Businesses",
    icon: Zap,
    features: [
      { name: "100 Verifications/month", hasInfo: false },
      { name: "All Personal Features", hasInfo: false },
      { name: "Passport & RC", hasInfo: false },
      { name: "Bank & GSTIN Verification", hasInfo: false },
      { name: "Employment Check", hasInfo: true, tooltip: "Verify employment history." },
      { name: "Liveness & Face Match", hasInfo: true, tooltip: "Advanced biometric checks." },
    ],
    cta: "Choose Plan",
  },
  {
    name: "Enterprise",
    monthlyPrice: "₹89,999",
    yearlyPrice: "₹6,92,999",
    description: "For Corporates / High-Volume Needs",
    icon: Building,
    features: [
      { name: "500 Verifications/month", hasInfo: false },
      { name: "All Professional Features", hasInfo: false },
      { name: "Unlimited Category Access", hasInfo: true, tooltip: "Access to all current and future verification types." },
      { name: "All 20+ Verification Types", hasInfo: false },
      { name: "SLA Support & Reporting", hasInfo: true, tooltip: "Guaranteed uptime and detailed reports." },
      { name: "Dedicated Manager", hasInfo: true, tooltip: "A dedicated manager for your account." },
    ],
    cta: "Choose Plan",
  },
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlanName, setSelectedPlanName] = useState('Professional'); // Default highlighted plan
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
        prefill: { name: user.name, email: user.email, contact: user.mobile },
        notes: { transactionId: orderData.transactionId, userId: user._id },
        theme: { color: "#2563EB" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.data?.message || "An error occurred. Please try again.")
    }
  }

  const isLoading = isCreatingOrder || isVerifyingPayment;

  return (
    <section className="w-full to-white py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,135,191,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs md:text-sm font-medium mb-4">
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            Trusted by 50,000+ Users
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Choose the perfect plan for your verification needs.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
  <span
    className={`text-base font-semibold transition-colors duration-300 ${
      !isAnnual ? "text-blue-700" : "text-gray-700"
    }`}
  >
    Monthly
  </span>

  <button
    onClick={() => setIsAnnual(!isAnnual)}
    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isAnnual ? "bg-blue-600" : "bg-gray-700"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
        isAnnual ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>

  <span
    className={`text-base font-semibold transition-colors duration-300 ${
      isAnnual ? "text-blue-700" : "text-gray-700"
    }`}
  >
    Annual
  </span>

  {isAnnual && (
    <Badge className="bg-green-500 text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
      Save Big!
    </Badge>
  )}
</div>

        </div>
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              const isPlanActive = user?.activeSubscriptions?.some(
                (sub) => sub.category === plan.name && new Date(sub.expiresAt) > new Date()
              );
              const isSelected = plan.name === selectedPlanName;

              return (
                <Card
                  key={plan.name}
                  onClick={() => setSelectedPlanName(plan.name)}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer ${isSelected ? "border-2 border-blue-500 shadow-md scale-[1.02] bg-white" : "border border-gray-200 hover:border-blue-300 bg-white"} `}
                >
                  {/* {isSelected && (
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-xs font-semibold shadow">
                        Most Popular
                      </div>
                    </div>
                  )} */}
{/* 
                  {isPlanActive && (
                      <div className="absolute top-1 right-1">
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Active
                          </Badge>
                      </div>
                  )} */}

                  <CardHeader className="text-center pb-4 pt-7">
                    <div className="flex justify-center mb-3">
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"} transition-colors duration-300`}>
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-gray-600 text-xs mb-4 px-2">{plan.description}</p>
                    <div className="mb-3 h-16 flex flex-col justify-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-3xl md:text-4xl font-bold text-gray-900">
                          {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <div className="text-left">
                          <div className="text-xs text-gray-600">{isAnnual ? "/year" : "/month"}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-6">
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                          <span className="text-xs text-gray-700 flex-1">{feature.name}</span>
                          {feature.hasInfo && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-400 cursor-help hover:text-blue-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs max-w-xs">
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card's onClick from firing
                        handlePurchase(plan.name, isAnnual ? 'yearly' : 'monthly')
                      }}
                      disabled={isLoading }
                      className={`w-full py-3 text-sm font-semibold transition-all duration-300 ${ isSelected ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md" : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-blue-500 hover:text-blue-600"} ${isLoading && "opacity-50 cursor-not-allowed"}`}
                    >
                      { (isLoading ? "Processing..." : plan.cta)}
                    </Button>
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      No setup fees • Cancel anytime
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TooltipProvider>
        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm mb-3 font-semibold text-xl">Need a custom solution?</p>
          <Button
            onClick={() => navigate("/contact-us")}
            variant="outline"
            className="border-blue-500 md:text-lg bg-blue-600 text-white  text-sm py-2 px-4"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}