"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Shield, Award, Loader2, Tag, X, Zap, Crown } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// API hooks for coupon and the DYNAMIC payment flow
import { useLazyValidateCouponCodeQuery } from "@/app/api/couponApiSlice";
import { useCreateDynamicSubscriptionOrderMutation, useVerifySubscriptionPaymentMutation } from "@/app/api/paymentApiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { useNavigate } from "react-router-dom";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// The component is now simplified for a single purpose.
export default function SubscriptionPurchaseCard({ planData, userInfo, onClose }) {
  // State for coupon handling
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const navigate = useNavigate()
  // REMOVED: Unnecessary state for plan selection

  // API mutation hooks, now only for the dynamic flow
  const [createDynamicOrder, { isLoading: isCreatingOrder }] = useCreateDynamicSubscriptionOrderMutation();
  const [verifySubscriptionPayment, { isLoading: isVerifyingPayment }] = useVerifySubscriptionPaymentMutation();
  const [triggerValidation, { isLoading: isValidatingCoupon }] = useLazyValidateCouponCodeQuery();
  const { refetch: refetchUserProfile } = useGetProfileQuery();

  const isProcessing = isCreatingOrder || isVerifyingPayment;
  
  // The price is now directly taken from the monthly property of the dynamic plan
  const currentPrice = planData.monthly?.price || 0;

  const handleApplyCoupon = async () => {
    if (!couponInput || !planData?.name) return;
    setCouponError(null);

    try {
      const result = await triggerValidation(couponInput).unwrap();
      const coupon = result.data;

      // ... Coupon validation logic remains the same and works correctly
      if (new Date(coupon.expiryDate) < new Date()) {
        const errorMessage = "This coupon has expired.";
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }
      if (coupon.maxUses && coupon.timesUsed >= coupon.maxUses) {
        const errorMessage = "This coupon has reached its usage limit.";
        setCouponError(errorMessage); toast.error(errorMessage); return;
      }
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
      // The component now ONLY calls the dynamic order creation endpoint.
    
      const orderResponse = await createDynamicOrder({
        subcategory: planData.name, // The plan's name is the subcategory
      }).unwrap();

      const { order, key_id, transactionId } = orderResponse;
      const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load.");

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "eKYC Solutions",
        description: `Subscription for ${planData.name}`,
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
            navigate(`/user/service/${planData.name}`)
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

  // Price calculation logic
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
                One-Time Access
              </CardTitle>
              <p className="text-blue-100 text-sm font-medium">
                {planData.name}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
              <span>•</span>
              <Award className="w-4 h-4" />
              <span>Instant Access</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            
            {/* REMOVED: The monthly/yearly plan selection UI is gone. */}
            <div className="text-center">
                <Label className="text-lg font-semibold text-gray-800 block">
                  Plan Price
                </Label>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  ₹{currentPrice}
                </p>
                <p className="text-sm text-gray-500">
                  Includes access to all services in this subcategory for 30 days.
                </p>
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
                  {/* SIMPLIFIED: Text is updated for the dynamic plan context */}
                  <span className="text-gray-600">One-Time Access Plan</span>
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