import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Wallet, CreditCard, AlertCircle, CheckCircle, Info, Shield, Clock, Download, TrendingDown, ArrowDownLeft, Star, Activity } from 'lucide-react'
import { selectCurrentUser } from "../features/auth/authSlice"
import { useWithdrawFunTokensMutation, useGetWithdrawalHistoryQuery } from "../features/api/apiSlice"
import { useToast } from "../hooks/use-toast"
import { SiteHeader } from "../components/SiteHeader"

export default function WithdrawalCheckoutPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Form state
  const [tokenAmount, setTokenAmount] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [hoveredCard, setHoveredCard] = useState(null)
  
  // API mutations and queries
  const [withdrawFunTokens, { isLoading: isWithdrawing }] = useWithdrawFunTokensMutation()
  const { data: withdrawalHistory, refetch: refetchHistory } = useGetWithdrawalHistoryQuery({ page: 1, limit: 5 })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  // Calculate withdrawal details
  const funTokenBalance = user?.balances?.funToken || 0
  const withdrawalAmountINR = parseInt(tokenAmount) || 0
  const exchangeRate = 1 // 1 FUN Token = 1 INR

  // Form validation
  const validateForm = () => {
    const errors = {}
    const amount = parseInt(tokenAmount)

    if (!tokenAmount) {
      errors.tokenAmount = 'Amount is required'
    } else if (amount <= 0) {
      errors.tokenAmount = 'Amount must be greater than 0'
    } else if (amount > funTokenBalance) {
      errors.tokenAmount = 'Insufficient balance'
    } else if (amount > 100000) {
      errors.tokenAmount = 'Maximum withdrawal limit is 100,000 FUN tokens'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsConfirming(true)
  }

  // Handle withdrawal confirmation
  const handleConfirmWithdrawal = async () => {
    try {
      const result = await withdrawFunTokens({
        tokenAmount: parseInt(tokenAmount)
      }).unwrap()

      if (result.success) {
        toast({
          title: "Withdrawal Successful",
          description: `₹${withdrawalAmountINR} withdrawal request submitted successfully. Transaction ID: ${result.data.transactionId}`,
        })

        // Reset form
        setTokenAmount('')
        setIsConfirming(false)
        
        // Refetch withdrawal history
        refetchHistory()

        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: error?.data?.message || "Failed to process withdrawal request",
        variant: "destructive"
      })
      setIsConfirming(false)
    }
  }

  const handleCancel = () => {
    setIsConfirming(false)
  }

  const handleGoBack = () => {
    navigate('/dashboard')
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

  // Render confirmation modal
  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
        <SiteHeader />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-lg mx-auto mt-12">
            <Card className="bg-white border-zinc-200 backdrop-blur p-8 shadow-lg shadow-zinc-400/60 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                
                <h2 className="text-2xl font-bold leading-tight text-zinc-900 mb-6">Confirm Withdrawal</h2>
                
                <div className="space-y-4 text-left">
                  <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 font-medium">Amount:</span>
                      <span className="text-zinc-900 font-semibold">{tokenAmount} FUN Tokens</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-zinc-600 font-medium">You'll receive:</span>
                      <span className="text-green-600 font-bold">₹{withdrawalAmountINR.toLocaleString()} INR</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-zinc-600 font-medium">Bank Account:</span>
                      <span className="text-zinc-900 font-semibold">****{user.bankDetails?.accountNumber?.slice(-4)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>• Processing time: 1-2 business days</p>
                        <p>• Money will be transferred to your registered bank account</p>
                        <p>• This action cannot be undone</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="flex-1 border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300"
                    disabled={isWithdrawing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmWithdrawal}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Main withdrawal form
  return (
    <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Enhanced Header */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleGoBack}
                className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 p-2 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 mb-2 flex items-center gap-3">
                  Withdraw FUN Tokens
                  <Download className="w-6 h-6 text-green-600" />
                </h1>
                <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-zinc-600">
                  Convert your FUN tokens to INR and receive money in your bank account
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Withdrawal Form */}
          <Card className="bg-white border-zinc-200 backdrop-blur shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight text-zinc-900">Withdrawal Details</h2>
                  <p className="text-zinc-600 text-sm font-medium">1 FUN Token = ₹1 INR</p>
                </div>
              </div>

              {/* Enhanced Balance Info */}
              <div className="bg-zinc-50 rounded-xl p-6 mb-8 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300 group/balance">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-600 font-medium">Available Balance:</span>
                  <span className="text-zinc-900 font-bold text-lg group-hover/balance:scale-105 transition-transform origin-right">
                    {funTokenBalance.toLocaleString()} FUN
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 font-medium">Equivalent Value:</span>
                  <span className="text-green-600 font-bold text-lg group-hover/balance:scale-105 transition-transform origin-right">
                    ₹{funTokenBalance.toLocaleString()} INR
                  </span>
                </div>
              </div>

              {/* Enhanced Prerequisites Check */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300">
                  {user.kyc?.status === 'approved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-medium ${user.kyc?.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                    KYC Verification {user.kyc?.status === 'approved' ? 'Completed' : 'Required'}
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300">
                  {user.bankDetails?.accountNumber && user.bankDetails?.ifscCode ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-medium ${user.bankDetails?.accountNumber ? 'text-green-600' : 'text-red-600'}`}>
                    Bank Details {user.bankDetails?.accountNumber ? 'Added' : 'Required'}
                  </span>
                </div>
              </div>

              {/* Enhanced Error Messages */}
              {formErrors.kyc && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 hover:bg-red-100 hover:border-red-300 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-medium">{formErrors.kyc}</span>
                  </div>
                </div>
              )}

              {formErrors.bankDetails && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 hover:bg-red-100 hover:border-red-300 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-medium">{formErrors.bankDetails}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Withdrawal Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-zinc-900 font-semibold mb-3">
                    Amount to Withdraw (FUN Tokens)
                  </label>
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    max={funTokenBalance}
                    className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300"
                  />
                  {formErrors.tokenAmount && (
                    <p className="text-red-600 font-medium mt-2">{formErrors.tokenAmount}</p>
                  )}
                  <div className="flex justify-between text-sm text-zinc-500 mt-2 font-medium">
                    <span>Min: 1 token</span>
                    <span>Max: {Math.min(funTokenBalance, 100000).toLocaleString()} tokens</span>
                  </div>
                </div>

                {/* Enhanced Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {[25, 50, 75, 100].map((percentage) => {
                    const amount = Math.floor((funTokenBalance * percentage) / 100)
                    if (amount > 0) {
                      return (
                        <Button
                          key={percentage}
                          type="button"
                          variant="outline"
                          onClick={() => setTokenAmount(amount.toString())}
                          className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300 hover:scale-105 font-medium"
                        >
                          {percentage}%
                        </Button>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Enhanced Withdrawal Summary */}
                {tokenAmount && !formErrors.tokenAmount && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 hover:bg-green-100 hover:border-green-300 transition-all duration-300 group/summary">
                    <h3 className="text-green-700 font-bold mb-4 flex items-center gap-2">
                      Withdrawal Summary
                      <Star className="w-4 h-4 text-green-600" />
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 font-medium">FUN Tokens:</span>
                        <span className="text-zinc-900 font-bold group-hover/summary:scale-105 transition-transform origin-right">
                          {parseInt(tokenAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 font-medium">Exchange Rate:</span>
                        <span className="text-zinc-900 font-bold">1 FUN = ₹1 INR</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-green-200">
                        <span className="text-zinc-600 font-medium">You'll receive:</span>
                        <span className="text-green-600 font-bold text-xl group-hover/summary:scale-110 transition-transform origin-right">
                          ₹{withdrawalAmountINR.toLocaleString()} INR
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  disabled={!tokenAmount || Object.keys(formErrors).length > 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Proceed to Withdraw
                </Button>
              </form>
            </div>
          </Card>

          {/* Enhanced Right Side Content */}
          <div className="space-y-6">
            {/* Enhanced Bank Details */}
            {user.bankDetails?.accountNumber && (
              <Card 
                className="bg-white border-zinc-200 backdrop-blur p-6 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard('bank')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold leading-tight text-zinc-900">Bank Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors duration-200">
                    <span className="text-zinc-500 text-sm font-medium block mb-1">Account Holder</span>
                    <p className="text-zinc-900 font-semibold">{user.bankDetails.accountHolderName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors duration-200">
                    <span className="text-zinc-500 text-sm font-medium block mb-1">Account Number</span>
                    <p className="text-zinc-900 font-semibold">****{user.bankDetails.accountNumber?.slice(-4)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors duration-200">
                    <span className="text-zinc-500 text-sm font-medium block mb-1">IFSC Code</span>
                    <p className="text-zinc-900 font-semibold">{user.bankDetails.ifscCode}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Enhanced Information */}
            <Card className="bg-white border-zinc-200 backdrop-blur p-6 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold leading-tight text-zinc-900">Important Information</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Withdrawals are processed within 1-2 business days' },
                  { icon: Shield, color: 'text-green-600', bg: 'bg-green-100', text: 'All transactions are secured and encrypted' },
                  { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', text: 'Minimum withdrawal: 1 FUN token' },
                  { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', text: 'Maximum withdrawal: 100,000 FUN tokens per transaction' },
                  { icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100', text: 'Money will be transferred to your registered bank account' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors duration-200 group/item">
                    <div className={`p-1.5 rounded-lg ${item.bg} group-hover/item:scale-110 transition-transform duration-200`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <p className="text-zinc-600 font-medium text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Enhanced Recent Withdrawals */}
            {withdrawalHistory?.data?.withdrawals?.length > 0 && (
              <Card className="bg-white border-zinc-200 backdrop-blur p-6 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 group">
                <h3 className="text-lg font-bold leading-tight text-zinc-900 mb-6 flex items-center gap-2">
                  Recent Withdrawals
                  <Activity className="w-5 h-5 text-violet-600 group-hover:animate-pulse" />
                </h3>
                <div className="space-y-3">
                  {withdrawalHistory.data.withdrawals.slice(0, 3).map((withdrawal) => (
                    <div key={withdrawal._id} className="flex justify-between items-center p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 hover:scale-101 transition-all duration-300 group/withdrawal">
                      <div>
                        <p className="text-zinc-900 font-semibold group-hover/withdrawal:scale-105 transition-transform origin-left">
                          {withdrawal.amount} FUN
                        </p>
                        <p className="text-zinc-500 text-xs font-medium">
                          {formatTimeAgo(withdrawal.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold group-hover/withdrawal:scale-105 transition-transform origin-right">
                          ₹{(withdrawal.paymentGatewayDetails?.withdrawalAmountINR || withdrawal.amount).toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${
                          withdrawal.status === 'completed' ? 'text-green-600' :
                          withdrawal.status === 'pending' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {withdrawal.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/withdrawals')}
                  className="w-full mt-4 text-violet-600 hover:bg-violet-50 hover:text-violet-700 font-semibold transition-all duration-300 hover:scale-105"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  View All Withdrawals
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}