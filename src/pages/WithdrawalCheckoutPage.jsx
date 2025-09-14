import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Wallet, CreditCard, AlertCircle, CheckCircle, Info, Shield, Clock } from 'lucide-react'
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

    // Check prerequisites
    // if (user.kyc?.status !== 'approved') {
    //   errors.kyc = 'KYC verification is required for withdrawal'
    // }

    // if (!user.bankDetails?.accountNumber || !user.bankDetails?.ifscCode || !user.bankDetails?.accountHolderName) {
    //   errors.bankDetails = 'Complete bank details are required for withdrawal'
    // }

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

  // Render confirmation modal
  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <SiteHeader />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Confirm Withdrawal</h2>
                
                <div className="space-y-4 text-left">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Amount:</span>
                      <span className="text-white font-semibold">{tokenAmount} FUN Tokens</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-300">You'll receive:</span>
                      <span className="text-green-400 font-bold">₹{withdrawalAmountINR} INR</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-300">Bank Account:</span>
                      <span className="text-white">****{user.bankDetails?.accountNumber?.slice(-4)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-300">
                        <p>• Processing time: 1-2 business days</p>
                        <p>• Money will be transferred to your registered bank account</p>
                        <p>• This action cannot be undone</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    disabled={isWithdrawing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmWithdrawal}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Main withdrawal form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SiteHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Withdraw FUN Tokens</h1>
              <p className="text-gray-300 mt-1">Convert your FUN tokens to INR and receive money in your bank account</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Withdrawal Form */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Withdrawal Details</h2>
                  <p className="text-gray-300 text-sm">1 FUN Token = ₹1 INR</p>
                </div>
              </div>

              {/* Balance Info */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Available Balance:</span>
                  <span className="text-white font-bold">{funTokenBalance.toLocaleString()} FUN Tokens</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Equivalent Value:</span>
                  <span className="text-green-400 font-semibold">₹{funTokenBalance.toLocaleString()} INR</span>
                </div>
              </div>

              {/* Prerequisites Check */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  {user.kyc?.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={user.kyc?.status === 'approved' ? 'text-green-400' : 'text-red-400'}>
                    KYC Verification {user.kyc?.status === 'approved' ? 'Completed' : 'Required'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {user.bankDetails?.accountNumber && user.bankDetails?.ifscCode ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={user.bankDetails?.accountNumber ? 'text-green-400' : 'text-red-400'}>
                    Bank Details {user.bankDetails?.accountNumber ? 'Added' : 'Required'}
                  </span>
                </div>
              </div>

              {/* Error Messages */}
              {formErrors.kyc && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{formErrors.kyc}</span>
                  </div>
                </div>
              )}

              {formErrors.bankDetails && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{formErrors.bankDetails}</span>
                  </div>
                </div>
              )}

              {/* Withdrawal Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Amount to Withdraw (FUN Tokens)
                  </label>
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    max={funTokenBalance}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {formErrors.tokenAmount && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.tokenAmount}</p>
                  )}
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Min: 1 token</span>
                    <span>Max: {Math.min(funTokenBalance, 100000).toLocaleString()} tokens</span>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((percentage) => {
                    const amount = Math.floor((funTokenBalance * percentage) / 100)
                    if (amount > 0) {
                      return (
                        <Button
                          key={percentage}
                          type="button"
                          variant="outline"
                          onClick={() => setTokenAmount(amount.toString())}
                          className="border-white/20 text-white hover:bg-white/10 text-xs"
                        >
                          {percentage}%
                        </Button>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Withdrawal Summary */}
                {tokenAmount && !formErrors.tokenAmount && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-2">Withdrawal Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">FUN Tokens:</span>
                        <span className="text-white">{parseInt(tokenAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Exchange Rate:</span>
                        <span className="text-white">1 FUN = ₹1 INR</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-300">You'll receive:</span>
                        <span className="text-green-400">₹{withdrawalAmountINR.toLocaleString()} INR</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                  disabled={!tokenAmount || Object.keys(formErrors).length > 0}
                >
                  Proceed to Withdraw
                </Button>
              </form>
            </Card>

            {/* Bank Details & Information */}
            <div className="space-y-6">
              {/* Bank Details */}
              {user.bankDetails?.accountNumber && (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Bank Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-300 text-sm">Account Holder</span>
                      <p className="text-white font-medium">{user.bankDetails.accountHolderName}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm">Account Number</span>
                      <p className="text-white font-medium">****{user.bankDetails.accountNumber?.slice(-4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm">IFSC Code</span>
                      <p className="text-white font-medium">{user.bankDetails.ifscCode}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Information */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Important Information</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p>Withdrawals are processed within 1-2 business days</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>All transactions are secured and encrypted</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p>Minimum withdrawal: 1 FUN token</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p>Maximum withdrawal: 100,000 FUN tokens per transaction</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p>Money will be transferred to your registered bank account</p>
                  </div>
                </div>
              </Card>

              {/* Recent Withdrawals */}
              {withdrawalHistory?.data?.withdrawals?.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Withdrawals</h3>
                  <div className="space-y-3">
                    {withdrawalHistory.data.withdrawals.slice(0, 3).map((withdrawal) => (
                      <div key={withdrawal._id} className="flex justify-between items-center py-2 border-b border-white/10">
                        <div>
                          <p className="text-white font-medium">{withdrawal.amount} FUN</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400">₹{withdrawal.paymentGatewayDetails?.withdrawalAmountINR || withdrawal.amount}</p>
                          <p className={`text-xs ${
                            withdrawal.status === 'completed' ? 'text-green-400' :
                            withdrawal.status === 'pending' ? 'text-yellow-400' :
                            'text-red-400'
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
                    className="w-full mt-3 text-purple-400 hover:bg-purple-500/10"
                  >
                    View All Withdrawals
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}