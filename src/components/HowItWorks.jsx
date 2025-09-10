import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, CreditCard, FileText, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserCheck,
      title: "Register and verify your vendor account",
      description: "Click 'Apply Here' at the landing page fill in your information. Few moments after reviewing your application, one of our team member will contact you"
    },
    {
      icon: CreditCard,
      title: "Buy USDT from other market place",
      description: "As a vendor, you can buy USDT at many other platforms with cheaper price. Such as, Binance and OKX. And you can sell it for higher price on Cheezeebii"
    },
    {
      icon: FileText,
      title: "Create your ad for selling USDT",
      description: "Personalise your sell ad and setup the price you want. Also, add as many payment methods possible to attract more buyers"
    },
    {
      icon: TrendingUp,
      title: "Post your Ad & wait your expert",
      description: "Once your ad is finalised and live, you can connect with your trading partner to assist you to earn and you can enjoy your profit."
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How to start earning USDT
          </h2>
          <p className="text-xl text-muted-foreground">
            4 easy steps to follow before you start earning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-background animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-accent-foreground" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-4 leading-tight">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;