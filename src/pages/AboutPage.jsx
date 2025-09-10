import { SiteHeader } from "../components/SiteHeader";
import { Shield, Zap, CheckCircle, Users, TrendingUp, Lock, Globe, CreditCard, Star, Award, Target, Heart, ArrowRight, DollarSign, FileCheck, Clock, Headphones } from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Multi-layer security with KYC verification, escrow services, and comprehensive dispute resolution to ensure every transaction is protected.",
      color: "text-green-600",
      bg: "bg-green-100",
      hoverBg: "group-hover:bg-green-200"
    },
    {
      icon: Zap,
      title: "Lightning Fast Trades",
      description: "Real-time P2P transactions with instant notifications and seamless FUN token integration for rapid trade execution.",
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      hoverBg: "group-hover:bg-cyan-200"
    },
    {
      icon: CheckCircle,
      title: "Transparent Operations",
      description: "Complete transparency with detailed fee breakdowns, comprehensive audit trails, and clear transaction histories.",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      hoverBg: "group-hover:bg-emerald-200"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with verified traders worldwide while using local payment methods including UPI, bank transfers, and digital wallets.",
      color: "text-violet-600",
      bg: "bg-violet-100",
      hoverBg: "group-hover:bg-violet-200"
    }
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Active Traders",
      icon: Users,
      color: "text-green-600"
    },
    {
      number: "$2M+",
      label: "Trading Volume",
      icon: TrendingUp,
      color: "text-cyan-600"
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: Shield,
      color: "text-emerald-600"
    },
    {
      number: "24/7",
      label: "Support",
      icon: Headphones,
      color: "text-violet-600"
    }
  ];

  const tradingProcess = [
    {
      step: "01",
      title: "Complete KYC Verification",
      description: "Upload government-issued ID documents for quick verification through our automated system.",
      icon: FileCheck
    },
    {
      step: "02",
      title: "Purchase FUN Tokens",
      description: "Buy FUN tokens using INR through our integrated Razorpay payment gateway with instant processing.",
      icon: DollarSign
    },
    {
      step: "03",
      title: "Browse USDT Listings",
      description: "Explore verified seller listings with competitive rates and choose your preferred payment method.",
      icon: Globe
    },
    {
      step: "04",
      title: "Secure Escrow Trading",
      description: "Initiate trades with automatic FUN token escrow protection until USDT delivery is confirmed.",
      icon: Lock
    }
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Escrow Protection",
      description: "Every trade is secured with our automated escrow system, protecting both buyers and sellers throughout the transaction process."
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications and live updates on your trades, payments, and account activities through our WebSocket integration."
    },
    {
      icon: Award,
      title: "Verified Sellers",
      description: "All sellers undergo thorough KYC verification and maintain reputation scores to ensure trustworthy trading partners."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Support for various payment methods including UPI, bank transfers, and popular digital wallets for maximum convenience."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support with dedicated dispute resolution team to handle any trading issues promptly."
    },
    {
      icon: Target,
      title: "Competitive Rates",
      description: "Access the best market rates with transparent fee structure and no hidden charges on any transactions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative group">
          <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-3xl p-12 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 flex items-center justify-center gap-4">
              About TradeFlow
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 md:w-8 md:h-8 text-amber-500 fill-current" />
                ))}
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Revolutionizing peer-to-peer USDT trading with innovative FUN token integration, 
              advanced security, and seamless user experience.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg text-green-600 font-semibold">Platform Active & Growing</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-zinc-200 rounded-2xl p-6 text-center hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300 group hover:-translate-y-1"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
              <div className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2 group-hover:scale-105 transition-transform">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-zinc-600 group-hover:text-zinc-700 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mb-16 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-emerald-100 to-cyan-100 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-r from-green-50 via-emerald-50 to-cyan-50 border border-green-200 rounded-3xl p-12 hover:border-green-300 transition-all duration-300 shadow-md shadow-green-200/50 hover:shadow-lg hover:shadow-green-300/60">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">Our Mission</h2>
              <p className="text-lg md:text-xl text-zinc-700 leading-relaxed max-w-4xl mx-auto">
                To democratize access to digital asset trading by creating the world's most secure, 
                transparent, and user-friendly P2P USDT trading platform. We empower individuals 
                to take control of their financial future through innovative blockchain technology 
                and the revolutionary FUN token ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Why Choose TradeFlow?
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Experience the future of P2P trading with our cutting-edge platform designed for security, speed, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-2xl p-8 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.hoverBg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 group-hover:text-zinc-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed group-hover:text-zinc-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              How TradeFlow Works
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Get started with USDT trading in four simple steps using our innovative FUN token system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingProcess.map((process, index) => (
              <div
                key={index}
                className="relative bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="absolute -top-4 left-6">
                  <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full group-hover:scale-110 transition-transform">
                    {process.step}
                  </div>
                </div>
                <div className="pt-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all">
                    <process.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-zinc-900 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed group-hover:text-zinc-700 transition-colors">
                    {process.description}
                  </p>
                </div>
                {index < tradingProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-zinc-400 group-hover:text-zinc-600 group-hover:scale-110 transition-all" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Platform Benefits
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Discover the advantages that make TradeFlow the preferred choice for P2P USDT trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-zinc-200 group-hover:scale-110 transition-all">
                  <benefit.icon className="w-6 h-6 text-zinc-600 group-hover:text-zinc-700" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-zinc-900 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed group-hover:text-zinc-700 transition-colors">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Built on Cutting-Edge Technology
              </h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                TradeFlow leverages modern technology stack to deliver unparalleled performance, security, and scalability.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Technical Architecture</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Service-Oriented Architecture</div>
                      <div className="text-zinc-600 text-sm">Modular microservices design for scalability and maintainability</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Real-time WebSocket Integration</div>
                      <div className="text-zinc-600 text-sm">Live updates and notifications for seamless trading experience</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Advanced Security Protocols</div>
                      <div className="text-zinc-600 text-sm">Multi-layer security with encryption and audit trails</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">MongoDB Database</div>
                      <div className="text-zinc-600 text-sm">NoSQL database for flexible data management and scaling</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Integration Partners</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Razorpay Payment Gateway</div>
                      <div className="text-zinc-600 text-sm">Secure INR to FUN token purchases with instant processing</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Automated KYC Verification</div>
                      <div className="text-zinc-600 text-sm">Third-party identity verification for enhanced security</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Banking Integration</div>
                      <div className="text-zinc-600 text-sm">Direct bank transfer support for fiat withdrawals</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-zinc-900">Future ERC-20 Migration</div>
                      <div className="text-zinc-600 text-sm">Roadmap to transform FUN token into on-chain ERC-20</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 rounded-3xl p-12 text-white relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join thousands of traders who trust TradeFlow for secure, fast, and profitable USDT trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                  Get Started Today
                </button>
                <button className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;