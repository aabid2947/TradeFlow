import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useGetProfileQuery, useInitiateTradeMutation, useCreatePaymentOrderMutation, useVerifyPaymentMutation } from '../features/api/apiSlice'
import { useToast } from '../hooks/use-toast'
import { Loader2, Wallet, CreditCard, ArrowRight, AlertTriangle, CheckCircle, ShoppingCart, X } from 'lucide-react'

const BuyListingModal = ({ listing, trigger }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [buyAmount, setBuyAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseStep, setPurchaseStep] = useState('amount') // 'amount', 'confirm', 'payment'
  const [needsTopUp, setNeedsTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState(0)
  
  const { user } = useSelector((state) => state.auth)
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery()
  const [initiateTrade, { isLoading: isInitiatingTrade }] = useInitiateTradeMutation()
  const [createPaymentOrder, { isLoading: isCreatingOrder }] = useCreatePaymentOrderMutation()
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation()
  const { toast } = useToast()

  const userBalance = profileData?.['data'].user?.balances?.funToken || 0
  const totalCost = buyAmount ? Number(buyAmount) * listing.priceInFunToken : 0
  const shortfall = totalCost - userBalance

  // Ensure Razorpay script is loaded
  const ensureRazorpayLoaded = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay)
        } else {
          reject(new Error('Razorpay failed to load'))
        }
      }
      script.onerror = () => reject(new Error('Failed to load Razorpay script'))
      document.head.appendChild(script)
    })
  }
  
  useEffect(() => {
    if (buyAmount && totalCost > userBalance) {
      setNeedsTopUp(true)
      setTopUpAmount(Math.ceil(shortfall))
    } else {
      setNeedsTopUp(false)
      setTopUpAmount(0)
    }
  }, [buyAmount, totalCost, userBalance, shortfall])

  const resetModal = () => {
    setBuyAmount('')
    setPurchaseStep('amount')
    setNeedsTopUp(false)
    setTopUpAmount(0)
    setIsProcessing(false)
  }

  const handleAmountChange = (value) => {
    const numValue = Number(value)
    if (numValue >= listing.minLimit && numValue <= listing.maxLimit && numValue <= (listing.remainingTokens || listing.funTokenAmount)) {
      setBuyAmount(value)
    } else if (value === '') {
      setBuyAmount('')
    }
  }

  const handleBuyDirect = async () => {
    if (!buyAmount || totalCost > userBalance) return
    
    setIsProcessing(true)
    try {
      const result = await initiateTrade({
        listingId: listing._id,
        funTokenAmount: Number(buyAmount)
      }).unwrap()
      
      toast({
        title: "Trade Initiated Successfully",
        description: "Your trade request has been sent to the seller.",
      })
      
      setOpen(false)
      resetModal()
      
      // Navigate to the trade details page
      if (result?.data?._id) {
        navigate(`/trades/${result.data._id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to initiate trade",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTopUpAndBuy = async () => {
    setIsProcessing(true)
    try {
      // Ensure Razorpay is loaded
      await ensureRazorpayLoaded()

      // Create Razorpay order for top-up
      const result = await createPaymentOrder({
        tokenAmount: topUpAmount
      }).unwrap()

      // Close the dialog to prevent z-index conflicts with Razorpay
      setOpen(false)

      // Initialize Razorpay payment
      const options = {
        key: result.data.keyId,
        amount: result.data.amount,
        currency: result.data.currency,
        name: 'P2P Trading Platform',
        description: `Purchase ${topUpAmount} FUN Tokens`,
        order_id: result.data.orderId,
        handler: async function (response) {
          try {
            // Verify the payment on the backend
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }).unwrap()
            
            toast({
              title: "Payment Successful",
              description: `Successfully purchased ${verifyResult.data.tokensCredited} FUN tokens`,
            })
            
            // Refresh profile to get updated balance
            await refetchProfile()
            
            // Now proceed with the original purchase after a short delay
            setTimeout(async () => {
              try {
                const tradeResult = await initiateTrade({
                  listingId: listing._id,
                  funTokenAmount: Number(buyAmount)
                }).unwrap()
                
                toast({
                  title: "Trade Initiated Successfully",
                  description: "Your trade request has been sent to the seller.",
                })
                
                // Navigate to the trade details page
                if (tradeResult?.data?._id) {
                  navigate(`/trades/${tradeResult.data._id}`)
                }
              } catch (tradeError) {
                toast({
                  title: "Trade Initiation Failed",
                  description: tradeError.data?.message || "Failed to initiate trade after top-up",
                  variant: "destructive",
                })
              }
              setIsProcessing(false)
            }, 1000)
            
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError)
            toast({
              title: "Payment Verification Failed",
              description: verifyError.data?.message || "Please contact support if amount was debited",
              variant: "destructive",
            })
            setIsProcessing(false)
            // Reopen the modal if payment verification fails
            setTimeout(() => setOpen(true), 500)
          }
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName || user?.displayName || user?.email?.split('@')[0],
          email: user?.email,
        },
        theme: {
          color: '#059669'
        },
        modal: {
          confirm_close: true,
          backdrop_close: false,
          escape: false,
          handleback: false,
          ondismiss: function() {
            setIsProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "destructive",
            })
            // Reopen the modal after a short delay
            setTimeout(() => setOpen(true), 500)
          }
        }
      }

      // Add a small delay to ensure the dialog is fully closed and DOM is ready
      setTimeout(() => {
        try {
          const rzp = new window.Razorpay(options)
          
          // Remove any existing overlays that might interfere
          document.querySelectorAll('[data-radix-popper-content-wrapper]').forEach(el => {
            el.style.zIndex = '1'
          })
          
          rzp.open()
        } catch (rzpError) {
          console.error('Razorpay initialization error:', rzpError)
          toast({
            title: "Payment Gateway Error",
            description: "Failed to open payment window. Please try again.",
            variant: "destructive",
          })
          setIsProcessing(false)
          setOpen(true)
        }
      }, 300)

    } catch (error) {
      console.error('Top-up error:', error)
      toast({
        title: "Error",
        description: error.data?.message || "Failed to initiate payment",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetModal()
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl bg-white mx-4 sm:mx-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col" 
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <span className="hidden xs:inline">Buy FUN Tokens</span>
              <span className="xs:hidden">Buy FUN</span>
            </DialogTitle>
            
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden p-1 h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-4 sm:space-y-6 pr-1">
          {/* Listing Info */}
          <Card className="bg-zinc-50 border-zinc-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg text-zinc-900">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Seller:</span>
                <span className="font-medium text-zinc-900 truncate ml-2 max-w-[150px] sm:max-w-none">
                  {listing.sellerId?.username}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Available:</span>
                <span className="font-medium text-zinc-900">{(listing.remainingTokens || listing.funTokenAmount).toLocaleString()} FUN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Price per Token:</span>
                <span className="font-medium text-zinc-900">₹{listing.priceInFunToken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Limit:</span>
                <span className="font-medium text-zinc-900">{listing.minLimit} - {Math.min(listing.maxLimit, listing.remainingTokens || listing.funTokenAmount)} FUN</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-zinc-600">Payment Methods:</span>
                <div className="flex flex-wrap gap-1">
                  {listing.paymentMethods?.map((method, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Balance */}
          <Card className="bg-white border-zinc-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-zinc-700 font-medium text-sm sm:text-base">Your Balance:</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-zinc-900">
                  {userBalance.toLocaleString()} FUN
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="buyAmount" className="text-zinc-700 font-medium text-sm sm:text-base">
              Amount to Buy (FUN Tokens) *
            </Label>
            <Input
              id="buyAmount"
              type="number"
              min={listing.minLimit}
              max={Math.min(listing.maxLimit, listing.remainingTokens || listing.funTokenAmount)}
              value={buyAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={`Enter amount (${listing.minLimit} - ${Math.min(listing.maxLimit, listing.remainingTokens || listing.funTokenAmount)})`}
              className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-base"
            />
            {buyAmount && (
              <div className="text-sm text-zinc-600">
                Total Cost: <span className="font-semibold text-zinc-900">₹{totalCost.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Purchase Summary */}
          {buyAmount && (
            <Card className="bg-white border-zinc-200">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg text-zinc-900">Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">FUN Tokens:</span>
                  <span className="font-medium text-zinc-900">{Number(buyAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Price per Token:</span>
                  <span className="font-medium text-zinc-900">₹{listing.priceInFunToken}</span>
                </div>
                <div className="flex justify-between items-center font-semibold pt-2 sm:pt-3 border-t border-zinc-200">
                  <span className="text-zinc-900">Total Cost:</span>
                  <span className="text-green-600 text-base sm:text-lg">₹{totalCost.toLocaleString()}</span>
                </div>

                {needsTopUp && (
                  <Card className="bg-amber-50 border-amber-200 mt-3 sm:mt-4">
                    <CardContent className="pt-3 sm:pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-800 font-medium text-sm sm:text-base">Insufficient Balance</span>
                      </div>
                      <div className="text-xs sm:text-sm text-amber-700 space-y-1">
                        <div>You need {topUpAmount.toLocaleString()} more FUN tokens</div>
                        <div>Current Balance: {userBalance.toLocaleString()} FUN</div>
                        <div>Required: {totalCost.toLocaleString()} FUN (₹{totalCost.toLocaleString()})</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help Text */}
          <div className="text-xs text-zinc-500 text-center space-y-1 px-2">
            <div>• Purchases are processed through our secure P2P system</div>
            <div className="hidden sm:block">• Top-up payments are processed via Razorpay</div>
            <div className="sm:hidden">• Top-up via Razorpay</div>
            <div className="hidden sm:block">• All transactions are protected by our escrow system</div>
            <div className="sm:hidden">• Protected by escrow system</div>
          </div>
        </div>

        {/* Sticky Action Buttons - Fixed at bottom */}
        {buyAmount && (
          <div className="flex-shrink-0 bg-white border-t border-zinc-200 pt-3 sm:pt-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="order-2 sm:order-1 flex-1 border-zinc-300 text-zinc-900 hover:bg-zinc-100 h-10 sm:h-11 text-sm sm:text-base"
                disabled={isProcessing || isVerifyingPayment}
              >
                Cancel
              </Button>

              {needsTopUp ? (
                <Button
                  onClick={handleTopUpAndBuy}
                  disabled={!buyAmount || isProcessing || isInitiatingTrade || isCreatingOrder || isVerifyingPayment}
                  className="order-1 sm:order-2 flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 h-10 sm:h-11 text-sm sm:text-base"
                >
                  {isProcessing || isCreatingOrder || isVerifyingPayment ? (
                    <>
                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="hidden sm:inline">
                        {isCreatingOrder ? 'Creating Order...' : isVerifyingPayment ? 'Verifying Payment...' : 'Processing...'}
                      </span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">
                        Top Up & Buy (₹{(topUpAmount * 1).toLocaleString()})
                      </span>
                      <span className="sm:hidden">
                        Top Up & Buy
                      </span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleBuyDirect}
                  disabled={!buyAmount || totalCost > userBalance || isProcessing || isInitiatingTrade || isVerifyingPayment}
                  className="order-1 sm:order-2 flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 h-10 sm:h-11 text-sm sm:text-base"
                >
                  {isProcessing || isInitiatingTrade || isVerifyingPayment ? (
                    <>
                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="hidden sm:inline">
                        {isInitiatingTrade ? 'Initiating Trade...' : isVerifyingPayment ? 'Verifying Payment...' : 'Processing...'}
                      </span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Buy Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BuyListingModal