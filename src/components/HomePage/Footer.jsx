

import { useState, useRef, useEffect } from "react"
import {
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  Shield,
  Award,
  Users,
  Zap,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerData = {
  company: {
    name: "VerifyMyKyc",
    description:
      "Leading identity verification platform trusted by 10,000+ businesses worldwide. Secure, fast, and compliant verification solutions for the digital age.",
    contact: {
      email: "hello@verifymykyc.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Innovation District, San Francisco, CA 94105",
    },
  },
  links: {
    products: [
      { name: "KYC Verification", href: "#" },
      { name: "Document Verification", href: "#" },
      { name: "Biometric Verification", href: "#" },
      { name: "Business Verification", href: "#" },
      { name: "API Documentation", href: "#", external: true },
    ],
    solutions: [
      { name: "Financial Services", href: "#" },
      { name: "Healthcare", href: "#" },
      { name: "E-commerce", href: "#" },
      { name: "Real Estate", href: "#" },
      { name: "Government", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "Partner Program", href: "#" },
      { name: "Contact Sales", href: "#" },
    ],
    resources: [
      { name: "Help Center", href: "#" },
      { name: "API Reference", href: "#", external: true },
      { name: "Status Page", href: "#", external: true },
      { name: "Security", href: "#" },
      { name: "Compliance", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Data Processing Agreement", href: "#" },
      { name: "Modern Slavery Statement", href: "#" },
    ],
  },
  social: [
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500" },
  ],
  certifications: [
    { name: "ISO 27001", icon: Shield },
    { name: "SOC 2", icon: Award },
    { name: "GDPR", icon: Users },
    { name: "PCI DSS", icon: Zap },
  ],
}

const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
        <p className="text-blue-100 text-sm leading-relaxed">
          Get the latest updates on new features, security enhancements, and industry insights.
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200" />
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("")
              }}
              placeholder="Enter your email"
              className={`
                pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 
                focus:bg-white/20 focus:border-white/40 rounded-lg h-11
                ${error ? "border-red-400" : ""}
              `}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-red-300 text-xs">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-[#1987BF] hover:bg-blue-50 font-semibold rounded-lg h-11 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1987BF]/30 border-t-[#1987BF] rounded-full animate-spin" />
                Subscribing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Subscribe
                <Send className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 animate-in zoom-in fade-in duration-500">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-white font-medium">Successfully subscribed!</p>
          <p className="text-blue-100 text-sm">Check your inbox for confirmation.</p>
        </div>
      )}

      <p className="text-xs text-blue-200 leading-relaxed">
        By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
      </p>
    </div>
  )
}

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={sectionRef} className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#1987BF] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-300 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`
            grid grid-cols-1 lg:grid-cols-12 gap-12
            ${isVisible ? "animate-in slide-in-from-bottom-8 fade-in duration-700" : "opacity-0"}
          `}
        >
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#1987BF]" />
                </div>
                <span className="text-2xl font-bold">{footerData.company.name}</span>
              </div>
              <p className="text-blue-100 leading-relaxed text-sm">{footerData.company.description}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 text-blue-300" />
                <a href={`mailto:${footerData.company.contact.email}`} className="text-sm">
                  {footerData.company.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4 text-blue-300" />
                <a href={`tel:${footerData.company.contact.phone}`} className="text-sm">
                  {footerData.company.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-3 text-blue-100">
                <MapPin className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{footerData.company.contact.address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {footerData.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`
                      w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center
                      transition-all duration-200 hover:scale-110 ${social.color}
                    `}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Products</h3>
              <ul className="space-y-3">
                {footerData.links.products.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Solutions</h3>
              <ul className="space-y-3">
                {footerData.links.solutions.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                {footerData.links.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-3">
                {footerData.links.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {footerData.links.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <NewsletterSignup />
          </div>
        </div>

        {/* Certifications */}
        <div
          className={`
            mt-12 pt-8 border-t border-white/20
            ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}
          `}
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-white">Security & Compliance</h4>
              <div className="flex flex-wrap gap-4">
                {footerData.certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <cert.icon className="w-4 h-4 text-blue-300" />
                    <span className="text-sm font-medium">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-blue-100 text-sm">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div
            className={`
              flex flex-col md:flex-row items-center justify-between gap-4
              ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}
            `}
            style={{ animationDelay: "500ms" }}
          >
            <div className="text-blue-100 text-sm">© 2024 {footerData.company.name}. All rights reserved.</div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                Cookies
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                Do not sell my info
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
