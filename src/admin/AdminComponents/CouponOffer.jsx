"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Copy, Check, X, Percent, IndianRupee, Gift, Tag, Sparkles, Timer, Trash2, Loader2, AlertTriangle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation, useUpdateCouponMutation } from "@/app/api/couponApiSlice" // <-- IMPORT API HOOKS
import { toast } from 'react-hot-toast';


const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(null)
  const expiry = new Date(expiryDate); // Ensure it's a Date object

  useEffect(() => {
    if (isNaN(expiry.getTime())) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = expiry.getTime() - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft(null)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [expiry])

  if (isNaN(expiry.getTime())) {
    return <Badge variant="destructive">Invalid Date</Badge>;
  }

  if (!timeLeft) {
    return (
      <Badge className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 font-medium px-3 py-1 rounded-full">
        Expired
      </Badge>
    )
  }

  const isUrgent = timeLeft.days < 2

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border ${
        isUrgent ? "bg-red-50/80 border-red-200 text-red-700" : "bg-orange-50/80 border-orange-200 text-orange-700"
      }`}
    >
      <Timer className="w-3.5 h-3.5 animate-pulse" />
      <span className="text-xs font-semibold">
        {timeLeft.days > 0
          ? `${timeLeft.days}d ${timeLeft.hours}h`
          : `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
      </span>
    </div>
  )
}

