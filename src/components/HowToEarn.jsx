import { Card, CardContent } from "./ui/card";
import { UserCheck, Banknote, Megaphone, Rocket } from "lucide-react";

const steps = [
  { icon: <UserCheck className="h-5 w-5" />, title: "Register & verify vendor account", description: "Apply with your details and complete KYC. After approval, you'll unlock vendor tools and secure trading." },
  { icon: <Banknote className="h-5 w-5" />, title: "Add USDT from your preferred market", description: "Buy USDT on any exchange you trust and move it to TradeFlow to start creating competitive offers." },
  { icon: <Megaphone className="h-5 w-5" />, title: "Create a sell ad with clear terms", description: "Set pricing, limits, and payment methods. Transparent ads attract more buyers and faster matches." },
  { icon: <Rocket className="h-5 w-5" />, title: "Publish & start earning", description: "Go live and connect with verified buyers. Use best practices to scale safely and grow your profits." },
];

export function HowToEarn() {
  return (
    <section id="how-to-earn" aria-labelledby="how-to-earn-title" className="relative w-full bg-background py-20">
      <div className="container mx-auto px-4">
        <header className="mb-16 text-center">
          <h2 id="how-to-earn-title" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How to Start Earning
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to become a verified P2P merchant on TradeFlow.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((s, i) => (
            <Card
              key={i}
              className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group animate-fade-in hover:-translate-y-1 relative pt-10"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                aria-hidden="true"
                className="absolute -top-5 left-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 border border-zinc-200 text-amber-500 ring-8 ring-white group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300"
              >
                {s.icon}
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">{s.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{s.description}</p>
                <span className="pointer-events-none absolute inset-x-6 bottom-5 block h-px origin-left scale-x-0 bg-gradient-to-r from-amber-400 to-teal-400 transition-transform duration-300 group-hover:scale-x-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowToEarn;