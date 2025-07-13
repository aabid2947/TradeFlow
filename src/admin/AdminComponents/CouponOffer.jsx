"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Copy, Check, X, Percent, DollarSign, Gift, Tag, Sparkles, Timer, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// Mock data
const mockOffers = [
  {
    id: "1",
    title: "Summer Verification Sale",
    description: "Get 20% off on all document verification services",
    discountType: "percentage",
    discountValue: 20,
    code: "SUMMER20",
    expiryDate: new Date("2025-07-31T23:59:59"),
    isActive: true,
    isPublic: true,
    usageCount: 45,
    maxUsage: 100,
    minOrderValue: 100,
  },
  {
    id: "2",
    title: "New User Welcome",
    description: "₹50 off your first verification",
    discountType: "flat",
    discountValue: 50,
    code: "WELCOME50",
    expiryDate: new Date("2025-12-31T23:59:59"),
    isActive: true,
    isPublic: true,
    usageCount: 123,
    maxUsage: 500,
    minOrderValue: 200,
  },
  {
    id: "3",
    title: "KYC Bundle Discount",
    description: "15% off on KYC verification packages",
    discountType: "percentage",
    discountValue: 15,
    code: "KYC15",
    expiryDate: new Date("2025-02-15T23:59:59"),
    isActive: true,
    isPublic: false,
    usageCount: 28,
    maxUsage: 50,
    minOrderValue: 300,
  },
  {
    id: "4",
    title: "Flash Sale - 48 Hours",
    description: "Limited time offer - ₹100 off premium services",
    discountType: "flat",
    discountValue: 100,
    code: "FLASH100",
    expiryDate: new Date("2025-01-10T23:59:59"),
    isActive: true,
    isPublic: true,
    usageCount: 67,
    maxUsage: 200,
    minOrderValue: 500,
  },
]

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = expiryDate.getTime()
      const difference = expiry - now

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
  }, [expiryDate])

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

