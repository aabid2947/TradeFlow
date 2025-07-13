"use client"

import { useState, useMemo } from "react"
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
  Clock,
  Eye,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



// Mock data
const mockBuyers = [
  {
    id: "1",
    name: "Sarah Johnson",
    orderId: "ORD-2025-001",
    productName: "PAN Card Verification - Premium",
    amount: 299,
    purchaseDate: new Date("2025-01-08T14:30:00"),
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    paymentMethod: "Visa ****4532",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    status: "completed",
  },
  {
    id: "2",
    name: "Michael Chen",
    orderId: "ORD-2025-002",
    productName: "Business Verification Suite",
    amount: 599,
    purchaseDate: new Date("2025-01-08T13:15:00"),
    email: "michael.chen@company.com",
    phone: "+1 (555) 987-6543",
    paymentMethod: "Mastercard ****8901",
    shippingAddress: {
      street: "456 Business Ave, Suite 200",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
    },
    status: "processing",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    orderId: "ORD-2025-003",
    productName: "Aadhaar Verification - Standard",
    amount: 199,
    purchaseDate: new Date("2025-01-08T12:45:00"),
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "789 Oak Street",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    status: "shipped",
  },
  {
    id: "4",
    name: "David Kumar",
    orderId: "ORD-2025-004",
    productName: "Document OCR Service",
    amount: 149,
    purchaseDate: new Date("2025-01-08T11:20:00"),
    email: "david.kumar@tech.com",
    phone: "+1 (555) 234-5678",
    paymentMethod: "American Express ****1234",
    shippingAddress: {
      street: "321 Tech Park Drive",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    status: "delivered",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    orderId: "ORD-2025-005",
    productName: "KYC Verification - Enterprise",
    amount: 899,
    purchaseDate: new Date("2025-01-08T10:30:00"),
    email: "lisa.thompson@enterprise.com",
    phone: "+1 (555) 345-6789",
    paymentMethod: "Visa ****9876",
    shippingAddress: {
      street: "654 Corporate Blvd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    status: "completed",
  },
  {
    id: "6",
    name: "James Wilson",
    orderId: "ORD-2025-006",
    productName: "Background Check Service",
    amount: 249,
    purchaseDate: new Date("2025-01-08T09:15:00"),
    email: "james.wilson@email.com",
    phone: "+1 (555) 567-8901",
    paymentMethod: "Mastercard ****5432",
    shippingAddress: {
      street: "987 Residential Lane",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    status: "processing",
  },
  {
    id: "7",
    name: "Amanda Foster",
    orderId: "ORD-2025-007",
    productName: "Biometric Verification",
    amount: 399,
    purchaseDate: new Date("2025-01-08T08:45:00"),
    email: "amanda.foster@biometric.com",
    phone: "+1 (555) 678-9012",
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "147 Innovation Street",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    status: "shipped",
  },
  {
    id: "8",
    name: "Robert Garcia",
    orderId: "ORD-2025-008",
    productName: "GST Verification Service",
    amount: 179,
    purchaseDate: new Date("2025-01-08T07:30:00"),
    email: "robert.garcia@business.com",
    phone: "+1 (555) 789-0123",
    paymentMethod: "Visa ****2468",
    shippingAddress: {
      street: "258 Commerce Drive",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      country: "USA",
    },
    status: "delivered",
  },
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "delivered":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const BuyerRow = ({
  buyer,
  isExpanded,
  onToggle,
  isMobile,
}) => {
  if (isMobile) {
    return (
      <Card className="mb-4 overflow-hidden border border-gray-200 hover:border-[#1987BF]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-0">
          <div onClick={onToggle} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {buyer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{buyer.name}</h3>
                  <p className="text-sm text-gray-500">{buyer.orderId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1987BF]">{formatCurrency(buyer.amount)}</div>
                <Badge className={`text-xs ${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span className="truncate">{buyer.productName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDate(buyer.purchaseDate)}</span>
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
                    <p className="text-sm text-gray-600">{buyer.email}</p>
                    <p className="text-sm text-gray-600">{buyer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Payment Method</h4>
                    <p className="text-sm text-gray-600">{buyer.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {buyer.shippingAddress.street}
                      <br />
                      {buyer.shippingAddress.city}, {buyer.shippingAddress.state} {buyer.shippingAddress.zipCode}
                      <br />
                      {buyer.shippingAddress.country}
                    </p>
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {buyer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{buyer.name}</div>
              <div className="text-sm text-gray-500">{buyer.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="font-mono text-sm text-gray-900">{buyer.orderId}</div>
        </td>
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{buyer.productName}</div>
        </td>
        <td className="px-6 py-4">
          <div className="font-bold text-[#1987BF]">{formatCurrency(buyer.amount)}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">{formatDate(buyer.purchaseDate)}</div>
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
          <td colSpan={7} className="px-6 py-0">
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600 mb-1">{buyer.email}</p>
                    <p className="text-sm text-gray-600">{buyer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600">{buyer.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1987BF] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {buyer.shippingAddress.street}
                      <br />
                      {buyer.shippingAddress.city}, {buyer.shippingAddress.state} {buyer.shippingAddress.zipCode}
                      <br />
                      {buyer.shippingAddress.country}
                    </p>
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

  // Check if mobile on mount and resize
  useState(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  })

  const filteredBuyers = useMemo(() => {
    return mockBuyers.filter(
      (buyer) =>
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

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

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Buyers</h1>
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
                  <p className="text-2xl font-bold text-gray-900">{filteredBuyers.length}</p>
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
                    {formatCurrency(totalRevenue / filteredBuyers.length || 0)}
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
                  placeholder="Search by name, order ID, product, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-[#1987BF] focus:ring-[#1987BF]/20 rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                className="h-12 px-6 border-gray-200 hover:border-[#1987BF] hover:text-[#1987BF] rounded-xl bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
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
          <CardContent className="p-0">
            {isMobile ? (
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buyer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
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
            )}

            {filteredBuyers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
