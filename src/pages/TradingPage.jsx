import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Filter, TrendingUp, TrendingDown, User, CreditCard, Smartphone, Building2, Star, Shield, Activity, Plus, Loader2, ChevronRight, Eye, MessageCircle } from 'lucide-react';
import { useGetActiveListingsQuery } from '../features/api/apiSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {SiteHeader} from '../components/SiteHeader';
import Footer from '../components/Footer';
import BuyListingModal from '../components/BuyListingModal';

const PaymentMethodIcon = ({ method }) => {
    const iconMap = {
        'Bank Transfer': <Building2 className="w-4 h-4 text-green-600" />,
        'UPI': <Smartphone className="w-4 h-4 text-violet-600" />,
        phonepe: <Smartphone className="w-4 h-4 text-violet-600" />,
        googlepay: <Smartphone className="w-4 h-4 text-cyan-600" />,
        paytm: <Smartphone className="w-4 h-4 text-emerald-600" />,
        bank: <Building2 className="w-4 h-4 text-green-600" />
    };

    return iconMap[method] || <CreditCard className="w-4 h-4 text-zinc-500" />;
};

const TradingPage = () => {
    const [activeTab, setActiveTab] = useState('buy');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [priceFilter, setPriceFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [hoveredOrder, setHoveredOrder] = useState(null);
    const [hoveredPayment, setHoveredPayment] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;

    // Get authentication state
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Fetch real listings data
    const { data: listingsData, isLoading, error, refetch } = useGetActiveListingsQuery();

    const listings = listingsData?.data || [];

    const currentData = listings;

    const filteredData = useMemo(() => {
        return currentData.filter(listing => {
            const matchesSearch = listing.sellerId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const matchesPrice = !priceFilter || listing.priceInFunToken?.toString().includes(priceFilter);
            const matchesAmount = !amountFilter || listing.funTokenAmount?.toString().includes(amountFilter);
            return matchesSearch && matchesPrice && matchesAmount;
        });
    }, [currentData, searchTerm, priceFilter, amountFilter]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const TabButton = ({ tab, label, icon }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
            }}
            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${activeTab === tab
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-700'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }`}
        >
            {icon}
            <span className="hidden xs:inline">{label}</span>
        </button>
    );

    // Handle chat navigation
    const handleChatWithSeller = (sellerId) => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }
        // Navigate to chat with seller ID
        navigate(`/chat?userId=${sellerId}`);
    };

    const OrderRow = ({ listing }) => (
        <div
            className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-300/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            onMouseEnter={() => setHoveredOrder(listing._id)}
            onMouseLeave={() => setHoveredOrder(null)}
        >
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-4">
                {/* User Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Star className="w-2 h-2 text-white fill-current" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="font-semibold text-zinc-900 text-sm">
                                <button
                                    onClick={() => handleChatWithSeller(listing.sellerId?._id)}
                                    className="flex items-center gap-2 hover:text-green-600 transition-colors group/seller"
                                    title="Chat with seller"
                                >
                                    <span className="truncate max-w-[120px]">
                                        {listing.sellerId?.username || 'Anonymous Seller'}
                                    </span>
                                    <MessageCircle className="w-3 h-3 opacity-0 group-hover/seller:opacity-100 transition-opacity flex-shrink-0" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                    <span className="text-amber-600 font-medium">4.8</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                                    <Shield className="w-2 h-2 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Price - Mobile */}
                    <div className="text-right">
                        <div className="text-lg font-bold text-zinc-900">
                            ₹{listing.priceInFunToken}
                        </div>
                        <div className="text-xs text-zinc-600">
                            per FUN
                        </div>
                    </div>
                </div>

                {/* Amount & Payment Methods */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="font-semibold text-zinc-900 text-sm">
                            {listing.remainingTokens?.toLocaleString() || listing.funTokenAmount.toLocaleString()} FUN
                        </div>
                        <div className="text-xs text-zinc-600">
                            {listing.minLimit}-{Math.min(listing.maxLimit, listing.remainingTokens || listing.funTokenAmount)} FUN available
                        </div>
                    </div>
                    
                    {/* Payment Methods - Mobile */}
                    <div className="flex items-center gap-1">
                        {listing.paymentMethods?.slice(0, 3).map((method, idx) => (
                            <div
                                key={idx}
                                className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-all duration-200"
                                title={method}
                            >
                                <PaymentMethodIcon method={method} />
                            </div>
                        ))}
                        {listing.paymentMethods?.length > 3 && (
                            <div className="text-xs text-zinc-500 ml-1">
                                +{listing.paymentMethods.length - 3}
                            </div>
                        )}
                    </div>
                </div>

                {/* Trade Button - Mobile */}
                <BuyListingModal 
                    listing={listing}
                    trigger={
                        <button
                            className="w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-green-700/40 flex items-center justify-center gap-2 text-sm"
                        >
                            Buy FUN
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    }
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between gap-4 lg:gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                    </div>
                    <div className="space-y-1 min-w-0">
                        <div className="font-semibold text-zinc-900 group-hover:text-zinc-900 transition-colors">
                            <button
                                onClick={() => handleChatWithSeller(listing.sellerId?._id)}
                                className="flex items-center gap-2 hover:text-green-600 transition-colors group/seller"
                                title="Chat with seller"
                            >
                                <span className="truncate">
                                    {listing.sellerId?.username || 'Anonymous Seller'}
                                </span>
                                <MessageCircle className="w-4 h-4 opacity-0 group-hover/seller:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-zinc-600 group-hover:text-zinc-700 transition-colors">
                                Active Seller
                            </span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                <span className="text-amber-600 font-medium">4.8</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                                <Shield className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-zinc-900 group-hover:scale-105 transition-transform origin-right">
                        ₹{listing.priceInFunToken}
                    </div>
                    <div className="text-sm text-zinc-600 group-hover:text-zinc-700 transition-colors">
                        Price per FUN Token
                    </div>
                </div>

                {/* Amount & Limit */}
                <div className="text-right space-y-1 flex-shrink-0">
                    <div className="font-semibold text-zinc-900 group-hover:text-zinc-900 transition-colors">
                        {listing.remainingTokens?.toLocaleString() || listing.funTokenAmount.toLocaleString()} FUN
                    </div>
                    <div className="text-sm text-zinc-600 group-hover:text-zinc-700 transition-colors">
                        {listing.minLimit}-{Math.min(listing.maxLimit, listing.remainingTokens || listing.funTokenAmount)} FUN available
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {listing.paymentMethods?.map((method, idx) => (
                        <div
                            key={idx}
                            className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all duration-200 group/payment"
                            title={method}
                            onMouseEnter={() => setHoveredPayment(`${listing._id}-${idx}`)}
                            onMouseLeave={() => setHoveredPayment(null)}
                        >
                            <PaymentMethodIcon method={method} />
                        </div>
                    ))}
                </div>

                {/* Trade Button */}
                <BuyListingModal 
                    listing={listing}
                    trigger={
                        <button
                            className="px-6 lg:px-8 py-3 rounded-xl font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-green-700/40 hover:scale-105 flex items-center gap-2 flex-shrink-0"
                        >
                            <span className="hidden lg:inline">Buy FUN</span>
                            <span className="lg:hidden">Buy</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    }
                />
            </div>
        </div>
    );

    const PaginationButton = ({ page, isActive, onClick, disabled = false, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                    : disabled
                        ? 'text-zinc-400 cursor-not-allowed'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
        >
            {children || page}
        </button>
    );

    return (
        <>
            <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
                <SiteHeader />
                <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                    {/* Create Listing Button for Sellers */}
                    {isAuthenticated && (
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <Link
                                to="/create-listing"
                                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-700/40 hover:scale-105 text-sm sm:text-base"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden xs:inline">Create New Listing</span>
                                <span className="xs:hidden">Create Listing</span>
                            </Link>
                        </div>
                    )}

                    {/* Enhanced Filters */}
                    <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-md shadow-zinc-300/50 p-4 sm:p-6 mb-6 sm:mb-8 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 transition-all duration-300">
                        {/* Mobile Filter Toggle */}
                        <div className="sm:hidden mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-between w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all duration-300 border border-zinc-200 hover:border-zinc-300"
                            >
                                <span className="text-zinc-700 font-medium">Filters</span>
                                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
                            <div className="relative group">
                                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-zinc-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Filter by price..."
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Filter by amount..."
                                    value={amountFilter}
                                    onChange={(e) => setAmountFilter(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                                />
                            </div>

                            <button className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all duration-300 border border-zinc-200 hover:border-zinc-300 group hover:shadow-md text-sm sm:text-base">
                                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                                <span className="text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium">Advanced</span>
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Table Header - Desktop Only */}
                    <div className="hidden sm:block bg-white border border-zinc-200 rounded-t-2xl shadow-md p-6 border-b-0">
                        <div className="grid grid-cols-5 gap-4 lg:gap-6 text-sm font-bold text-zinc-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Advertiser
                            </div>
                            <div className="text-right flex items-center justify-end gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Price
                            </div>
                            <div className="text-right">Limit/Quantity</div>
                            <div className="text-center">Payment Method</div>
                            <div className="text-right">Trade</div>
                        </div>
                    </div>

                    {/* Enhanced Orders List */}
                    <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-b-2xl shadow-md sm:border-t-0">
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12 sm:py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 animate-spin" />
                                        <p className="text-zinc-600 text-sm sm:text-base">Loading listings...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 sm:py-20">
                                    <div className="text-lg sm:text-xl font-semibold mb-3 text-red-600">Error loading listings</div>
                                    <div className="text-sm text-zinc-600 mb-4">
                                        {error.data?.message || 'Failed to load listings'}
                                    </div>
                                    <button
                                        onClick={() => refetch()}
                                        className="px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((listing) => (
                                    <OrderRow key={listing._id} listing={listing} />
                                ))
                            ) : (
                                <div className="text-center py-12 sm:py-20 text-zinc-600">
                                    <div className="text-lg sm:text-xl font-semibold mb-3 text-zinc-900">No listings found</div>
                                    <div className="text-sm mb-6">
                                        {searchTerm || priceFilter || amountFilter
                                            ? 'Try adjusting your search filters'
                                            : 'Be the first to create a listing!'
                                        }
                                    </div>
                                    {isAuthenticated && user?.role === 'seller' && !searchTerm && !priceFilter && !amountFilter && (
                                        <Link
                                            to="/create-listing"
                                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 text-sm sm:text-base"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create First Listing
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-10 overflow-x-auto pb-2">
                            <PaginationButton
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <span className="hidden sm:inline">Previous</span>
                                <span className="sm:hidden">Prev</span>
                            </PaginationButton>

                            {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                                let pageNum;
                                const maxPages = window.innerWidth < 640 ? 3 : 5;
                                if (totalPages <= maxPages) {
                                    pageNum = i + 1;
                                } else if (currentPage <= Math.floor(maxPages/2) + 1) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
                                    pageNum = totalPages - maxPages + 1 + i;
                                } else {
                                    pageNum = currentPage - Math.floor(maxPages/2) + i;
                                }

                                return (
                                    <PaginationButton
                                        key={pageNum}
                                        page={pageNum}
                                        isActive={pageNum === currentPage}
                                        onClick={() => setCurrentPage(pageNum)}
                                    />
                                );
                            })}

                            <PaginationButton
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <span className="sm:hidden">Next</span>
                            </PaginationButton>
                        </div>
                    )}

                    {/* Enhanced Stats Footer */}
                    <div className="text-center mt-6 sm:mt-10 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-zinc-200 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 transition-all duration-300">
                        <div className="text-sm text-zinc-600">
                            Showing <span className="text-zinc-900 font-semibold">{startIndex + 1}</span> to{' '}
                            <span className="text-zinc-900 font-semibold">
                                {Math.min(startIndex + itemsPerPage, filteredData.length)}
                            </span> of{' '}
                            <span className="text-zinc-900 font-semibold">{filteredData.length}</span> orders
                        </div>
                        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 text-xs text-zinc-500 flex-wrap">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Verified Traders</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                <span>Real-time Prices</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                                <span>Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default TradingPage;