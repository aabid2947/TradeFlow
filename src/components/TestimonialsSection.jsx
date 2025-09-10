import { memo } from "react";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah Chen", role: "P2P Trader", content: "TradeFlow has revolutionized my trading experience. The verification process is seamless, and I feel secure with every transaction.", rating: 5 },
  { name: "Marcus Rodriguez", role: "Digital Asset Vendor", content: "The low fees and fast settlements make this platform perfect for my business. Customer support is exceptional.", rating: 5 },
  { name: "Aisha Patel", role: "Crypto Enthusiast", content: "I've been using TradeFlow for months now. The security features and user-friendly interface keep me coming back.", rating: 5 },
  { name: "David Kim", role: "Investment Manager", content: "Professional-grade tools with consumer-friendly design. TradeFlow strikes the perfect balance for serious traders.", rating: 5 },
  { name: "Elena Volkov", role: "Business Owner", content: "The global reach and reliable service make TradeFlow my go-to platform for international transactions.", rating: 5 },
  { name: "Ahmed Hassan", role: "Freelancer", content: "Quick verification, transparent fees, and excellent customer service. Highly recommend for anyone new to P2P trading.", rating: 5 }
];

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-black via-slate-900 to-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Trusted by <span className="text-amber-400">thousands</span> of traders
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
            See what our community says about their TradeFlow experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-amber-400/30 transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-300 mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-slate-900 font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center"><div className="text-4xl font-bold text-amber-400">50K+</div><div className="text-slate-300 mt-1">Active Traders</div></div>
          <div className="text-center"><div className="text-4xl font-bold text-teal-400">$2.5B+</div><div className="text-slate-300 mt-1">Volume Traded</div></div>
          <div className="text-center"><div className="text-4xl font-bold text-emerald-400">99.9%</div><div className="text-slate-300 mt-1">Uptime</div></div>
          <div className="text-center"><div className="text-4xl font-bold text-blue-400">4.9/5</div><div className="text-slate-300 mt-1">User Rating</div></div>
        </div>
      </div>
    </section>
  );
});