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
import { Card, CardContent } from '../components/ui/card';
import { SiteHeader } from '../components/SiteHeader';
import { 
  useGetTradeDetailsQuery, 
  useAcceptTradeMutation,
  useConfirmPaymentMutation,
  useCompleteTradeMutation,
  useStartChatMutation
} from '../features/api/apiSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

const TradeDetailsPage = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useSelector(selectCurrentUser);
  
  const [isAccepting, setIsAccepting] = useState(false);
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

  const [acceptTrade] = useAcceptTradeMutation();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [completeTrade] = useCompleteTradeMutation();
  const [startChat] = useStartChatMutation();

  const trade = tradeData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-zinc-200 rounded-lg w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md shadow-zinc-300/50 p-8">
              <div className="h-4 bg-zinc-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/2 mb-6"></div>
              <div className="h-32 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trade) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-3">Trade Not Found</h2>
              <p className="text-zinc-600 leading-relaxed mb-6">
                The trade you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
              >
                Back to Dashboard
              </Button>
            </CardContent>
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
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-3">Access Denied</h2>
              <p className="text-zinc-600 leading-relaxed">You don't have permission to view this trade.</p>
            </CardContent>
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
        bgColor: 'bg-blue-500/10',
        description: 'Waiting for seller to accept the trade request'
      },
      accepted: {
        icon: CheckCircle,
        text: 'Trade Accepted',
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
        description: 'Seller has accepted, waiting for buyer to confirm payment'
      },
      paid: {
        icon: DollarSign,
        text: 'Payment Confirmed',
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
        description: 'Buyer has confirmed payment, waiting for seller to release tokens'
      },
      completed: {
        icon: CheckCircle,
        text: 'Trade Completed',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-500/10',
        description: 'Trade completed successfully'
      },
      cancelled: {
        icon: XCircle,
        text: 'Trade Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-500/10',
        description: 'This trade has been cancelled'
      },
      disputed: {
        icon: AlertTriangle,
        text: 'Under Dispute',
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
        description: 'This trade is under dispute resolution'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(trade.status);

  const handleAcceptTrade = async () => {
    if (!isSeller || trade.status !== 'pending') return;
    
    setIsAccepting(true);
    try {
      await acceptTrade(tradeId).unwrap();
      toast({
        title: "Trade Accepted",
        description: "You have accepted the trade. The buyer can now proceed with payment.",
        variant: "success"
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to accept trade",
        variant: "destructive"
      });
    }
    setIsAccepting(false);
  };

  const handleConfirmPayment = async () => {
    if (!isBuyer || trade.status !== 'accepted') return;
    
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

  const handleOpenChat = async () => {
    try {
      // Get the other participant's ID
      const otherParticipantId = isBuyer ? trade.sellerId._id : trade.buyerId._id;
      
      // Navigate to chat page with user ID as URL parameter
      navigate(`/chat?userId=${otherParticipantId}`);
      
      toast({
        title: "Chat Opened",
        description: "Chat opened successfully!",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open chat",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Trade Details</h1>
            <p className="text-xl text-muted-foreground">
              Trade ID: <span className="font-mono text-amber-600">{trade._id}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Card */}
              <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300", statusConfig.bgColor)}>
                      <statusConfig.icon className={cn("h-8 w-8", statusConfig.color)} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-zinc-900 mb-2">{statusConfig.text}</h2>
                      <p className="text-zinc-600 leading-relaxed">{statusConfig.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trade Information */}
              <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-zinc-900 mb-6">Trade Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-600 uppercase tracking-wide">Token Amount</p>
                      <p className="text-2xl font-bold text-amber-500">
                        {trade.funTokenAmount} FUN
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-600 uppercase tracking-wide">Payment Amount</p>
                      <p className="text-2xl font-bold text-amber-500">
                        {trade.funTokenPayment} FUN
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-600 uppercase tracking-wide">Price per Token</p>
                      <p className="text-xl font-semibold text-zinc-900">
                        {(trade.funTokenPayment / trade.funTokenAmount).toFixed(4)} FUN
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-600 uppercase tracking-wide">Created</p>
                      <p className="text-sm text-zinc-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-600" />
                        {formatDate(trade.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Cards */}
              {trade.status === 'accepted' && isBuyer && (
                <Card className="bg-white border border-blue-200 rounded-lg shadow-md shadow-blue-300/50 hover:shadow-lg hover:shadow-blue-400/60 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">
                          Confirm Your Payment
                        </h3>
                        <p className="text-blue-700 leading-relaxed mb-6">
                          Please confirm that you have completed the payment to the seller. 
                          Once confirmed, the seller will release your tokens.
                        </p>
                        <Button 
                          onClick={handleConfirmPayment}
                          disabled={isConfirming}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          {isConfirming ? "Confirming..." : "Confirm Payment Sent"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {trade.status === 'pending' && isSeller && (
                <Card className="bg-white border border-amber-200 rounded-lg shadow-md shadow-amber-300/50 hover:shadow-lg hover:shadow-amber-400/60 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
                        <CheckCircle className="h-8 w-8 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-amber-900 mb-3">
                          Accept Trade Request
                        </h3>
                        <p className="text-amber-700 leading-relaxed mb-6">
                          A buyer has initiated a trade with you. Please review the trade details 
                          and accept to allow the buyer to proceed with payment.
                        </p>
                        <div className="flex gap-4">
                          <Button 
                            onClick={handleAcceptTrade}
                            disabled={isAccepting}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
                          >
                            {isAccepting ? "Accepting..." : "Accept Trade"}
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-medium px-6 py-3 rounded-lg transition-all duration-300"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline Trade
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {trade.status === 'paid' && isSeller && (
                <Card className="bg-white border border-green-200 rounded-lg shadow-md shadow-green-300/50 hover:shadow-lg hover:shadow-green-400/60 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all duration-300">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-green-900 mb-3">
                            Approve Trade
                        </h3>
                        <p className="text-green-700 leading-relaxed mb-6">
                          The buyer has confirmed their payment. Please verify the payment 
                            and approve the trade to release the tokens to the buyer.
                        </p>
                        <div className="flex gap-4">
                          <Button 
                            onClick={handleCompleteTrade}
                            disabled={isCompleting}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                          >
                              {isCompleting ? "Approving..." : "Approve Trade"}
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-medium px-6 py-3 rounded-lg transition-all duration-300"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Raise Dispute
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Participants */}
              <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-6">Participants</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {trade.buyerId?.username || 'Unknown'}
                          {isBuyer && <span className="text-amber-600 ml-1">(You)</span>}
                        </p>
                        <p className="text-sm text-zinc-600">Buyer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {trade.sellerId?.username || 'Unknown'}
                          {isSeller && <span className="text-amber-600 ml-1">(You)</span>}
                        </p>
                        <p className="text-sm text-zinc-600">Seller</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication */}
              <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-6">Communication</h3>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenChat}
                    className="w-full border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 font-medium py-3 rounded-lg transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white border border-zinc-200 rounded-lg shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-6">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-zinc-900">Trade Initiated</p>
                        <p className="text-sm text-zinc-600">{formatDate(trade.createdAt)}</p>
                      </div>
                    </div>
                    {trade.paidAt && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-zinc-900">Payment Confirmed</p>
                          <p className="text-sm text-zinc-600">{formatDate(trade.paidAt)}</p>
                        </div>
                      </div>
                    )}
                    {trade.completedAt && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-zinc-900">Trade Completed</p>
                          <p className="text-sm text-zinc-600">{formatDate(trade.completedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsPage;