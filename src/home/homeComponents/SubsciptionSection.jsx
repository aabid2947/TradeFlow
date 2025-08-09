"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Mail, Send, CheckCircle, Sparkles, Gift, Bell, UserCheck } from "lucide-react" // Added UserCheck
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSubscribeToNewsletterMutation } from "@/app/api/authApiSlice" 
import { selectCurrentUser } from "../../features/auth/authSlice"
import { useSelector } from "react-redux"

export default function SubscriptionComponent() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [emailError, setEmailError] = useState("")
  const sectionRef = useRef(null)

  const user = useSelector(selectCurrentUser)
  const [subscribeToNewsletter, { isLoading: isSubmitting }] = useSubscribeToNewsletterMutation();

  useEffect(() => {
    // Pre-fill email for logged-in, non-subscribed users
    if (user && !user.isSubscribedToNewsletter) {
      setEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailError("")

    try {
      await subscribeToNewsletter({ email }).unwrap();
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        // Do not clear email if user is logged in
        if (!user) {
          setEmail("")
        }
      }, 3000)
    } catch (err) {
      setEmailError(err.data?.message || "An unexpected error occurred. Please try again.")
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
  }

  return (
    <section ref={sectionRef} className="w-full py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF] via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-300/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`
          bg-white/95 backdrop-blur-lg rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20
          ${isVisible ? "animate-in slide-in-from-bottom-8 fade-in duration-700" : "opacity-0 translate-y-8"}
        `}
        >
          {/* Header Section */}
          <div className="text-center mb-10">
            <div
              className={`
              inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1987BF] to-blue-600 
              rounded-2xl mb-6 shadow-lg
              ${isVisible ? "animate-in zoom-in duration-500" : "opacity-0 scale-75"}
            `}
              style={{ animationDelay: "200ms" }}
            >
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div
              className={`
              inline-flex items-center gap-2 bg-[#1987BF]/10 text-[#1987BF] px-4 py-2 rounded-full text-sm font-semibold mb-6
              ${isVisible ? "animate-in slide-in-from-top-4 fade-in duration-500" : "opacity-0"}
            `}
              style={{ animationDelay: "300ms" }}
            >
              <Sparkles className="w-4 h-4" />
              Weekly Insights
            </div>
            <h2
              className={`
              text-3xl lg:text-4xl font-bold text-gray-900 mb-4
              ${isVisible ? "animate-in slide-in-from-top-4 fade-in duration-600" : "opacity-0"}
            `}
              style={{ animationDelay: "400ms" }}
            >
              Subscribe for insights
            </h2>
            <p
              className={`
              text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto
              ${isVisible ? "animate-in slide-in-from-top-4 fade-in duration-600" : "opacity-0"}
            `}
              style={{ animationDelay: "500ms" }}
            >
              Get fresh insights delivered to your inbox every week. Discover trends, tips, and strategies to help you
              grow your business with our verification solutions.
            </p>
          </div>

          {/* Benefits */}
          <div
            className={`
            grid grid-cols-1 md:grid-cols-3 gap-6 mb-10
            ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-600" : "opacity-0"}
          `}
            style={{ animationDelay: "600ms" }}
          >
            {[
              { icon: Bell, title: "Weekly Updates", desc: "Latest industry insights" },
              { icon: Gift, title: "Exclusive Content", desc: "Subscriber-only resources" },
              { icon: CheckCircle, title: "No Spam", desc: "Unsubscribe anytime" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-[#1987BF]/10 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-[#1987BF]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                  <p className="text-gray-600 text-xs">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* --- UPDATED Subscription Form Section --- */}
          <div
            className={`
            ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}
          `}
            style={{ animationDelay: "700ms" }}
          >
            {user?.isSubscribedToNewsletter ? (
              // View for users who are already subscribed
              <div className="text-center py-8 animate-in zoom-in fade-in duration-500">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You Are Subscribed!</h3>
                <p className="text-gray-600">
                  Thank you for being part of our community. Keep an eye on your inbox for our weekly insights.
                </p>
              </div>
            ) : !isSubmitted ? (
              // Default view with the subscription form
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`
                        pl-12 h-14 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-500 
                        focus:border-[#1987BF] focus:ring-4 focus:ring-[#1987BF]/20 transition-all duration-200
                        ${emailError ? "border-red-400 focus:border-red-500" : "border-gray-200"}
                      `}
                      // disabled={isSubmitting || (!!user)} // Disable if user is logged in and email is pre-filled
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      group bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 
                      text-white font-semibold h-14 px-8 rounded-xl shadow-lg hover:shadow-xl 
                      transition-all duration-200 transform hover:scale-105 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    "
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Subscribing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Subscribe
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              // View immediately after successful submission
              <div className="text-center py-8 animate-in zoom-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Subscribed!</h3>
                <p className="text-gray-600">
                  Thank you for joining our community. Check your inbox for a welcome email.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <p
              className={`
              text-xs text-gray-500 text-center mt-6 leading-relaxed
              ${isVisible ? "animate-in fade-in duration-500" : "opacity-0"}
            `}
              style={{ animationDelay: "800ms" }}
            >
              By subscribing, you agree to our{" "}
              <button className="text-[#1987BF] hover:text-blue-700 font-medium transition-colors duration-200">
                Privacy Policy
              </button>{" "}
              and consent to receive updates from our company. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}