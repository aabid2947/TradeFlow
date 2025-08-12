// RecentlyPurchased.jsx
"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  User,
  Package,
  IndianRupee ,
  Eye,
  Download,
  AlertTriangle,
  Loader,
  Tags,
  Calendar,
  
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetAllTransactionsQuery } from "@/app/api/transactionApiSlice"
import { generateInvoicePDF } from "./InvoiceGenerator"
import { UserDetailsCard } from "./UserDetailCard"
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
};

const formatDate = (date) => {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "failed":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
};

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
};

// UPDATE: BuyerRow now accepts an onUserClick handler
const BuyerRow = ({ buyer, isExpanded, onToggle, isMobile, onDownloadInvoice, onUserClick }) => {
  const avatarBg = getAvatarBgColor(buyer.name);
  const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  // NEW: Handler to open user details without toggling the row
  const handleNameClick = (e) => {
    e.stopPropagation();
    if (buyer.originalTransactionData?.user) {
      onUserClick(buyer.originalTransactionData.user);
    }
  };

  // Mobile View
  if (isMobile) {
    return (
      <Card className="mb-4 overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div onClick={onToggle} className="p-4 cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div    className="flex items-center gap-3">
                <div  onClick={handleNameClick}  className={`w-10 h-10 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {buyer.name?.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  {/* UPDATE: Name is now clickable */}
                  <h3
                    className="font-semibold text-gray-900 hover:text-blue-700 hover:underline cursor-pointer"
                    onClick={handleNameClick}
                  >
                    {buyer.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{buyer.productName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{formatCurrency(buyer.amount)}</div>
                <Badge className={`text-xs ${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
              </div>
               <button
    onClick={
      handleNameClick
    }
    className="p-1 hover:bg-gray-100 rounded-full"
    title="View user info"
  >
    <Eye className="w-5 h-5 text-gray-600" />
  </button>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">{isExpanded ? "Hide details" : "View details"}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          {/* Expanded Details - Mobile */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Information</h4>
                    <p className="text-sm text-gray-600">{buyer.email || "N/A"}</p>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <IndianRupee  className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Pricing Details</h4>
                     <p className="text-sm text-gray-600">Original: {formatCurrency(buyer.originalAmount)}</p>
                    {buyer.discountApplied > 0 && <p className="text-sm text-gray-600">Discount: -{formatCurrency(buyer.discountApplied)}</p>}
                    {buyer.couponCode && <p className="text-sm text-gray-600">Coupon: <Badge variant="secondary">{buyer.couponCode}</Badge></p>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Order Details</h4>
                    <p className="text-sm text-gray-600 break-all">ID: {buyer.orderId}</p>
                    <p className="text-sm text-gray-600">Plan: <Badge variant="outline">{toTitleCase(buyer.plan)}</Badge></p>
                    <p className="text-sm text-gray-600">Date: {formatDate(buyer.purchaseDate)}</p>
                    <p className="text-sm text-gray-600">Payment via: {buyer.paymentMethod || "N/A"}</p>
                  </div>
                </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadInvoice(buyer.originalTransactionData);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop View
  return (
    <>
      <tr onClick={onToggle} className="group cursor-pointer hover:bg-blue-50/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-b border-gray-100">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div   onClick={handleNameClick}   className={`w-10 h-10 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
              {buyer.name?.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              {/* UPDATE: Name is now clickable */}
              <div
                className="font-semibold text-gray-900 hover:text-blue-700 hover:underline cursor-pointer"
                onClick={handleNameClick}
              >
                {buyer.name || "N/A"}
              </div>
              <div className="font-medium text-gray-600">{buyer.productName}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge variant="outline" className="capitalize">{buyer.plan}</Badge>
        </td>
        <td className="px-6 py-4">
          <div className="font-bold text-blue-600">{formatCurrency(buyer.amount)}</div>
        </td>
        <td className="px-6 py-4">
          <Badge className={`${getStatusColor(buyer.status)}`}>{buyer.status}</Badge>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />}
          </div>
        </td>
        <td className="px-6 py-4 text-center">
  <button
    onClick={
      handleNameClick}
    className="p-1 hover:bg-gray-100 rounded-full"
    title="View user info"
  >
    <Eye className="w-5 h-5 text-gray-600" />
  </button>
</td>
      </tr>

      {/* Expanded Row Details - Desktop */}
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-6 py-0">
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">{buyer.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                    <p className="text-sm text-gray-600 break-all">ID: {buyer.orderId}</p>
                    <p className="text-sm text-gray-600">Date: {formatDate(buyer.purchaseDate)}</p>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <IndianRupee  className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Financials</h4>
                    <p className="text-sm text-gray-600">Original: {formatCurrency(buyer.originalAmount)}</p>
                    {buyer.discountApplied > 0 && <p className="text-sm text-gray-600">Discount: -{formatCurrency(buyer.discountApplied)}</p>}
                    <p className="text-sm text-gray-600 font-semibold">Final: {formatCurrency(buyer.amount)}</p>
                  </div>
                  
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                    <p className="text-sm text-gray-600">{buyer.paymentMethod || "N/A"}</p>
                    {buyer.couponCode && <p className="text-sm text-gray-600 mt-1">Coupon: <Badge variant="secondary">{buyer.couponCode}</Badge></p>}
                  </div>
                </div>
              </div>
              {/* <div className="flex gap-2 pb-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadInvoice(buyer.originalTransactionData);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div> */}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};


export default function RecentlyPurchased() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  // NEW: State for UserDetailsCard
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);

  const { data: transactionsResponse, isLoading, isError, error } = useGetAllTransactionsQuery();

  const buyers = useMemo(() => {
    if (!transactionsResponse?.data) return [];
    
    const toTitleCase = (str) => {
      if (!str) return '';
      return str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    return transactionsResponse.data
      .slice()
      .filter(transaction => transaction.status === 'completed') 
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((transaction) => ({
        id: transaction._id,
        name: transaction.user?.name || "Unknown User",
        orderId: transaction._id,
        productName: toTitleCase(transaction.category) || "N/A",
        plan: transaction.plan || "N/A",
        amount: transaction.amount,
        originalAmount: transaction.originalAmount,
        discountApplied: transaction.discountApplied || 0,
        couponCode: transaction.couponCode,
        purchaseDate: transaction.createdAt,
        email: transaction.user?.email || "N/A",
        paymentMethod: transaction.razorpay_payment_id ? "Razorpay" : "Free/Promo",
        status: transaction.status,
        originalTransactionData: transaction,
      }));
  }, [transactionsResponse]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredBuyers = useMemo(() => {
    if (!buyers) return [];
    return buyers.filter(
      (buyer) =>
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, buyers]);

  const toggleRow = (buyerId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(buyerId)) {
      newExpanded.delete(buyerId);
    } else {
      newExpanded.add(buyerId);
    }
    setExpandedRows(newExpanded);
  };
  
  // NEW: Handlers to open/close the user details card
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserCardOpen(true);
  };

  const handleCloseUserCard = () => {
    setIsUserCardOpen(false);
    setTimeout(() => setSelectedUser(null), 300); // Allow for outro animation
  };

  const handleDownloadInvoice = (transaction) => {
    generateInvoicePDF(transaction);
  };

  const totalRevenue = useMemo(() => {
      return buyers.reduce((sum, buyer) => sum + (buyer.amount || 0), 0);
  }, [buyers]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading Transactions...</h3>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center py-12 text-red-600 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load Transactions</h3>
          <p className="text-sm">{error?.data?.message || "An unexpected error occurred."}</p>
        </div>
      );
    }
    if (filteredBuyers.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Buyers Found</h3>
          <p className="text-gray-600">{searchTerm ? "Try adjusting your search terms." : "No transactions have been recorded yet."}</p>
        </div>
      );
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
            onDownloadInvoice={handleDownloadInvoice}
            onUserClick={handleUserClick} // <-- Pass handler
          />
        ))}
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buyer & Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount Paid</th>
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
                onDownloadInvoice={handleDownloadInvoice}
                onUserClick={handleUserClick} // <-- Pass handler
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50  p-4 md:p-6">
      {/* NEW: Render UserDetailsCard */}
      <UserDetailsCard 
        user={selectedUser} 
        isOpen={isUserCardOpen}
        onClose={handleCloseUserCard}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Purchases</h1>
          <p className="text-gray-600">Track your latest sales and customer information.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <IndianRupee  className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Buyers</p>
                        <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Avg. Order Value</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(buyers.length > 0 ? totalRevenue / buyers.length : 0)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, product, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm p-2 md:p-4 border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Transactions ({filteredBuyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}