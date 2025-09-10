import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Clock, 
  DollarSign, 
  User, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { SiteHeader } from '../components/SiteHeader';
import { 
  useGetTradeDetailsQuery, 
  useConfirmPaymentMutation,
  useCompleteTradeMutation 
} from '../features/api/apiSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

const TradeDetailsPage = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useSelector(selectCurrentUser);
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { 
    data: tradeData, 
    isLoading, 
    error,
    refetch 
  } = useGetTradeDetailsQuery(tradeId, {
    refetchOnMountOrArgChange: true
  });

  const [confirmPayment] = useConfirmPaymentMutation();
  const [completeTrade] = useCompleteTradeMutation();

  const trade = tradeData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trade) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trade Not Found</h2>
            <p className="text-gray-600 mb-4">
              The trade you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const isBuyer = currentUser?._id === trade.buyerId?._id;
  const isSeller = currentUser?._id === trade.sellerId?._id;
  const isParticipant = isBuyer || isSeller;

  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view this trade.</p>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        text: 'Trade Initiated',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Waiting for buyer to confirm payment'
      },
      paid: {
        icon: DollarSign,
        text: 'Payment Confirmed',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Buyer has confirmed payment, waiting for seller to release tokens'
      },
      completed: {
        icon: CheckCircle,
        text: 'Trade Completed',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        description: 'Trade completed successfully'
      },
      cancelled: {
        icon: XCircle,
        text: 'Trade Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: 'This trade has been cancelled'
      },
      disputed: {
        icon: AlertTriangle,
        text: 'Under Dispute',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        description: 'This trade is under dispute resolution'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(trade.status);

  const handleConfirmPayment = async () => {
    if (!isBuyer || trade.status !== 'pending') return;
    
    setIsConfirming(true);
    try {
      await confirmPayment(tradeId).unwrap();
      toast({
        title: "Payment Confirmed",
        description: "You have confirmed the payment. The seller will now release the tokens.",
        variant: "success"
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to confirm payment",
        variant: "destructive"
      });
    }
    setIsConfirming(false);
  };

  const handleCompleteTrade = async () => {
    if (!isSeller || trade.status !== 'paid') return;
    
    setIsCompleting(true);
    try {
      await completeTrade(tradeId).unwrap();
      toast({
        title: "Trade Completed",
        description: "Trade completed successfully! Tokens have been transferred.",
        variant: "success"
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to complete trade",
        variant: "destructive"
      });
    }
    setIsCompleting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trade Details</h1>
          <p className="text-gray-600">Trade ID: {trade._id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-3 rounded-full", statusConfig.bgColor)}>
                  <statusConfig.icon className={cn("h-6 w-6", statusConfig.color)} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{statusConfig.text}</h2>
                  <p className="text-gray-600">{statusConfig.description}</p>
                </div>
              </div>
            </Card>

            {/* Trade Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Token Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.funTokenAmount} FUN Tokens
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.funTokenPayment} FUN Tokens
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price per Token</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {(trade.funTokenPayment / trade.funTokenAmount).toFixed(4)} FUN
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(trade.createdAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            {trade.status === 'pending' && isBuyer && (
              <Card className="p-6 border-blue-200 bg-blue-50">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Confirm Your Payment
                  </h3>
                  <p className="text-blue-700">
                    Please confirm that you have completed the payment to the seller. 
                    Once confirmed, the seller will release your tokens.
                  </p>
                </div>
                <Button 
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isConfirming ? "Confirming..." : "Confirm Payment Sent"}
                </Button>
              </Card>
            )}

            {trade.status === 'paid' && isSeller && (
              <Card className="p-6 border-green-200 bg-green-50">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Release Tokens
                  </h3>
                  <p className="text-green-700">
                    The buyer has confirmed their payment. Please verify the payment 
                    and release the tokens to complete this trade.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCompleteTrade}
                    disabled={isCompleting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCompleting ? "Releasing..." : "Release Tokens"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Raise Dispute
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {trade.buyerId?.username || 'Unknown'}
                      {isBuyer && " (You)"}
                    </p>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {trade.sellerId?.username || 'Unknown'}
                      {isSeller && " (You)"}
                    </p>
                    <p className="text-sm text-gray-600">Seller</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Communication */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Trade Initiated</p>
                    <p className="text-xs text-gray-600">{formatDate(trade.createdAt)}</p>
                  </div>
                </div>
                {trade.paidAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Confirmed</p>
                      <p className="text-xs text-gray-600">{formatDate(trade.paidAt)}</p>
                    </div>
                  </div>
                )}
                {trade.completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Trade Completed</p>
                      <p className="text-xs text-gray-600">{formatDate(trade.completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsPage;
