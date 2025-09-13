import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Coins, TrendingUp, Users, Shield, BarChart3, Wallet, Clock,LogOut, ArrowUpRight, ArrowDownLeft, Eye, Bell, Settings, ChevronRight, Star, Activity } from "lucide-react"
import { selectCurrentUser } from "../features/auth/authSlice"
import { useLogoutMutation, useGetDashboardStatsQuery, useGetUserTradesQuery, useGetWithdrawalHistoryQuery } from "../features/api/apiSlice"
import { logout } from "../features/auth/authSlice"
import { useToast } from "../hooks/use-toast"
import { SiteHeader } from "../components/SiteHeader"

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutMutation] = useLogoutMutation()
  const { data: dashboardData, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery()
  const { data: tradesData, isLoading: tradesLoading } = useGetUserTradesQuery({ limit: 3 })
  const { data: withdrawalHistory, isLoading: withdrawalsLoading } = useGetWithdrawalHistoryQuery({ page: 1, limit: 5 })
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

  // Get recent trades from API
  const recentTrades = tradesData?.data?.trades?.slice(0, 3) || []

  // Get recent withdrawals from API
  const recentWithdrawals = withdrawalHistory?.data?.withdrawals?.slice(0, 5) || []

  // Utility function to format date
  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
  }

  // Utility function to determine trade type for current user
  const getTradeType = (trade, currentUserId) => {
    return trade.buyerId?._id === currentUserId ? 'Buy' : 'Sell'
  }

  // Utility function to get other party username
  const getOtherPartyUsername = (trade, currentUserId) => {
    return trade.buyerId?._id === currentUserId 
      ? trade.sellerId?.username || 'Unknown'
      : trade.buyerId?.username || 'Unknown'
  }

  const marketData = [
    { name: "Bitcoin (BTC)", price: "$43,250.00", change: "+2.5%", isUp: true },
    { name: "Ethereum (ETH)", price: "$2,650.00", change: "+1.8%", isUp: true },
    { name: "Tether (USDT)", price: "$1.00", change: "0.0%", isUp: null },
    { name: "Binance Coin (BNB)", price: "$385.50", change: "-0.8%", isUp: false },
  ]

  // Format withdrawal status
  const getWithdrawalStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'processing':
        return 'text-blue-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Format withdrawal status text
  const getWithdrawalStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'failed':
        return 'Failed'
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
    }
  }

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
                onClick={() => navigate('/trading')}
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
                className="w-full justify-start border-green-300 text-green-900 hover:bg-green-50 hover:border-green-400 transition-all duration-300 hover:scale-101 group/btn h-12"
                onClick={() => navigate('/withdraw')}
              >
                <ArrowDownLeft className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-semibold leading-snug">Withdraw Funds</div>
                  <div className="text-xs font-normal leading-relaxed opacity-70">Convert FUN to INR</div>
                </div>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 hover:scale-101 group/btn h-12"
                onClick={() => navigate('/withdrawals')}
              >
                <Users className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-semibold leading-snug">Withdrawal History</div>
                  <div className="text-xs font-normal leading-relaxed opacity-70">View past withdrawals</div>
                </div>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-white border-zinc-200 backdrop-blur p-6 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold leading-snug text-zinc-900 mb-6 flex items-center justify-between">
              Recent Trades
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
                onClick={() => navigate('/trades')}
              >
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </h3>
            <div className="space-y-4">
              {tradesLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-6 bg-zinc-200 rounded"></div>
                        <div>
                          <div className="w-24 h-4 bg-zinc-200 rounded mb-2"></div>
                          <div className="w-32 h-3 bg-zinc-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-4 bg-zinc-200 rounded mb-2"></div>
                        <div className="w-12 h-3 bg-zinc-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentTrades.length === 0 ? (
                // No trades message
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 mb-2">No recent trades</p>
                  <p className="text-sm text-zinc-400">Start trading to see your activity here</p>
                </div>
              ) : (
                // Actual trades
                recentTrades.map((trade) => {
                  const tradeType = getTradeType(trade, user?._id)
                  const otherParty = getOtherPartyUsername(trade, user?._id)
                  const statusMap = {
                    'pending': 'Pending',
                    'paid': 'Payment Confirmed',
                    'completed': 'Completed',
                    'cancelled': 'Cancelled',
                    'disputed': 'Disputed'
                  }
                  
                  return (
                    <div
                      key={trade._id}
                      className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:scale-101 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/trade hover:shadow-md"
                      onClick={() => navigate(`/trades/${trade._id}`)}
                      onMouseEnter={() => setHoveredCard(trade._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-lg text-xs font-normal leading-relaxed font-medium flex items-center gap-1 transition-all duration-200 ${
                          tradeType === 'Buy' 
                            ? 'bg-green-100 text-green-700 group-hover/trade:bg-green-200' 
                            : 'bg-red-100 text-red-700 group-hover/trade:bg-red-200'
                        }`}>
                          {tradeType === 'Buy' ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3" />
                          )}
                          {tradeType}
                        </div>
                        <div>
                          <p className="font-semibold leading-snug text-zinc-900 group-hover/trade:text-zinc-900 transition-colors">
                            {trade.funTokenAmount} FUN
                          </p>
                          <p className="text-sm font-normal leading-relaxed text-zinc-600 flex items-center gap-2 group-hover/trade:text-zinc-700 transition-colors">
                            Payment: {trade.funTokenPayment} FUN • {otherParty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          trade.status === 'completed' 
                            ? 'text-green-600' 
                            : trade.status === 'pending'
                            ? 'text-amber-600'
                            : trade.status === 'paid'
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}>
                          {statusMap[trade.status] || trade.status}
                        </p>
                        <p className="text-zinc-600 text-xs group-hover/trade:text-zinc-700 transition-colors">
                          {formatTimeAgo(trade.createdAt)}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-zinc-500 group-hover/trade:text-zinc-600 group-hover/trade:translate-x-1 transition-all ${hoveredCard === trade._id ? 'scale-110' : ''}`} />
                    </div>
                  )
                })
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center justify-between">
              Recent Withdrawals
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
                onClick={() => navigate('/withdrawals')}
              >
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </h3>
            <div className="space-y-4">
              {withdrawalsLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-200 rounded-full"></div>
                        <div>
                          <div className="w-20 h-4 bg-zinc-200 rounded mb-2"></div>
                          <div className="w-24 h-3 bg-zinc-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-4 bg-zinc-200 rounded mb-2"></div>
                        <div className="w-12 h-3 bg-zinc-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentWithdrawals.length === 0 ? (
                // No withdrawals message
                <div className="text-center py-8">
                  <ArrowDownLeft className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 mb-2">No recent withdrawals</p>
                  <p className="text-sm text-zinc-400">Your withdrawal history will appear here</p>
                </div>
              ) : (
                // Actual withdrawals
                recentWithdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal._id}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer group/withdrawal hover:scale-105"
                    onClick={() => navigate('/withdrawals')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-green-500 flex items-center justify-center text-white font-bold text-xs">
                        <ArrowDownLeft className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-zinc-900 font-medium group-hover/withdrawal:text-zinc-900 transition-colors">
                          {withdrawal.amount} FUN
                        </div>
                        <div className="text-zinc-500 text-xs group-hover/withdrawal:text-zinc-600 transition-colors">
                          {formatTimeAgo(withdrawal.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-900 font-medium">
                        ₹{withdrawal.paymentGatewayDetails?.withdrawalAmountINR || withdrawal.amount}
                      </div>
                      <div className={`text-sm flex items-center gap-1 justify-end ${getWithdrawalStatusColor(withdrawal.status)}`}>
                        {withdrawal.status === 'completed' && <ArrowUpRight className="h-3 w-3" />}
                        {withdrawal.status === 'pending' && <Clock className="h-3 w-3" />}
                        {withdrawal.status === 'processing' && <Activity className="h-3 w-3" />}
                        {withdrawal.status === 'failed' && <ArrowDownLeft className="h-3 w-3" />}
                        {getWithdrawalStatusText(withdrawal.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
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