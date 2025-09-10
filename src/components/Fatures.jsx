import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Zap, Lock, Globe, HeartHandshake } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Escrow System",
      description:
        "Advanced escrow mechanism protects both buyers and sellers during transactions with smart contract security.",
    },
    {
      icon: Users,
      title: "KYC Verification",
      description:
        "Mandatory identity verification ensures trust and compliance with regulatory standards for all users.",
    },
    {
      icon: Zap,
      title: "Instant Settlements",
      description:
        "Fast transaction processing with real-time notifications and immediate fund releases upon confirmation.",
    },
    {
      icon: Lock,
      title: "FUN Token Integration",
      description:
        "Native token system provides seamless trading experience with lower fees and enhanced security features.",
    },
    {
      icon: Globe,
      title: "Decentralized Platform",
      description:
        "True peer-to-peer trading without intermediaries, giving users full control over their transactions.",
    },
    {
      icon: HeartHandshake,
      title: "Dispute Resolution",
      description:
        "Professional admin support for conflict resolution with comprehensive audit trails for transparency.",
    },
  ];

  return (
    // Assuming 'bg-background' is a light or white color as per the request.
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge blockchain technology to provide secure,
            transparent, and efficient P2P USDT trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              // Updated classes for a light theme card design
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
      </div>
    </section>
  );
};

export default Features;
