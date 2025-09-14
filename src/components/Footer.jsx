import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Send, Shield, TrendingUp, Users, Star } from "lucide-react";
import { useState } from "react";
import logo from '../assets/logo.svg';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // In a real app, you'd make an API call here
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-zinc-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <div className="text-center mb-16 relative group">
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-2xl p-8 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 mb-4">
              Stay Updated with TradeFlow
            </h2>
            <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-zinc-600 mb-8 max-w-2xl mx-auto">
              Get the latest updates on P2P trading, market insights, and platform features delivered to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 px-6"
                >
                  {isSubscribed ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-zinc-500 mt-3 font-medium">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </form>
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="text-center mb-16 relative group">
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-r from-blue-50 via-purple-25 to-blue-50 backdrop-blur border border-blue-200 rounded-2xl p-8 hover:border-blue-300 transition-all duration-300 shadow-md shadow-blue-300/50 hover:shadow-lg hover:shadow-blue-400/60">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-zinc-600 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust TradeFlow for secure P2P FUN token transactions
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Trading Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div> */}
        
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="group">
            <h3 className="font-bold text-zinc-900 mb-6 text-lg group-hover:text-blue-600 transition-colors duration-300">Platform</h3>
            <ul className="space-y-3">
              {[
                { label: "Trade FUN Tokens", href: "#" },
                { label: "P2P Exchange", href: "#" },
                { label: "Secure Escrow", href: "#" },
                { label: "Trading Fees", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-zinc-600 hover:text-zinc-900 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="group">
            <h3 className="font-bold text-zinc-900 mb-6 text-lg group-hover:text-green-600 transition-colors duration-300">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "KYC Guide", href: "#" },
                { label: "Dispute Resolution", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-zinc-600 hover:text-zinc-900 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="group">
            <h3 className="font-bold text-zinc-900 mb-6 text-lg group-hover:text-purple-600 transition-colors duration-300">Legal</h3>
            <ul className="space-y-3">
              {[
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Cookie Policy", href: "#" },
                { label: "Compliance", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-zinc-600 hover:text-zinc-900 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="group">
            <h3 className="font-bold text-zinc-900 mb-6 text-lg group-hover:text-amber-600 transition-colors duration-300">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Community", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-zinc-600 hover:text-zinc-900 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300 group">
            <Shield className="w-6 h-6 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-zinc-900">Secure Trading</div>
              <div className="text-sm text-zinc-600">Bank-grade security</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300 group">
            <Users className="w-6 h-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-zinc-900">10,000+ Users</div>
              <div className="text-sm text-zinc-600">Active traders</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300 group">
            <TrendingUp className="w-6 h-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-zinc-900">99.9% Uptime</div>
              <div className="text-sm text-zinc-600">Always available</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
            {/* Updated logo using the improved SVG design */}
            <img src={logo} alt="TradeFlow Logo" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-zinc-500 text-sm font-medium">
              © 2024 TradeFlow. All rights reserved.
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;