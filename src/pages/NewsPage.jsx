import { SiteHeader } from "../components/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp, Shield, Users } from "lucide-react";

const NewsPage = () => {
  const newsArticles = [
    {
      id: 1,
      title: "TradeFlow Reaches 50,000+ Active Users Milestone",
      excerpt: "Our thriving P2P trading community continues to grow, bringing more opportunities for secure and profitable USDT trading.",
      date: "September 8, 2025",
      category: "Platform Updates",
      icon: Users,
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Enhanced Security Features Now Live",
      excerpt: "New advanced escrow mechanisms and smart contract security updates ensure even safer trading experiences for all users.",
      date: "September 5, 2025",
      category: "Security",
      icon: Shield,
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Monthly Trading Volume Surpasses 5M USDT",
      excerpt: "Record-breaking trading volumes demonstrate the growing demand for our P2P platform, creating more earning opportunities for vendors.",
      date: "September 1, 2025",
      category: "Market Insights",
      icon: TrendingUp,
      readTime: "2 min read"
    },
    {
      id: 4,
      title: "New KYC Verification Process Goes Live",
      excerpt: "Streamlined identity verification process reduces approval time while maintaining the highest security standards for all traders.",
      date: "August 28, 2025",
      category: "Platform Updates",
      icon: Shield,
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "FUN Token Integration: Lower Fees, Better Trading",
      excerpt: "Our native token system is now fully integrated, offering reduced transaction fees and enhanced security features for active traders.",
      date: "August 25, 2025",
      category: "Product Launch",
      icon: TrendingUp,
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Vendor Success Stories: Earning 500K INR Monthly",
      excerpt: "Meet successful vendors who have achieved consistent monthly profits through our step-by-step guidance and platform tools.",
      date: "August 22, 2025",
      category: "Success Stories",
      icon: Users,
      readTime: "4 min read"
    }
  ];

  const categories = ["All", "Platform Updates", "Security", "Market Insights", "Product Launch", "Success Stories"];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Latest News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest platform updates, market insights, and success stories from our growing P2P trading community.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0 
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <Card 
                key={article.id}
                className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group animate-fade-in hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Category and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300">
                      <article.icon className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-lg font-semibold text-zinc-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Article Excerpt */}
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Date and Read Time */}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Hover Effect Line */}
                  <span className="pointer-events-none absolute inset-x-6 bottom-0 block h-px origin-left scale-x-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-transform duration-300 group-hover:scale-x-100" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
              Load More Articles
            </button>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 mt-16">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-zinc-900 mb-3">
                Stay Updated with TradeFlow
              </h3>
              <p className="text-zinc-600 mb-6 max-w-md mx-auto">
                Get the latest news, market insights, and platform updates delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                  Subscribe
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;