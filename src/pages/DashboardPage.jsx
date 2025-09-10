import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Coins, TrendingUp, Users, Shield, BarChart3, Wallet, LogOut, ArrowUpRight, ArrowDownLeft, Eye, Bell, Settings, ChevronRight, Star, Activity } from "lucide-react"
import { selectCurrentUser } from "../features/auth/authSlice"
import { useLogoutMutation, useGetDashboardStatsQuery } from "../features/api/apiSlice"
import { logout } from "../features/auth/authSlice"
import { useToast } from "../hooks/use-toast"
import { SiteHeader } from "../components/SiteHeader"

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutMutation] = useLogoutMutation()
  const { data: dashboardData, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery()
  const { toast } = useToast()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await logoutMutation({ refreshToken }).unwrap()
      dispatch(logout())
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      navigate("/")
    } catch (err) {
      // Even if the server logout fails, we should still logout locally
      dispatch(logout())
      navigate("/")
    }
  }

  // Map icon names from API to actual icon components
  const getIcon = (iconName) => {
    const iconMap = {
      'Wallet': Wallet,
      'TrendingUp': TrendingUp,
      'Coins': Coins,
      'Shield': Shield
    }
    return iconMap[iconName] || Wallet
  }

  // Get stats from API or use fallback
  const stats = dashboardData?.data?.stats?.map(stat => ({
    ...stat,
    icon: getIcon(stat.icon)
  })) || [
    {
      title: "Total Balance",
      value: "Loading...",
      icon: Wallet,
      change: "...",
      changeValue: "...",
      color: "text-green-600",
      bgGradient: "from-green-50 via-green-25 to-white",
      iconBg: "bg-green-100 group-hover:bg-green-200",
      borderColor: "hover:border-green-300",
      shadowColor: "hover:shadow-green-200/50"
    },
    {
      title: "Active Trades",
      value: "Loading...",
      icon: TrendingUp,
      change: "...",
      changeValue: "...",
      color: "text-violet-600",
      bgGradient: "from-violet-50 via-violet-25 to-white",
      iconBg: "bg-violet-100 group-hover:bg-violet-200",
      borderColor: "hover:border-violet-300",
      shadowColor: "hover:shadow-violet-200/50"
    },
    {
      title: "P2P Volume",
      value: "Loading...",
      icon: Coins,
      change: "...",
      changeValue: "...",
      color: "text-cyan-600",
      bgGradient: "from-cyan-50 via-cyan-25 to-white",
      iconBg: "bg-cyan-100 group-hover:bg-cyan-200",
      borderColor: "hover:border-cyan-300",
      shadowColor: "hover:shadow-cyan-200/50"
    },
    {
      title: "USDT Balance", 
      value: "Loading...",
      icon: Shield,
      change: "...",
      changeValue: "...",
      color: "text-emerald-600",
      bgGradient: "from-emerald-50 via-emerald-25 to-white",
      iconBg: "bg-emerald-100 group-hover:bg-emerald-200",
      borderColor: "hover:border-emerald-300",
      shadowColor: "hover:shadow-emerald-200/50"
    }
  ]

  const recentTrades = [
    { 
      id: 1, 
      type: "Buy", 
      amount: "$1,234.56", 
      asset: "BTC", 
      status: "Completed", 
      time: "2 hours ago",
      user: "Alice_T",
      profit: "+$45.23"
    },
    { 
      id: 2, 
      type: "Sell", 
      amount: "$567.89", 
      asset: "ETH", 
      status: "Pending", 
      time: "4 hours ago",
      user: "Bob_C",
      profit: "pending"
    },
    { 
      id: 3, 
      type: "Buy", 
      amount: "$890.12", 
      asset: "USDT", 
      status: "Completed", 
      time: "6 hours ago",
      user: "Charlie_P",
      profit: "+$12.45"
    },
  ]

  const marketData = [
    { name: "Bitcoin (BTC)", price: "$43,250.00", change: "+2.5%", isUp: true },
    { name: "Ethereum (ETH)", price: "$2,650.00", change: "+1.8%", isUp: true },
    { name: "Tether (USDT)", price: "$1.00", change: "0.0%", isUp: null },
    { name: "Binance Coin (BNB)", price: "$385.50", change: "-0.8%", isUp: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Enhanced Header */}
     <SiteHeader/>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 mb-2 flex items-center gap-3">
              Welcome back, {user?.firstName || "Trader"}! 
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                ))}
              </div>
            </h2>
            <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-zinc-600">
              Here's what's happening with your P2P trading activity today.
            </p>
          </div>
        </div>

        {/* Enhanced Stats Grid with Individual Hover States */}
        {statsError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Failed to load dashboard statistics. Using default values.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group cursor-pointer transform-gpu"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <Card className={`
                bg-white
                border-zinc-200 
                backdrop-blur 
                p-6 
                transition-all 
                duration-300 
                hover:scale-105 
                hover:-translate-y-2
                hover:shadow-lg
                ${stat.shadowColor}
                ${stat.borderColor}
                shadow-md shadow-zinc-300/50
                ${hoveredStat === index ? 'ring-2 ring-zinc-300 shadow-lg shadow-zinc-400/60' : ''}
                ${statsLoading ? 'animate-pulse' : ''}
              `}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold leading-tight text-zinc-900 group-hover:scale-105 transition-transform origin-left">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${stat.color}`}>
                        <ArrowUpRight className="h-3 w-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-normal leading-relaxed font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors">
                        {stat.changeValue}
                      </span>
                    </div>
                  </div>
                  <div className={`
                    p-3 
                    rounded-xl 
                    ${stat.iconBg} 
                    ${stat.color}
                    transition-all 
                    duration-300 
                    group-hover:scale-110
                    group-hover:rotate-6
                    group-hover:shadow-lg
                  `}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className={`
                  absolute bottom-0 left-0 w-full h-1 
                  bg-gradient-to-r ${stat.bgGradient} 
                  transform scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-300 origin-left
                  rounded-b-lg
                `}></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Enhanced Quick Actions & Recent Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold leading-snug text-zinc-900 mb-6 flex items-center justify-between">
              Quick Actions
              <Activity className="h-5 w-5 text-amber-500 group-hover:animate-pulse" />
            </h3>
            <div className="space-y-4">
                <Button 
                variant="outline" 
                className="w-full justify-start border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 hover:scale-101 group/btn h-12"
              >
                <BarChart3 className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-semibold leading-snug">Start New Trade</div>
                  <div className="text-xs font-normal leading-relaxed opacity-70">Begin P2P Trade</div>
                </div>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 hover:scale-101 group/btn h-12"
              >
                <BarChart3 className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-semibold leading-snug">View Analytics</div>
                  <div className="text-xs font-normal leading-relaxed opacity-70">Track performance</div>
                </div>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 hover:scale-101 group/btn h-12"
              >
                <Users className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-semibold leading-snug">Find Partners</div>
                  <div className="text-xs font-normal leading-relaxed opacity-70">Connect with traders</div>
                </div>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-white border-zinc-200 backdrop-blur p-6 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold leading-snug text-zinc-900 mb-6 flex items-center justify-between">
              Recent Trades
              <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </h3>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:scale-101 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/trade hover:shadow-md"
                  onMouseEnter={() => setHoveredCard(trade.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg text-xs font-normal leading-relaxed font-medium flex items-center gap-1 transition-all duration-200 ${
                      trade.type === 'Buy' 
                        ? 'bg-green-100 text-green-700 group-hover/trade:bg-green-200' 
                        : 'bg-red-100 text-red-700 group-hover/trade:bg-red-200'
                    }`}>
                      {trade.type === 'Buy' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownLeft className="h-3 w-3" />
                      )}
                      {trade.type}
                    </div>
                    <div>
                      <p className="font-semibold leading-snug text-zinc-900 group-hover/trade:text-zinc-900 transition-colors">
                        {trade.amount}
                      </p>
                      <p className="text-sm font-normal leading-relaxed text-zinc-600 flex items-center gap-2 group-hover/trade:text-zinc-700 transition-colors">
                        {trade.asset} • {trade.user}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      trade.status === 'Completed' 
                        ? 'text-green-600' 
                        : 'text-amber-600'
                    }`}>
                      {trade.status}
                    </p>
                    <p className="text-zinc-600 text-xs group-hover/trade:text-zinc-700 transition-colors">
                      {trade.time}
                    </p>
                    {trade.profit !== 'pending' && (
                      <p className="text-green-600 text-xs font-medium">{trade.profit}</p>
                    )}
                  </div>
                  <ChevronRight className={`h-4 w-4 text-zinc-500 group-hover/trade:text-zinc-600 group-hover/trade:translate-x-1 transition-all ${hoveredCard === trade.id ? 'scale-110' : ''}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Enhanced Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center justify-between">
              Market Overview
              <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
            </h3>
            <div className="space-y-4">
              {marketData.map((market, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer group/market hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                      {market.name.split(' ')[0].substring(0, 2)}
                    </div>
                    <span className="text-zinc-600 group-hover/market:text-zinc-900 transition-colors font-medium">
                      {market.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-900 font-medium">{market.price}</div>
                    <div className={`text-sm flex items-center gap-1 ${
                      market.isUp === true ? 'text-green-600' : 
                      market.isUp === false ? 'text-red-600' : 'text-zinc-600'
                    }`}>
                      {market.isUp === true && <ArrowUpRight className="h-3 w-3" />}
                      {market.isUp === false && <ArrowDownLeft className="h-3 w-3" />}
                      {market.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center justify-between">
              Account Status
              <Shield className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 group/status hover:scale-103">
                <span className="text-zinc-600 group-hover/status:text-zinc-700 transition-colors">Verification Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 group-hover/status:scale-125 transition-transform"></div>
                  <span className="text-green-600 font-medium">Level 2 - Verified</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 group/status hover:scale-103">
                <span className="text-zinc-600 group-hover/status:text-zinc-700 transition-colors">Trading Limit</span>
                <div className="text-right">
                  <div className="text-zinc-900 font-medium">$50,000 / day</div>
                  <div className="text-zinc-500 text-xs">75% utilized</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 group/status hover:scale-103">
                <span className="text-zinc-600 group-hover/status:text-zinc-700 transition-colors">Member Since</span>
                <span className="text-zinc-900">January 2024</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 group/status hover:scale-103">
                <span className="text-zinc-600 group-hover/status:text-zinc-700 transition-colors">Total Completed</span>
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  247 trades
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}