import { Card, CardContent } from "@/components/ui/card";

const Benefits = () => {
  const benefits = [
    {
      value: "10",
      unit: "USDT",
      title: "Welcome Reward",
      description: "Reward upto 10 USDT after registration upto 10 USDT reward",
      subtitle: "After registering, trade 500 USDT and you will get up to 10 USDT for free is not a good word"
    },
    {
      value: "50,000+",
      unit: "USERS",
      title: "Serving Our Growing Community",
      description: "Join our thriving community of users on the cutting-edge crypto p2p trading platform. As our user base expands, so do your opportunities for seamless, secure, and rewarding trading experiences. Explore the future of finance with a growing network of like-minded traders."
    },
    {
      value: "5,000,000",
      unit: "USDT",
      title: "We have 5,000,000 USDT demand",
      description: "We currently have 5,000,000 monthly demand of USDT, and lack of vendor to supply it. Join now and jump in the opportunity to earn extra income."
    },
    {
      value: "500,000",
      unit: "INR",
      title: "500,000 INR of monthly net profit",
      description: "Easy step by step guidance, for you to earn 500,000 INR as a passive income."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Join TradeFlow?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the benefits of joining our trusted P2P trading platform with exclusive rewards and opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  {index === 0 && (
                    <div className="flex-shrink-0 w-24 h-24 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-500">{benefit.value}</div>
                        <div className="text-xs text-amber-500/80 font-medium">{benefit.unit}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      {index !== 0 && (
                        <>
                          <span className="text-3xl font-bold text-amber-500">{benefit.value}</span>
                          <span className="text-amber-500 text-sm font-medium">{benefit.unit}</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-zinc-600 leading-relaxed">
                      {benefit.description}
                    </p>
                    
                    {benefit.subtitle && (
                      <p className="text-zinc-600 text-sm mt-2 leading-relaxed">
                        {benefit.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;