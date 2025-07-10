"use client"

import { useState, useEffect } from "react"
import { Plus, Copy, Check, X, Percent, DollarSign, Gift, Tag, Sparkles, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



// Mock data
const mockOffers= [
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
    return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>
  }

  const isUrgent = timeLeft.days < 2

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isUrgent ? "text-red-600" : "text-orange-600"}`}>
      <Timer className="w-3 h-3" />
      {timeLeft.days > 0 ? (
        <span>
          {timeLeft.days}d {timeLeft.hours}h
        </span>
      ) : (
        <span>
          {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      )}
    </div>
  )
}

const OfferCard = ({ offer, onApply }) => {
  const [copied, setCopied] = useState(false)

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
    <Card className="group relative overflow-hidden border border-gray-200 hover:border-[#1987BF]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-[#1987BF] to-blue-600 text-white font-bold px-3 py-1 text-sm">
          {formatDiscount()}
        </Badge>
      </div>

      {/* Public/Private Indicator */}
      {!offer.isPublic && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Private</Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1987BF]/10 to-blue-500/10 rounded-xl flex items-center justify-center">
            {offer.discountType === "percentage" ? (
              <Percent className="w-6 h-6 text-[#1987BF]" />
            ) : (
              <DollarSign className="w-6 h-6 text-[#1987BF]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{offer.title}</CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Savings Information */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-green-600">{calculateSavings()}</div>
          <CountdownTimer expiryDate={offer.expiryDate} />
        </div>

        {/* Usage Progress */}
        {offer.maxUsage && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Used: {offer.usageCount}</span>
              <span>Limit: {offer.maxUsage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#1987BF] to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Minimum Order Value */}
        {offer.minOrderValue && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            Minimum order value: ₹{offer.minOrderValue}
          </div>
        )}

        {/* Code and Actions */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-gray-900">{offer.code}</span>
              <Button onClick={handleCopy} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-600" />}
              </Button>
            </div>
          </div>
          <Button
            onClick={() => onApply(offer.code)}
            className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white px-6 py-2 font-medium rounded-lg transition-all duration-200 hover:scale-105"
          >
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const CreateOfferCard = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewOffer>({
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

  const validateForm = () => {
    const newErrors = {}

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
    <Card className="border-2 border-[#1987BF]/20 bg-gradient-to-br from-[#1987BF]/5 to-blue-500/5 animate-in slide-in-from-top-4 duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1987BF] rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Create New Offer</CardTitle>
          </div>
          <Button onClick={onCancel} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Summer Sale 2025"
              className={`${errors.title ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Get amazing discounts on all verification services"
              className={`${errors.description ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
            <Select
              value={formData.discountType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, discountType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="flat">Flat Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value * {formData.discountType === "percentage" ? "(%)" : "(₹)"}
            </label>
            <Input
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: e.target.value }))}
              placeholder={formData.discountType === "percentage" ? "20" : "100"}
              className={`${errors.discountValue ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {errors.discountValue && <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>}
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
            <div className="flex gap-2">
              <Input
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER20"
                className={`${errors.code ? "border-red-400 focus:border-red-500" : ""}`}
              />
              <Button onClick={generateCode} variant="outline" size="sm" className="px-3 bg-transparent">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
            <Input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className={`${errors.expiryDate ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>

          {/* Max Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Usage (Optional)</label>
            <Input
              type="number"
              value={formData.maxUsage}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxUsage: e.target.value }))}
              placeholder="100"
            />
          </div>

          {/* Min Order Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Value (₹)</label>
            <Input
              type="number"
              value={formData.minOrderValue}
              onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
              placeholder="200"
            />
          </div>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            className="w-4 h-4 text-[#1987BF] border-gray-300 rounded focus:ring-[#1987BF]"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
            Make this offer public (visible to all users)
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button onClick={handleSubmit} className="flex-1 bg-[#1987BF] hover:bg-[#1987BF]/90 text-white font-medium">
            <Gift className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
          <Button onClick={onCancel} variant="outline" className="px-6 bg-transparent">
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
    // Here you would typically integrate with your cart/checkout system
    console.log("Applied offer code:", code)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupons & Offers</h1>
            <p className="text-gray-600">Manage promotional offers and discounts</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Offer
          </Button>
        </div>

        {/* Applied Code Notification */}
        {appliedCode && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Coupon "{appliedCode}" applied successfully!</span>
            </div>
          </div>
        )}

        {/* Create Offer Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateOfferCard onSave={handleSaveOffer} onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        {/* Public Offers */}
        {publicOffers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-[#1987BF]" />
              <h2 className="text-xl font-bold text-gray-900">Public Offers</h2>
              <Badge className="bg-[#1987BF]/10 text-[#1987BF] border-[#1987BF]/20">
                {publicOffers.length} available
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onApply={handleApplyOffer} />
              ))}
            </div>
          </div>
        )}

        {/* Private Offers */}
        {privateOffers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Gift className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Exclusive Offers</h2>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {privateOffers.length} exclusive
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onApply={handleApplyOffer} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeOffers.length === 0 && !showCreateForm && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No active offers</h3>
            <p className="text-gray-600 mb-6">Create your first promotional offer to get started</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#1987BF] hover:bg-[#1987BF]/90 text-white font-medium px-8 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Offer
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
