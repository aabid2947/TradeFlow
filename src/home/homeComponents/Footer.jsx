import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  User,
  Building,
  Briefcase,
  FileCheck,
  Home,
  UserCheck,
  ChefHat,
  Baby,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import favicon from "@/assets/favicon.png"

// Updated footer data according to verify.txt specifications
const footerData = {
  company: {
    name: "Verify My KYC",
    description:
      "Leading identity verification platform trusted by 10,000+ businesses worldwide. Secure, fast, and compliant verification solutions for the digital age.",
    contact: {
      email: "verifymykyc@gmail.com",
      secEmail: "verifymykyc@navigantinc.com",
      phone: "+91 95606 52708",
      address: " A 24/5, Mohan Cooperative Industrial Area, Badarpur, Second Floor, New Delhi 110044 ",
    },
  },
  // Updated links according to verify.txt requirements
  links: {
    verificationServices: [
      { name: "Identity Verification", href: "/product/688584e64c6ace5e2f798009", icon: User },
      { name: "Financial & Business Checks", href: "/product/6885880c4c6ace5e2f798020", icon: Building },
      { name: "Employment Verification", href: "/product/6885856b4c6ace5e2f79800b", icon: Briefcase },
      { name: "Legal & Compliance Checks", href: "/product/688587b94c6ace5e2f79801e", icon: FileCheck },
    ],
    domesticServices: [
      { name: "Tenant Verification", href: "/blog/online-tenant-police-verification", icon: Home },
      { name: "Maid Verification", href: "/blog/maid-police-verification", icon: UserCheck },
      { name: "Cook / Chef Verification", href: "/blog/cook-and-chef-verification", icon: ChefHat },
      { name: "Nanny / Babysitter Identity Check", href: "#", icon: Baby },
      { name: "Housekeeping Staff Verification", href: "#", icon: Wrench },
    ],
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Contact", href: "/contact-us" },
      { name: "Pricing", href: "/pricing" },
      { name: "Blog", href: "/blog" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Condition", href: "/terms-and-condition" },
       { name: "Disclaimer", href: "/disclaimer" },
    ],
  },
  social: [
    { name: "Twitter", icon: Twitter, href: "https://www.X.com", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com", color: "hover:text-blue-600" },
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61576760613090", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/verifymykyc/", color: "hover:text-pink-500" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com", color: "hover:text-red-500" },
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
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
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
              className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40 rounded-lg h-11 ${error ? "border-red-400" : ""}`}
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
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1987BF]/30 border-t-[#1987BF] rounded-full animate-spin" />
                Subscribing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
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
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.1 })

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.disconnect()
    }
  }, [])

  // Available public routes for navigation
  const availableRoutes = [
    '/', '/about-us', '/privacy-policy', '/contact-us', '/pricing', 
    '/blog', '/identity-verification'
  ]

  const handleNavigation = (e, href) => {
    if (!href || href === "#" || href.startsWith("http") || e.metaKey || e.ctrlKey) {
      return
    }
    
    // Check if route is available in public routes
    if (availableRoutes.includes(href)) {
      e.preventDefault()
      navigate(href)
    }
  }

  const NavLink = ({ link, showIcon = false }) => (
    <li>
      <a
        href={link.href}
        onClick={(e) => handleNavigation(e, link.href)}
        className="text-blue-100 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group cursor-pointer"
      >
        {showIcon && link.icon && <link.icon className="w-4 h-4 text-blue-300" />}
        {link.name}
        {link.href.startsWith("http") && (
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </a>
    </li>
  )

  return (
    <footer ref={sectionRef} className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#1987BF] text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-300 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${isVisible ? "animate-in slide-in-from-bottom-8 fade-in duration-700" : "opacity-0"}`}>
          {/* Company Info Section */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img src={favicon} alt="" />
                </div>
                <span className="text-2xl font-bold">{footerData.company.name}</span>
              </div>
              <p className="text-blue-100 leading-relaxed text-sm">{footerData.company.description}</p>
            </div>
            <div className="space-y-3">
              <a href={`mailto:${footerData.company.contact.email}`} className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 text-blue-300" />
                <span className="text-sm">{footerData.company.contact.email}</span>
              </a>
              <a href={`mailto:${footerData.company.contact.secEmail}`} className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 text-blue-300" />
                <span className="text-sm">{footerData.company.contact.secEmail}</span>
              </a>
              <a href={`tel:${footerData.company.contact.phone}`} className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4 text-blue-300" />
                <span className="text-sm">{footerData.company.contact.phone}</span>
              </a>
              <div className="flex items-start gap-3 text-blue-100">
                <MapPin className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{footerData.company.contact.address}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {footerData.social.map((social) => (
                  <a key={social.name} href={social.href} className={`w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${social.color}`} aria-label={social.name} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Services Sections */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 justify-start lg:justify-center mx-auto gap-8">
            {/* Verification Services */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Verification Services</h3>
              <ul className="space-y-3">
                {footerData.links.verificationServices.map((link) => (
                  <NavLink key={link.name} link={link} showIcon={true} />
                ))}
              </ul>
            </div>

            {/* Domestic & Tenant Verification */}
            <div>
              <h3 className="font-semibold mb-4 text-white">🏠 Domestic & Tenant</h3>
              <ul className="space-y-3">
                {footerData.links.domesticServices.map((link) => (
                  <NavLink key={link.name} link={link} showIcon={true} />
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                {footerData.links.company.map((link) => (
                  <NavLink key={link.name} link={link} />
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:-ml-20 lg:col-span-2">
            <NewsletterSignup />
          </div>
        </div>

        {/* Security & Compliance Section */}
        <div className={`mt-12 pt-8 border-t border-white/20 ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}`} style={{ animationDelay: "300ms" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-white">Security & Compliance</h4>
              <div className="flex flex-wrap gap-4">
                {footerData.certifications.map((cert) => (
                  <div key={cert.name} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200">
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

      {/* Footer Bottom - Updated Copyright */}
      <div className="relative z-10 border-t border-white/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isVisible ? "animate-in slide-in-from-bottom-4 fade-in duration-700" : "opacity-0"}`} style={{ animationDelay: "500ms" }}>
            <div className="text-blue-100 text-sm">© 2025 {footerData.company.name}. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm">
              {footerData.links.legal.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={(e) => handleNavigation(e, link.href)} 
                  className="text-blue-100 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}