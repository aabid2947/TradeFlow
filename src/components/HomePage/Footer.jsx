import { CheckCircle, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const legalLinks = ["Terms And conditions", "Privacy", "Contact", "Modern Slavery Statement"]

const importantLinks = ["Get help", "KYC and verification", "Sign up to VerifyMe", "Contact to business development"]

const bottomLinks = ["Privacy Policy", "Terms", "Pricing", "Do not sell or share my personal information"]

export default function LandingPageFooter() {
  return (
    <footer className="w-full bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">VerifyMyKyc</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Company © 2020-24. Are. Registered with: Startup of recognized startup
            </p>
          </div>

          {/* Email Subscription */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Get Exclusive Deals in your Inbox</h3>
            <div className="space-y-3 mb-4">
              <Input type="email" placeholder="verifymekyc@gmail.com" className="bg-white border-gray-200 text-sm" />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium">Subscribe</Button>
            </div>
            <p className="text-xs text-gray-600 mb-4">Get our latest news and special sales</p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Legal Pages */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Legal Pages</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Important Links</h3>
            <ul className="space-y-2">
              {importantLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-blue-500 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white">Cyber © Copyright 2024. All Rights Reserved</p>
            <div className="flex flex-wrap gap-4">
              {bottomLinks.map((link, index) => (
                <a key={index} href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