const OfferCard = ({ offer, onDelete, onEdit, index }) => {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [index])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(offer.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDiscount = () => {
    if (offer.discountType === "percentage") {
      return `${offer.discountValue}% OFF`
    }
    return `₹${offer.discountValue} OFF`
  }

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-lg shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="pb-4 pt-6 px-6 relative z-10">
          <div className="flex justify-end ">
            <Badge className="bg-gradient-to-r from-[#1987BF] to-blue-600 text-white font-bold px-3 py-1.5 text-sm rounded-full shadow-lg shadow-blue-500/25">
              {formatDiscount()}
            </Badge>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF]/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              {offer.discountType === "percentage" ? (
                <Percent className="w-6 h-6 text-[#1987BF]" />
              ) : (
                <IndianRupee className="w-6 h-6 text-[#1987BF]" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <CardTitle 
                className="text-lg font-bold text-gray-900 mb-2 leading-tight break-words hyphens-auto"
                title={offer.title} // Tooltip for full text on hover
              >
                {offer.title.length > 50 ? `${offer.title.substring(0, 47)}...` : offer.title}
              </CardTitle>
            </div>
          </div>
          
          {/* Discount badge moved below title for better layout */}
          
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6 relative z-10">
          {/* Description with proper text handling */}
          <p 
            className="text-sm text-gray-600 leading-relaxed break-words hyphens-auto -mt-2"
            title={offer.description} // Tooltip for full text
          >
            {offer.description.length > 80 
              ? `${offer.description.substring(0, 77)}...` 
              : offer.description
            }
          </p>

          {/* Timer and Action buttons - now side by side */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
              <CountdownTimer expiryDate={offer.expiryDate} />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit(offer)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-blue-50 border border-white/50 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Pencil className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                onClick={() => onDelete(offer.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-red-50 border border-white/50 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Usage progress */}
          {offer.maxUsage && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">Usage Progress</span>
                <span className="font-semibold">
                  {offer.usageCount}/{offer.maxUsage}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200/60 rounded-full h-2.5 backdrop-blur-sm">
                  <div
                    className="bg-gradient-to-r from-[#1987BF] to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${Math.min((offer.usageCount / offer.maxUsage) * 100, 100)}%` }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Coupon code section */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-dashed border-gray-300/50 group-hover:border-[#1987BF]/30 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span 
                  className="font-mono text-sm font-bold text-gray-900 tracking-wider break-all flex-1"
                  title={offer.code} // Tooltip for full code
                >
                  {offer.code.length > 12 ? `${offer.code.substring(0, 9)}...` : offer.code}
                </span>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110 ml-2 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-600 hover:text-[#1987BF]" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const OfferFormCard = ({ onSave, onCancel, isLoading, initialData = null }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    description: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    maxUses: "",
    minAmount: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      setFormData({
        description: initialData.title,
        code: initialData.code,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue.toString(),
        expiryDate: new Date(initialData.expiryDate).toISOString().slice(0, 16),
        maxUses: initialData.maxUsage?.toString() || "",
        minAmount: initialData.minOrderValue?.toString() || "",
      });
    }
  }, [initialData, isEditing]);

  const validateForm = ()=> {
    const newErrors= {}
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.discountValue || Number.parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = "Valid discount value is required"
    }
    if (!formData.code.trim()) newErrors.code = "Coupon code is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const dataToSubmit = {
        description: formData.description,
        code: formData.code.toUpperCase(),
        discount: {
            type: formData.discountType,
            value: Number.parseFloat(formData.discountValue)
        },
        expiryDate: new Date(formData.expiryDate).toISOString(),
        isActive: true,
        ...(formData.maxUses && { maxUses: Number.parseInt(formData.maxUses) }),
        ...(formData.minAmount && { minAmount: Number.parseFloat(formData.minAmount) }),
      }
      if (isEditing) {
        onSave({ id: initialData.id, ...dataToSubmit });
      } else {
        onSave(dataToSubmit);
      }
    }
  }

  const generateCode = () => {
    const code =
      formData.description
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 8) + Math.floor(Math.random() * 100)
    setFormData((prev) => ({ ...prev, code }))
  }

  return (
    <Card className="border-0 backdrop-blur-xl shadow-xl shadow-blue-500/10 rounded-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-2xl" />

      <CardHeader className="px-8 pt-8 pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              {isEditing ? <Pencil className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{isEditing ? 'Update Offer' : 'Create New Offer'}</CardTitle>
          </div>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 px-8 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Offer Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Get 20% off all verification services"
              className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base ${
                errors.description ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2 font-medium">{errors.description}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Discount Type *</label>
            <Select
              value={formData.discountType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, discountType: value }))
              }
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base focus:border-[#1987BF]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl">
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="flat">Flat Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Discount Value * {formData.discountType === "percentage" ? "(%)" : "(₹)"}
            </label>
            <Input
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: e.target.value }))}
              placeholder={formData.discountType === "percentage" ? "20" : "100"}
              className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base ${
                errors.discountValue ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
              }`}
            />
            {errors.discountValue && <p className="text-red-500 text-sm mt-2 font-medium">{errors.discountValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Coupon Code *</label>
            <div className="flex gap-3">
              <Input
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER20"
                className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base font-mono ${
                  errors.code ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
                }`}
              />
              <Button
                onClick={generateCode}
                variant="outline"
                size="sm"
                className="px-4 h-12 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl hover:bg-[#1987BF]/10 hover:border-[#1987BF] transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </div>
            {errors.code && <p className="text-red-500 text-sm mt-2 font-medium">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Expiry Date *</label>
            <Input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base ${
                errors.expiryDate ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
              }`}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-2 font-medium">{errors.expiryDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Max Usage (Optional)</label>
            <Input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxUses: e.target.value }))}
              placeholder="100"
              className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base focus:border-[#1987BF]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Min Order Value (₹, Optional)</label>
            <Input
              type="number"
              value={formData.minAmount}
              onChange={(e) => setFormData((prev) => ({ ...prev, minAmount: e.target.value }))}
              placeholder="200"
              className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base focus:border-[#1987BF]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200/50">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
                <Gift className="w-5 h-5 mr-2" />
            )}
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Offer' : 'Create Offer')}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-8 h-12 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
        ))}
    </div>
);


export default function CouponsOffers() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  
  // RTK Query Hooks
  const { data: offersData, isLoading, isError, error } = useGetAllCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleCreateOffer = async (newOfferData) => {
    try {
        await createCoupon(newOfferData).unwrap();
        toast.success("Offer created successfully!");
        setShowCreateForm(false);
    } catch (err) {
        toast.error(err?.data?.message || "Failed to create offer.");
        console.error("Failed to create coupon:", err);
    }
  }
  
  const handleUpdateOffer = async (updatedOfferData) => {
    try {
        await updateCoupon(updatedOfferData).unwrap();
        toast.success("Offer updated successfully!");
        setEditingOffer(null);
    } catch (err) {
        toast.error(err?.data?.message || "Failed to update offer.");
        console.error("Failed to update coupon:", err);
    }
  };

  const handleDeleteOffer = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this offer? This action cannot be undone.")) {
      try {
        await deleteCoupon(couponId).unwrap();
        toast.success("Offer deleted successfully!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete offer.");
        console.error("Failed to delete coupon:", err);
      }
    }
  }
  
  const handleStartEdit = (offer) => {
      setEditingOffer(offer);
      setShowCreateForm(false); 
  }

  const handleCancelEdit = () => {
      setEditingOffer(null);
      setShowCreateForm(false);
  }

  // Map API data to the format expected by the component
  const mappedOffers = offersData?.data?.map(offer => ({
    id: offer._id,
    title: offer.description,
    description: `Code: ${offer.code} | ${offer.discount.type === 'percentage' ? `${offer.discount.value}%` : `₹${offer.discount.value}`} off`,
    discountType: offer.discount.type,
    discountValue: offer.discount.value,
    code: offer.code,
    expiryDate: offer.expiryDate,
    isActive: offer.isActive,
    usageCount: offer.timesUsed,
    maxUsage: offer.maxUses,
    minOrderValue: offer.minAmount || 0,
  })) || [];
  
  const activeOffers = mappedOffers.filter((offer) => offer.isActive)

  return (
    <div className="min-h-screen bg-gray-50  relative overflow-hidden">
      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl  font-bold text-gray-900 mb-4 leading-tight">Coupons & Offers</h1>
              <p className=" text-gray-600 leading-relaxed">
                Manage promotional offers and discounts with our advanced coupon system
              </p>
            </div>
            <Button
              onClick={() => { setShowCreateForm(true); setEditingOffer(null); }}
              className="bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Offer
            </Button>
          </div>

          {/* Create or Update Offer Form */}
          {(showCreateForm || editingOffer) && (
            <div className="mb-12">
              <OfferFormCard 
                onSave={editingOffer ? handleUpdateOffer : handleCreateOffer} 
                onCancel={handleCancelEdit} 
                isLoading={isCreating || isUpdating}
                initialData={editingOffer}
              />
            </div>
          )}
          
          {isError && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-4">
                      <AlertTriangle className="w-8 h-8 text-red-500"/>
                      <div>
                          <p className="text-red-800 font-semibold text-lg">Failed to load offers</p>
                          <p className="text-red-700">{error?.data?.message || "An unknown error occurred."}</p>
                      </div>
                  </div>
              </div>
          )}

          {isLoading ? (
              <LoadingSkeleton />
          ) : activeOffers.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF]/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Tag className="w-6 h-6 text-[#1987BF]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">All Active Offers</h2>
                <Badge className="bg-gradient-to-r from-[#1987BF]/10 to-blue-500/10 text-[#1987BF] border border-[#1987BF]/20 font-semibold px-4 py-2 rounded-full">
                  {activeOffers.length} available
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeOffers.map((offer, index) => (
                  <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    onDelete={handleDeleteOffer}
                    onEdit={handleStartEdit}
                    index={index} 
                  />
                ))}
              </div>
            </div>
          ) : !showCreateForm && !editingOffer && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100/80 to-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Gift className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No active offers</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Create your first promotional offer to start engaging customers with amazing deals
              </p>
              <Button
                onClick={() => { setShowCreateForm(true); setEditingOffer(null); }}
                className="bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Offer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}