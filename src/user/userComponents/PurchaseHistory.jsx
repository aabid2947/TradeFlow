// src/components/PurchaseHistory.jsx

"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  User,
  Package,
  DollarSign,
  Eye,
  Download,
  AlertTriangle,
  Loader,
  Calendar,
  Bookmark, // Added icon for purchase details
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetMyTransactionsQuery } from "@/app/api/transactionApiSlice"

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
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "processing":
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "failed":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getAvatarBgColor = (name) => {
  const colors = [
    "from-blue-600 to-blue-800", "from-green-600 to-green-800", "from-purple-600 to-purple-800",
    "from-red-600 to-red-800", "from-yellow-600 to-yellow-800",
  ]
  if (!name) return colors[0]
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const BuyerRow = ({ buyer, isExpanded, onToggle, isMobile }) => {
  const avatarBg = getAvatarBgColor(buyer.name)

  const commonDetails = (
    <div className="p-4 bg-gray-50/80 border-t border-gray-200 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Purchase Details */}
        <div className="flex items-start gap-3 mx-4">
          <Bookmark className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Purchase Details</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {buyer.purchaseType}
            </p>
            {buyer.plan && (
              <p className="text-sm text-gray-600 capitalize">
                <span className="font-medium">Plan:</span> {buyer.plan}
              </p>
            )}
            {buyer.quantity && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Quantity:</span> {buyer.quantity}
              </p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex items-start gap-3 md:ml-28">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1 ">Payment Details</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Method:</span> {buyer.paymentMethod}
            </p>
             <p className="text-sm text-gray-600 break-all">
                <span className="font-medium">Order ID:</span> #{buyer.orderId.slice(-12)}
             </p>
          </div>
        </div>
      </div>

      {/* <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
      </div> */}
    </div>
  );

  if (isMobile) {
    return (
      <Card className="mb-4 overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div onClick={onToggle} className="p-4 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                  {buyer.name?.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{buyer.productName}</h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {buyer.purchaseType === 'Subscription' ? `${buyer.plan} Plan` : `Order #${buyer.orderId.slice(-6)}`}
                  </p>
                </div>
              </div>
              <div className="text-right pl-2">
                <div className="font-bold text-blue-600">{formatCurrency(buyer.amount)}</div>
                <Badge className={`mt-1 text-xs ${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(buyer.purchaseDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            {commonDetails}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <tr onClick={onToggle} className="group cursor-pointer hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100">
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-bold text-base shrink-0`}>
              {buyer.productName?.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{buyer.productName}</div>
              <div className="text-sm text-gray-500 capitalize">
                {buyer.purchaseType === 'Subscription' ? `${buyer.plan} Plan` : `Service Purchase`}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-800">{formatDate(buyer.purchaseDate)}</td>
        <td className="px-6 py-4">
          <div className="font-bold text-blue-700 text-base">{formatCurrency(buyer.amount)}</div>
        </td>
        <td className="px-6 py-4">
          <Badge className={`${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
        </td>
        <td className="px-6 py-4 text-center">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-white">
          <td colSpan={5} className="p-0">
            <div className="animate-in slide-in-from-top-2 duration-300">
              {commonDetails}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};


export default function PurchaseHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [isMobile, setIsMobile] = useState(false)

  

  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error,
  } = useGetMyTransactionsQuery();

  useEffect(()=>{
     window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });
  },[])


  const buyers = useMemo(() => {
    if (!transactionsResponse?.data) {
      return []
    }
    // Updated mapping logic to handle both services and subscriptions
    return transactionsResponse.data.map((transaction) => {
      const isSubscription = transaction.plan && transaction.category;
      return {
        id: transaction._id,
        name: transaction.user?.name || "Unknown User",
        orderId: transaction._id,
        productName: isSubscription ? transaction.category : transaction.service?.name || "Service",
        amount: transaction.amount || 0,
        purchaseType: isSubscription ? "Subscription" : "Service",
        plan: isSubscription ? transaction.plan : null,
        quantity: !isSubscription ? transaction.quantity : null,
        purchaseDate: transaction.createdAt,
        email: transaction.user?.email || "N/A",
        phone: transaction.user?.mobile || "N/A",
        paymentMethod: transaction.razorpay_payment_id ? "Razorpay" : "Card",
        status: transaction.status,
      };
    })
  }, [transactionsResponse]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredBuyers = useMemo(() => {
    return buyers.filter(
      (buyer) =>
        buyer.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (buyer.purchaseType === 'Subscription' && buyer.plan.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading Your History...</h3>
        </div>
      )
    }
    if (isError) {
      return (
        <div className="text-center py-12 text-red-600 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load History</h3>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchases Found</h3>
          <p className="text-gray-600">Your transaction history will appear here.</p>
        </div>
      )
    }

    return isMobile ? (
      <div className="p-2 sm:p-4">
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
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product / Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Purchase History</h1>
          <p className="text-gray-600">Track and manage all your subscriptions and service purchases.</p>
        </div>
        <Card className="mb-6 bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by product, category, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200/80">
          <CardHeader className="p-4 border-b border-gray-200/80">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Your Transactions ({filteredBuyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">{renderContent()}</CardContent>
        </div>
      </div>
    </div>
  )
}