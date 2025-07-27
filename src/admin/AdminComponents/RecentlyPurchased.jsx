"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  User,
  Package,
  DollarSign,
  Eye,
  Download,
  AlertTriangle,
  Loader,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetAllTransactionsQuery } from "@/app/api/transactionApiSlice"

// Mock data for demonstration since RTK Query setup is not provided in this context
const mockTransactions = [
  {
    _id: "ORD-2025-001",
    user: { name: "Sarah Johnson", email: "sarah.johnson@email.com" },
    service: { name: "PAN Card Verification - Premium", price: 299 },
    timestamp: "2025-01-08T14:30:00Z",
    status: "completed",
  },
  {
    _id: "ORD-2025-002",
    user: { name: "Michael Chen", email: "michael.chen@company.com" },
    service: { name: "Business Verification Suite", price: 599 },
    timestamp: "2025-01-08T13:15:00Z",
    status: "processing",
  },
  {
    _id: "ORD-2025-003",
    user: { name: "Emily Rodriguez", email: "emily.rodriguez@email.com" },
    service: { name: "Aadhaar Verification - Standard", price: 199 },
    timestamp: "2025-01-08T12:45:00Z",
    status: "shipped",
  },
  {
    _id: "ORD-2025-004",
    user: { name: "David Kumar", email: "david.kumar@tech.com" },
    service: { name: "Document OCR Service", price: 149 },
    timestamp: "2025-01-08T11:20:00Z",
    status: "delivered",
  },
  {
    _id: "ORD-2025-005",
    user: { name: "Lisa Thompson", email: "lisa.thompson@enterprise.com" },
    service: { name: "KYC Verification - Enterprise", price: 899 },
    timestamp: "2025-01-08T10:30:00Z",
    status: "completed",
  },
  {
    _id: "ORD-2025-006",
    user: { name: "James Wilson", email: "james.wilson@email.com" },
    service: { name: "Background Check Service", price: 249 },
    timestamp: "2025-01-08T09:15:00Z",
    status: "processing",
  },
  {
    _id: "ORD-2025-007",
    user: { name: "Amanda Foster", email: "amanda.foster@biometric.com" },
    service: { name: "Biometric Verification", price: 399 },
    timestamp: "2025-01-08T08:45:00Z",
    status: "shipped",
  },
  {
    _id: "ORD-2025-008",
    user: { name: "Robert Garcia", email: "robert.garcia@business.com" },
    service: { name: "GST Verification Service", price: 179 },
    timestamp: "2025-01-08T07:30:00Z",
    status: "failed", // Added a failed status for demonstration
  },
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "failed":
      return "bg-red-100 text-red-800 border-red-200"
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "delivered":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getAvatarBgColor = (name) => {
  const colors = [
    "from-blue-600 to-blue-800",
    "from-green-600 to-green-800",
    "from-purple-600 to-purple-800",
    "from-red-600 to-red-800",
    "from-yellow-600 to-yellow-800",
  ]
  if (!name) return colors[0]
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const BuyerRow = ({ buyer, isExpanded, onToggle, isMobile }) => {
  const avatarBg = getAvatarBgColor(buyer.name)

  if (isMobile) {
    return (
      <Card className="mb-4 overflow-hidden border border-gray-200 hover:border-[#1987BF]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-0">
          <div onClick={onToggle} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {buyer.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{buyer.name || "N/A"}</h3>
                  <p className="text-sm text-gray-500 truncate">{buyer.productName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1987BF]">{formatCurrency(buyer.amount)}</div>
                <Badge className={`text-xs ${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">{isExpanded ? "Hide details" : "View details"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Expanded Details */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Information</h4>
                    <p className="text-sm text-gray-600">{buyer.email || "N/A"}</p>
                    <p className="text-sm text-gray-600">{buyer.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Payment Method</h4>
                    <p className="text-sm text-gray-600">{buyer.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Order ID & Date</h4>
                    <p className="text-sm text-gray-600">{buyer.orderId}</p>
                    <p className="text-sm text-gray-600">{formatDate(buyer.purchaseDate)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View Order
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <tr
        onClick={onToggle}
        className="group cursor-pointer hover:bg-blue-50/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-b border-gray-100"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
            >
              {buyer.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{buyer.name || "N/A"}</div>
              <div className="font-medium text-gray-900">{buyer.productName}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="font-bold text-[#1987BF]">{formatCurrency(buyer.amount)}</div>
        </td>
        <td className="px-6 py-4">
          <Badge className={`${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#1987BF] transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#1987BF] transition-colors" />
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Row Details */}
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={4} className="px-6 py-0">
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600 mb-1">{buyer.email || "N/A"}</p>
                    <p className="text-sm text-gray-600">{buyer.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600">{buyer.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order ID & Date</h4>
                    <p className="text-sm text-gray-600">{buyer.orderId}</p>
                    <p className="text-sm text-gray-600">{formatDate(buyer.purchaseDate)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pb-6">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Order
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function RecentlyPurchased() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [isMobile, setIsMobile] = useState(false)

 
  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error,
  } = useGetAllTransactionsQuery();

  // Mock data for demonstration purposes
  // const transactionsResponse = { data: mockTransactions }
  // const isLoading = false
  // const isError = false
  // const error = null

  const buyers = useMemo(() => {
    if (!transactionsResponse?.data) {
      return []
    }
    return transactionsResponse.data.map((transaction) => ({
      id: transaction._id,
      name: transaction.user?.name || "Unknown User",
      orderId: transaction._id,
      productName: transaction.service?.name || "Unknown Service",
      amount: transaction.service?.price || 0,
      purchaseDate: transaction.timestamp,
      email: transaction.user?.email || "N/A",
      phone: "N/A", 
      paymentMethod: "Card",
      shippingAddress: {
        street: "Digital Service / Not Applicable",
        city: "N/A",
        state: "N/A",
        zipCode: "N/A",
        country: "N/A",
      },
      status: transaction.status,
    }))
  }, []) 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredBuyers = useMemo(() => {
    return buyers.filter(
      (buyer) =>
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.productName.toLowerCase().includes(searchTerm.toLowerCase()), 
    )
  }, [searchTerm, buyers])

  const toggleRow = (buyerId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(buyerId)) {
      newExpanded.delete(buyerId)
    } else {
      newExpanded.add(buyerId)
    }
    setExpandedRows(newExpanded)
  }

  const totalRevenue = filteredBuyers.reduce((sum, buyer) => sum + buyer.amount, 0)

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#1987BF] animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading Transactions...</h3>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      )
    }
    if (isError) {
      return (
        <div className="text-center py-12 text-red-600 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load Transactions</h3>
          <p className="text-sm">{error?.data?.message || "An unexpected error occurred."}</p>
        </div>
      )
    }

    if (filteredBuyers.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )
    }

    return isMobile ? (
      <div className="p-4">
        {filteredBuyers.map((buyer) => (
          <BuyerRow
            key={buyer.id}
            buyer={buyer}
            isExpanded={expandedRows.has(buyer.id)}
            onToggle={() => toggleRow(buyer.id)}
            isMobile={true}
          />
        ))}
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buyer & Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer) => (
              <BuyerRow
                key={buyer.id}
                buyer={buyer}
                isExpanded={expandedRows.has(buyer.id)}
                onToggle={() => toggleRow(buyer.id)}
                isMobile={false}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Purchases</h1>
          <p className="text-gray-600">Track your latest sales and customer information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1987BF]/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#1987BF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Buyers</p>
                  <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalRevenue / buyers.length || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-[#1987BF] focus:ring-[#1987BF]/20 rounded-xl"
                />
              </div>
              {/* <Button
                variant="outline"
                className="h-12 px-6 border-gray-200 hover:border-[#1987BF] hover:text-[#1987BF] rounded-xl bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Buyers List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className=" border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Recent Purchases ({filteredBuyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