const OfferCard = ({ offer, onApply, index }) => {
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

  const calculateSavings = () => {
    if (offer.discountType === "percentage") {
      const minSaving = offer.minOrderValue ? (offer.minOrderValue * offer.discountValue) / 100 : 0
      return `Save up to ₹${Math.round(minSaving)}`
    }
    return `Save ₹${offer.discountValue}`
  }

  const usagePercentage = offer.maxUsage ? (offer.usageCount / offer.maxUsage) * 100 : 0

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-lg shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] rounded-2xl">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-6 right-6 z-20">
          <Badge className="bg-gradient-to-r from-[#1987BF] to-blue-600 text-white font-bold px-4 py-2 text-sm rounded-full shadow-lg shadow-blue-500/25 animate-pulse">
            {formatDiscount()}
          </Badge>
        </div>

        {!offer.isPublic && (
          <div className="absolute top-6 left-6 z-20">
            <Badge className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1" />
              Exclusive
            </Badge>
          </div>
        )}

        <CardHeader className="pb-4 pt-8 px-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1987BF]/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
              {offer.discountType === "percentage" ? (
                <Percent className="w-7 h-7 text-[#1987BF]" />
              ) : (
                <DollarSign className="w-7 h-7 text-[#1987BF]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">{offer.title}</CardTitle>
              <p className="text-sm text-gray-600 leading-relaxed">{offer.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8 relative z-10">
          {/* Savings and Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">{calculateSavings()}</span>
            </div>
            <CountdownTimer expiryDate={offer.expiryDate} />
          </div>

          {/* Usage Progress */}
          {offer.maxUsage && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">Usage Progress</span>
                <span className="font-semibold">
                  {offer.usageCount}/{offer.maxUsage}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200/60 rounded-full h-3 backdrop-blur-sm">
                  <div
                    className="bg-gradient-to-r from-[#1987BF] to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Minimum Order Value */}
          {offer.minOrderValue && (
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1987BF] rounded-full" />
                <span className="text-sm font-medium text-gray-700">Minimum order value: ₹{offer.minOrderValue}</span>
              </div>
            </div>
          )}

          {/* Code and Actions */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-dashed border-gray-300/50 group-hover:border-[#1987BF]/30 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-gray-900 tracking-wider">{offer.code}</span>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 hover:text-[#1987BF]" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={() => onApply(offer.code)}
              className="bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white px-8 py-3 font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const CreateOfferCard = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    code: "",
    expiryDate: "",
    isPublic: true,
    maxUsage: "",
    minOrderValue: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = ()=> {
    const newErrors= {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
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
      onSave(formData)
    }
  }

  const generateCode = () => {
    const code =
      formData.title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 8) + Math.floor(Math.random() * 100)
    setFormData((prev) => ({ ...prev, code }))
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-[#1987BF]/10 via-blue-50/80 to-purple-50/80 backdrop-blur-xl shadow-xl shadow-blue-500/10 rounded-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-2xl" />

      <CardHeader className="px-8 pt-8 pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create New Offer</CardTitle>
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
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Offer Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Summer Sale 2025"
              className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base ${
                errors.title ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-2 font-medium">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Get amazing discounts on all verification services"
              className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base ${
                errors.description ? "border-red-400 focus:border-red-500" : "focus:border-[#1987BF]"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2 font-medium">{errors.description}</p>}
          </div>

          {/* Discount Type */}
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

          {/* Discount Value */}
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

          {/* Coupon Code */}
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

          {/* Expiry Date */}
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

          {/* Max Usage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Max Usage (Optional)</label>
            <Input
              type="number"
              value={formData.maxUsage}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxUsage: e.target.value }))}
              placeholder="100"
              className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base focus:border-[#1987BF]"
            />
          </div>

          {/* Min Order Value */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Min Order Value (₹)</label>
            <Input
              type="number"
              value={formData.minOrderValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
              placeholder="200"
              className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl h-12 text-base focus:border-[#1987BF]"
            />
          </div>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            className="w-5 h-5 text-[#1987BF] border-gray-300 rounded focus:ring-[#1987BF] focus:ring-2"
          />
          <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Make this offer public (visible to all users)
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200/50">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            <Gift className="w-5 h-5 mr-2" />
            Create Offer
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

export default function CouponsOffers() {
  const [offers, setOffers] = useState(mockOffers)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [appliedCode, setAppliedCode] = useState(null)

  const handleApplyOffer = (code) => {
    setAppliedCode(code)
    setTimeout(() => setAppliedCode(null), 3000)

  }

  const handleSaveOffer = (newOfferData) => {
    const newOffer = {
      id: Date.now().toString(),
      title: newOfferData.title,
      description: newOfferData.description,
      discountType: newOfferData.discountType,
      discountValue: Number.parseFloat(newOfferData.discountValue),
      code: newOfferData.code,
      expiryDate: new Date(newOfferData.expiryDate),
      isActive: true,
      isPublic: newOfferData.isPublic,
      usageCount: 0,
      maxUsage: newOfferData.maxUsage ? Number.parseInt(newOfferData.maxUsage) : undefined,
      minOrderValue: newOfferData.minOrderValue ? Number.parseFloat(newOfferData.minOrderValue) : undefined,
    }

    setOffers((prev) => [newOffer, ...prev])
    setShowCreateForm(false)
  }

  const activeOffers = offers.filter((offer) => offer.isActive)
  const publicOffers = activeOffers.filter((offer) => offer.isPublic)
  const privateOffers = activeOffers.filter((offer) => !offer.isPublic)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,135,191,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" /> */}

      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">Coupons & Offers</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Manage promotional offers and discounts with our advanced coupon system
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-[#1987BF] to-blue-600 hover:from-[#1987BF]/90 hover:to-blue-600/90 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Offer
            </Button>
          </div>

          {/* Applied Code Notification */}
          {appliedCode && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-xl border border-green-200/50 rounded-2xl shadow-lg shadow-green-500/10 animate-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-lg">Success!</p>
                  <p className="text-green-700">Coupon "{appliedCode}" applied successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Create Offer Form */}
          {showCreateForm && (
            <div className="mb-12">
              <CreateOfferCard onSave={handleSaveOffer} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {/* Public Offers */}
          {publicOffers.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF]/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Tag className="w-6 h-6 text-[#1987BF]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Public Offers</h2>
                <Badge className="bg-gradient-to-r from-[#1987BF]/10 to-blue-500/10 text-[#1987BF] border border-[#1987BF]/20 font-semibold px-4 py-2 rounded-full">
                  {publicOffers.length} available
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {publicOffers.map((offer, index) => (
                  <OfferCard key={offer.id} offer={offer} onApply={handleApplyOffer} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Private Offers */}
          {privateOffers.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Exclusive Offers</h2>
                <Badge className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 text-purple-800 border border-purple-200/50 font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                  {privateOffers.length} exclusive
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {privateOffers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onApply={handleApplyOffer}
                    index={index + publicOffers.length}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeOffers.length === 0 && !showCreateForm && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100/80 to-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Gift className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No active offers</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Create your first promotional offer to start engaging customers with amazing deals
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
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
