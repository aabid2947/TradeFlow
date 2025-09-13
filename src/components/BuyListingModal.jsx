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
import { Loader2, Wallet, CreditCard, ArrowRight, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react'

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
    if (numValue >= listing.minLimit && numValue <= listing.maxLimit && numValue <= listing.funTokenAmount) {
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
      // Create Razorpay order for top-up
      const result = await createPaymentOrder({
        tokenAmount: topUpAmount
      }).unwrap()

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
            setTimeout(() => {
              handleBuyDirect()
            }, 1000)
            
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError)
            toast({
              title: "Payment Verification Failed",
              description: verifyError.data?.message || "Please contact support if amount was debited",
              variant: "destructive",
            })
            setIsProcessing(false)
          }
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName,
          email: user?.email,
        },
        theme: {
          color: '#059669'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "destructive",
            })
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
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
      <DialogContent className="max-w-2xl bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-zinc-200">
          <DialogTitle className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            Buy FUN Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto px-1">
          {/* Listing Info */}
          <Card className="bg-zinc-50 border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-zinc-900">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Seller:</span>
                <span className="font-medium text-zinc-900">{listing.sellerId?.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Available:</span>
                <span className="font-medium text-zinc-900">{listing.funTokenAmount.toLocaleString()} FUN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Price per Token:</span>
                <span className="font-medium text-zinc-900">₹{listing.priceInFunToken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Limit:</span>
                <span className="font-medium text-zinc-900">{listing.minLimit} - {listing.maxLimit} FUN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Payment Methods:</span>
                <div className="flex gap-1">
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  <span className="text-zinc-700 font-medium">Your Balance:</span>
                </div>
                <span className="text-xl font-bold text-zinc-900">{userBalance.toLocaleString()} FUN</span>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="buyAmount" className="text-zinc-700 font-medium">
              Amount to Buy (FUN Tokens) *
            </Label>
            <Input
              id="buyAmount"
              type="number"
              min={listing.minLimit}
              max={Math.min(listing.maxLimit, listing.funTokenAmount)}
              value={buyAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={`Enter amount (${listing.minLimit} - ${Math.min(listing.maxLimit, listing.funTokenAmount)})`}
              className="bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
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
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-zinc-900">Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">FUN Tokens:</span>
                  <span className="font-medium text-zinc-900">{Number(buyAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Price per Token:</span>
                  <span className="font-medium text-zinc-900">₹{listing.priceInFunToken}</span>
                </div>
                <div className="flex justify-between items-center font-semibold pt-3 border-t border-zinc-200">
                  <span className="text-zinc-900">Total Cost:</span>
                  <span className="text-green-600 text-lg">₹{totalCost.toLocaleString()}</span>
                </div>

                {needsTopUp && (
                  <Card className="bg-amber-50 border-amber-200 mt-4">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-800 font-medium">Insufficient Balance</span>
                      </div>
                      <div className="text-sm text-amber-700 space-y-1">
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
          <div className="text-xs text-zinc-500 text-center space-y-1">
            <div>• Purchases are processed through our secure P2P system</div>
            <div>• Top-up payments are processed via Razorpay</div>
            <div>• All transactions are protected by our escrow system</div>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        {buyAmount && (
          <div className="sticky bottom-0 bg-white border-t border-zinc-200 pt-4 mt-6">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-zinc-300 text-zinc-900 hover:bg-zinc-100"
                disabled={isProcessing || isVerifyingPayment}
              >
                Cancel
              </Button>

              {needsTopUp ? (
                <Button
                  onClick={handleTopUpAndBuy}
                  disabled={!buyAmount || isProcessing || isInitiatingTrade || isCreatingOrder || isVerifyingPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
                >
                  {isProcessing || isCreatingOrder || isVerifyingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCreatingOrder ? 'Creating Order...' : isVerifyingPayment ? 'Verifying Payment...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Top Up & Buy (₹{(topUpAmount * 1).toLocaleString()})
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleBuyDirect}
                  disabled={!buyAmount || totalCost > userBalance || isProcessing || isInitiatingTrade || isVerifyingPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
                >
                  {isProcessing || isInitiatingTrade || isVerifyingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isInitiatingTrade ? 'Initiating Trade...' : isVerifyingPayment ? 'Verifying Payment...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
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
