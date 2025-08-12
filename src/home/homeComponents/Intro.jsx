"use client"

import { useState, useRef, useEffect } from "react"
import { Users, ArrowRight } from "lucide-react"
import employee from "@/assets/employee.png" 
export default function CompanyIntro() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute left-0 top-0 h-full w-32">
        <div className="grid grid-cols-4 gap-2 h-full opacity-20">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-sky-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div
            className={`relative transform transition-all duration-800 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100 rounded-3xl p-8 shadow-2xl overflow-hidden border border-blue-100">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-sky-300 rounded-full opacity-50 animate-pulse"></div>

              {/* Main image */}
              <div className="relative z-10">
                <img
                  src={employee}
                  alt="Male professional celebrating success"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>

              {/* Stats overlay */}
              <div
                className={`absolute bottom-8 right-8 bg-white rounded-2xl p-6 shadow-xl border border-blue-100 transform transition-all duration-800 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-blue-600 font-medium">Verified Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div
            className={`space-y-8 transform transition-all duration-800 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Heading */}
            <div>
              <h2
                className={`text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 transform transition-all duration-600 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                Verify My Kyc
              
              </h2>
            </div>

            {/* Description */}
            <div
              className={`space-y-4 transform transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <p className="text-lg text-gray-600 leading-relaxed">
              At VerifyMyKyc, we help businesses verify identities, documents, and company details with speed, accuracy, and complete peace of mind. Whether you're onboarding new users or validating important business documents, we make the process smooth, secure, and stress free.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Verify My Kyc</span> is a Indian verification firm headquartered in New Delhi, India. It was founded in 2025 with a single mission of delivering high quality identity verification services for clients looking to secure their business operations. Its dedicated team of over 20+ professionals cater to a complete range of KYC & AML services for its clients spread across India. The platform currently serves 10,000+ users with a 99.9% accuracy rate.
              </p>
            </div>

            {/* Feature highlights */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transform transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">99.9%</div>
                <div className="text-sm text-blue-600">Accuracy Rate</div>
              </div>
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <div className="text-2xl font-bold text-sky-700">50+</div>
                <div className="text-sm text-sky-600">Professionals</div>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`transform transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              {/* <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 cursor-pointer flex items-center">
                Read More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}