import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Filter,
  Search,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { SiteHeader } from '../components/SiteHeader';
import { useGetUserTradesQuery } from '../features/api/apiSlice';
import { cn } from '../lib/utils';

const TradesPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data: tradesData, 
    isLoading, 
    error 
  } = useGetUserTradesQuery({
    status: activeFilter === 'all' ? undefined : activeFilter,
    page: currentPage,
    limit: 10
  });

  const trades = tradesData?.data?.trades || [];
  const pagination = tradesData?.data?.pagination || {};

  const statusOptions = [
    { value: 'all', label: 'All Trades', count: pagination.total || 0 },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Payment Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'disputed', label: 'Disputed' }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        text: 'Pending',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      paid: {
        icon: DollarSign,
        text: 'Payment Confirmed',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      completed: {
        icon: CheckCircle,
        text: 'Completed',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100'
      },
      cancelled: {
        icon: XCircle,
        text: 'Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      },
      disputed: {
        icon: AlertTriangle,
        text: 'Disputed',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredTrades = trades.filter(trade => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      trade.buyerId?.username?.toLowerCase().includes(searchLower) ||
      trade.sellerId?.username?.toLowerCase().includes(searchLower) ||
      trade._id.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trades</h1>
          <p className="text-gray-600">Track and manage all your trading activities</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeFilter === option.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                )}
              >
                {option.label}
                {option.count !== undefined && (
                  <span className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    activeFilter === option.value
                      ? "bg-blue-500 text-blue-100"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Trades Grid */}
        {filteredTrades.length === 0 ? (
          <Card className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trades Found</h3>
            <p className="text-gray-600 mb-4">
              {activeFilter === 'all' 
                ? "You haven't made any trades yet. Start trading to see your activity here."
                : `No ${activeFilter} trades found. Try changing your filter or search term.`
              }
            </p>
            {activeFilter === 'all' && (
              <Button onClick={() => navigate('/market')}>
                Start Trading
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredTrades.map((trade) => {
              const statusConfig = getStatusConfig(trade.status);
              
              return (
                <Card 
                  key={trade._id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/trades/${trade._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium", statusConfig.bgColor)}>
                      <statusConfig.icon className={cn("h-3 w-3", statusConfig.color)} />
                      <span className={statusConfig.color}>{statusConfig.text}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(trade.createdAt)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {trade.funTokenAmount} FUN Tokens
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: {trade.funTokenPayment} FUN
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Buyer: {trade.buyerId?.username || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Seller: {trade.sellerId?.username || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {trade._id.slice(-8)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(trade.createdAt)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesPage;
