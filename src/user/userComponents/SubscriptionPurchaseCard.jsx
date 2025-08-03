"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Shield, Award, Loader2, Tag, X, Zap, Check, Star, Crown } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { useLazyValidateCouponCodeQuery } from "@/app/api/couponApiSlice";
import { useCreateSubscriptionOrderMutation, useVerifySubscriptionPaymentMutation } from "@/app/api/paymentApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// The component now correctly expects a `planData` prop
export default function SubscriptionPurchaseCard({ planData, userInfo, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const [createSubscriptionOrder, { isLoading: isCreatingOrder }] = useCreateSubscriptionOrderMutation();
  const [verifySubscriptionPayment, { isLoading: isVerifyingPayment }] = useVerifySubscriptionPaymentMutation();
  const [triggerValidation, { isLoading: isValidatingCoupon }] = useLazyValidateCouponCodeQuery();
  const { refetch: refetchUserProfile } = useGetProfileQuery();

  const isProcessing = isCreatingOrder || isVerifyingPayment;
  
  // Correctly reads price and calculates savings from the `planData` object
  const currentPrice = planData[selectedPlan]?.price || 0;
  const yearlySavings = Math.round(((planData.monthly.price * 12 - planData.yearly.price) / (planData.monthly.price * 12)) * 100);

  const handleApplyCoupon = async () => {
    if (!couponInput || !planData?.name) return;
    setCouponError(null);

    try {
      const result = await triggerValidation(couponInput).unwrap();
      const coupon = result.data;

      if (new Date(coupon.expiryDate) < new Date()) {
        const errorMessage = "This coupon has expired.";
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }
      if (coupon.maxUses && coupon.timesUsed >= coupon.maxUses) {
        const errorMessage = "This coupon has reached its usage limit.";
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }
      // Correctly validates the coupon against the plan's name
      if (coupon.applicableCategories.length > 0 && !coupon.applicableCategories.includes(planData.name)) {
        const errorMessage = `This coupon is not valid for the "${planData.name}" plan.`;
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }
      if (coupon.minAmount > 0 && currentPrice < coupon.minAmount) {
        const errorMessage = `This coupon requires a minimum purchase of ₹${coupon.minAmount}.`;
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }

      setAppliedCoupon(coupon);
      toast.success("Coupon applied successfully!");

    } catch (err) {
      const errorMessage = err?.data?.message || "Invalid or expired coupon code.";
      setAppliedCoupon(null);
      setCouponError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    toast.success("Coupon removed.");
  };

  const handlePurchase = async () => {
    try {
      // Correctly sends `planName` and `planType` to the API
      const orderResponse = await createSubscriptionOrder({
        planName: planData.name,
        planType: selectedPlan,
        couponCode: appliedCoupon?.code,
      }).unwrap();

      const { order, key_id, transactionId } = orderResponse;
      const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load.");

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "eKYC Solutions",
        description: `Subscription for ${planData.name} (${selectedPlan})`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifySubscriptionPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              transactionId: transactionId,
            }).unwrap();
            toast.success("Subscription activated successfully!");
            await refetchUserProfile();
            onClose();
          } catch (err) {
            toast.error(err.data?.message || "Payment verification failed.");
          }
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => toast.error("Payment was cancelled.") },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.data?.message || "Could not initiate purchase.");
    }
  };

  let finalPrice = currentPrice;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount.type === 'fixed') {
      discountAmount = appliedCoupon.discount.value;
    } else {
      discountAmount = (currentPrice * appliedCoupon.discount.value) / 100;
    }
    finalPrice = Math.max(0, currentPrice - discountAmount);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-xl">
        <Card className="w-full bg-white shadow-2xl border-0 overflow-hidden">
          <CardHeader className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 text-center">
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </motion.button>
            <div className="mb-3">
              <Crown className="w-10 h-10 mx-auto mb-2 text-yellow-300" />
              <CardTitle className="text-xl font-bold mb-1">
                Premium Access
              </CardTitle>
              <p className="text-blue-100 text-sm font-medium">
                {planData.name.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
              <span>•</span>
              <Award className="w-4 h-4" />
              <span>Premium Features</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 block">
                Choose Your Plan
              </Label>
              <div className="grid grid-cols-1 gap-4">
                <div
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Monthly Plan</h3>
                      <p className="text-sm text-gray-600">Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{planData.monthly.price}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  {selectedPlan === 'monthly' && (
                    <div className="absolute top-4 left-4 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                  onClick={() => setSelectedPlan('yearly')}
                >
                  {yearlySavings > 0 && (
                    <div className="absolute -top-3 left-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Save {yearlySavings}%
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Yearly Plan</h3>
                      <p className="text-sm text-gray-600">Billed annually</p>
                      {yearlySavings > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          You save ₹{(planData.monthly.price * 12 - planData.yearly.price).toFixed(0)} per year
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{planData.yearly.price}
                      </div>
                      <div className="text-sm text-gray-500">per year</div>
                      <div className="text-xs text-gray-400">
                        (₹{(planData.yearly.price / 12).toFixed(0)}/month)
                      </div>
                    </div>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="absolute top-4 left-4 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {!showCouponInput ? (
                <Button variant="ghost" className="w-full justify-start p-0 h-auto text-blue-600 hover:text-blue-700 font-medium" onClick={() => setShowCouponInput(true)}>
                  <Tag className="mr-2 h-4 w-4" />
                  Have a promo code?
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="coupon-input" className="text-sm font-medium text-gray-700">Promo Code</Label>
                  <div className="flex gap-3">
                    <Input id="coupon-input" placeholder="Enter promo code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} disabled={!!appliedCoupon} className="font-mono h-11" />
                    <Button onClick={handleApplyCoupon} disabled={isValidatingCoupon || !couponInput || !!appliedCoupon} variant="outline" className="h-11 px-6">
                      {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {couponError && !appliedCoupon && <p className="text-sm text-red-600">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-medium text-sm">Promo code applied!</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription</span>
                  <span className="font-medium">₹{currentPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="font-bold text-2xl text-gray-900">₹{finalPrice.toFixed(2)}</span>
                    {appliedCoupon && <div className="text-sm text-gray-500 line-through">₹{currentPrice.toFixed(2)}</div>}
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handlePurchase} disabled={isProcessing} className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg">
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</> : <><Zap className="w-5 h-5 mr-2" />Complete Purchase</>}
            </Button>

            <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}