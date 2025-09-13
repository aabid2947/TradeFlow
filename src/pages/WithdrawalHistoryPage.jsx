import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Download, Filter, Calendar, Search, RefreshCw, ExternalLink, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle, Star, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { selectCurrentUser } from "../features/auth/authSlice"
import { useGetWithdrawalHistoryQuery } from "../features/api/apiSlice"
import { SiteHeader } from "../components/SiteHeader"

export default function WithdrawalHistoryPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  
  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)
  
  // API query
  const { 
    data: withdrawalData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetWithdrawalHistoryQuery({ 
    page: currentPage, 
    limit: pageSize 
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const withdrawals = withdrawalData?.data?.withdrawals || []
  const pagination = withdrawalData?.data?.pagination || {}

  // Filter withdrawals by status
  const filteredWithdrawals = statusFilter === 'all' 
    ? withdrawals 
    : withdrawals.filter(w => w.status === statusFilter)

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': 
        return {
          color: 'text-green-600',
          bg: 'bg-green-100',
          hoverBg: 'group-hover:bg-green-200',
          icon: CheckCircle,
          label: 'Completed'
        }
      case 'pending': 
        return {
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          hoverBg: 'group-hover:bg-amber-200',
          icon: Clock,
          label: 'Pending'
        }
      case 'failed': 
        return {
          color: 'text-red-600',
          bg: 'bg-red-100',
          hoverBg: 'group-hover:bg-red-200',
          icon: XCircle,
          label: 'Failed'
        }
      default: 
        return {
          color: 'text-zinc-600',
          bg: 'bg-zinc-100',
          hoverBg: 'group-hover:bg-zinc-200',
          icon: AlertCircle,
          label: 'Unknown'
        }
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleNewWithdrawal = () => {
    navigate('/withdraw')
  }

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

  // Statistics calculations
  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.paymentGatewayDetails?.withdrawalAmountINR || w.amount), 0)
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed')
  const successRate = withdrawals.length > 0 ? Math.round((completedWithdrawals.length / withdrawals.length) * 100) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-zinc-600">Loading withdrawal history...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Enhanced Header */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 p-2 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 mb-2 flex items-center gap-3">
                    Withdrawal History
                    <TrendingDown className="w-6 h-6 text-blue-600" />
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-zinc-600">
                    Track all your FUN token withdrawals and transaction history.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={handleNewWithdrawal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  New Withdrawal
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-green-200/50 hover:border-green-300 shadow-md shadow-zinc-300/50 group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors font-medium">
                  Total Withdrawals
                </p>
                <p className="text-xl md:text-2xl font-bold leading-tight text-zinc-900 group-hover:scale-105 transition-transform origin-left">
                  {pagination.totalWithdrawals || 0}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors">
                    All time transactions
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-100 group-hover:bg-green-200 text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-200/50 hover:border-blue-300 shadow-md shadow-zinc-300/50 group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors font-medium">
                  Total Amount
                </p>
                <p className="text-xl md:text-2xl font-bold leading-tight text-zinc-900 group-hover:scale-105 transition-transform origin-left">
                  ₹{totalAmount.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors">
                    Total withdrawn
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                <Download className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-200/50 hover:border-emerald-300 shadow-md shadow-zinc-300/50 group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors font-medium">
                  Success Rate
                </p>
                <p className="text-xl md:text-2xl font-bold leading-tight text-zinc-900 group-hover:scale-105 transition-transform origin-left">
                  {successRate}%
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors">
                    Completion rate
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </Card>

          {/* Filter Card */}
          <Card className="bg-white border-zinc-200 backdrop-blur p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 shadow-md shadow-zinc-300/50 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-normal leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors font-medium">
                  Filter Status
                </p>
                <Filter className="h-4 w-4 text-violet-600" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
              >
                <option value="all">All Withdrawals</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Enhanced Withdrawals List */}
        <Card className="bg-white border-zinc-200 backdrop-blur shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold leading-snug text-zinc-900 flex items-center gap-2">
                Withdrawal Transactions
                <Activity className="h-5 w-5 text-blue-600 group-hover:animate-pulse" />
              </h2>
              <div className="text-sm font-normal leading-relaxed text-zinc-500">
                Showing {filteredWithdrawals.length} of {pagination.totalWithdrawals || 0} withdrawals
              </div>
            </div>

            {isError ? (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                <div className="text-red-600 mb-4 font-medium">Error loading withdrawal history</div>
                <Button onClick={handleRefresh} variant="outline" className="border-zinc-300 text-zinc-900 hover:bg-zinc-100">
                  Try Again
                </Button>
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <div className="text-zinc-500 mb-2 font-medium">
                  {statusFilter === 'all' ? 'No withdrawals found' : `No ${statusFilter} withdrawals found`}
                </div>
                <p className="text-sm text-zinc-400 mb-4">Start withdrawing to see your transaction history</p>
                <Button onClick={handleNewWithdrawal} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Make Your First Withdrawal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWithdrawals.map((withdrawal) => {
                  const statusConfig = getStatusConfig(withdrawal.status)
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <div 
                      key={withdrawal._id} 
                      className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:scale-101 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/withdrawal hover:shadow-md"
                      onMouseEnter={() => setHoveredCard(withdrawal._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        <div className={`p-3 rounded-xl ${statusConfig.bg} ${statusConfig.hoverBg} ${statusConfig.color} transition-all duration-300 group-hover/withdrawal:scale-110 group-hover/withdrawal:rotate-6 group-hover/withdrawal:shadow-lg`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        
                        {/* Transaction Details */}
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-zinc-900 font-semibold leading-snug group-hover/withdrawal:text-zinc-900 transition-colors">
                              {withdrawal.amount.toLocaleString()} FUN
                            </h3>
                            <span className="text-green-600 font-medium">
                              → ₹{(withdrawal.paymentGatewayDetails?.withdrawalAmountINR || withdrawal.amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm font-normal leading-relaxed text-zinc-600 group-hover/withdrawal:text-zinc-700 transition-colors">
                            <span>{formatTimeAgo(withdrawal.createdAt)}</span>
                            <span>ID: {withdrawal._id.slice(-8)}</span>
                            {withdrawal.paymentGatewayDetails?.razorpayPayoutId && (
                              <span>Payout: {withdrawal.paymentGatewayDetails.razorpayPayoutId.slice(-8)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.color} ${statusConfig.hoverBg} transition-all duration-200`}>
                          {statusConfig.label.toUpperCase()}
                        </span>
                        
                        {withdrawal.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 group-hover/withdrawal:scale-105 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('View receipt for:', withdrawal._id)
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Enhanced Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200">
                <div className="text-sm font-normal leading-relaxed text-zinc-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i
                      if (pageNum <= pagination.totalPages) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "ghost"}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 transition-all duration-200 ${
                              pageNum === currentPage 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                                : 'text-zinc-900 hover:bg-zinc-100'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      }
                      return null
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}