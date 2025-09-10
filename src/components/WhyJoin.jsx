import { memo } from "react";
import { Card, CardContent } from "./ui/card";
import { Shield, Zap, Globe, Users, TrendingUp, Lock } from "lucide-react";

const features = [
  { icon: Shield, title: "Bank-Grade Security", description: "Multi-layer encryption and cold storage protection for your digital assets" },
  { icon: Zap, title: "Lightning Fast", description: "Execute trades in seconds with our optimized matching engine" },
  { icon: Globe, title: "Global Network", description: "Connect with traders from 150+ countries around the world" },
  { icon: Users, title: "Verified Community", description: "All traders undergo comprehensive KYC verification process" },
  { icon: TrendingUp, title: "Low Fees", description: "Competitive rates starting from just 0.1% per transaction" },
  { icon: Lock, title: "Escrow Protection", description: "Smart escrow system ensures safe and secure transactions" }
];

const stats = [
  { value: "150+", label: "Countries", color: "text-amber-500" },
  { value: "50K+", label: "Active Users", color: "text-teal-500" },
  { value: "$2.5B+", label: "Trading Volume", color: "text-emerald-500" },
  { value: "99.9%", label: "Uptime", color: "text-blue-500" }
];

export const WhyJoin = memo(function WhyJoin() {
  return (
    <section className="py-16 bg-white relative overflow-hidden font-sans">
      {/* Subtle decorative background elements for light theme */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-teal-500">TradeFlow</span>?
          </h2>
          <p className="mt-6 text-xl text-zinc-600 max-w-3xl mx-auto">
            Join the most trusted P2P trading platform with industry-leading security, global reach, and unmatched user experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-zinc-500 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-amber-500" />
                </div>

                <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Card className="bg-white border border-zinc-200 rounded-2xl max-w-2xl mx-auto shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">Ready to Start Trading?</h3>
              <p className="text-zinc-600 mb-6">
                Join thousands of traders who trust TradeFlow for their P2P transactions. Sign up today and get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-amber-500 text-zinc-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-all duration-300 transform hover:scale-105">
                  Start Trading Now
                </button>
                <button className="border border-zinc-300 text-zinc-700 px-8 py-3 rounded-full font-semibold hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});