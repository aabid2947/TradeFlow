import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-hero text-hero-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-hero-muted text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust CheezeeBit for secure P2P USDT transactions
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold">
            Start Trading Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-hero-muted">
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Trade USDT</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">FUN Token</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Escrow</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Fees</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-hero-muted">
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">KYC Guide</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Disputes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-hero-muted">
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Compliance</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-hero-muted">
              <li><a href="#" className="hover:text-hero-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-hero-foreground transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-hero-muted/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 gradient-accent rounded"></div>
            <span className="font-bold">CheezeeBit</span>
          </div>
          <div className="text-hero-muted text-sm">
            © 2024 CheezeeBit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;