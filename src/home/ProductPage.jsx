import React, { useState, useEffect } from "react";
import {
    Star,
    Shield,
    Clock,
    CheckCircle,
    Users,
    Award,
    Lightbulb,
    Lock,
    Zap,
    FileText,
    CreditCard,
    Loader2,
    AlertCircle,
    Edit,
    Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { selectCurrentUser } from "@/features/auth/authSlice";
// API Hooks
import { useGetServiceByIdQuery } from "@/app/api/serviceApiSlice";
import { useGetReviewsByServiceQuery, useDeleteReviewMutation } from "@/app/api/reviewApiSlice";
import SubscriptionPurchaseCard from "../user/userComponents/SubscriptionPurchaseCard";
// Components
import Header from "./homeComponents/Header";
import Footer from "./homeComponents/Footer";
import ReviewModal from "./homeComponents/ReviewModal";

// Helper function to calculate the final price after applying a discount.
const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice;

    if (discount.type === 'percentage') {
        return originalPrice - (originalPrice * discount.value / 100);
    } else if (discount.type === 'fixed') {
        return Math.max(0, originalPrice - discount.value);
    }
    return originalPrice;
};


const ProductPage = ({ serviceId }) => {
    const currentServiceId = serviceId || window.location.pathname.split('/').pop();
    const navigate = useNavigate();

    // Global State
    const userInfo = useSelector(selectCurrentUser);

    // Local State
    const [selectedTab, setSelectedTab] = useState("overview");
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);

    // Data Fetching
    const {
        data: serviceResponse,
        isLoading: isLoadingService,
        isError,
        error
    } = useGetServiceByIdQuery(currentServiceId);

    const {
        data: reviewsResponse,
        isLoading: isLoadingReviews
    } = useGetReviewsByServiceQuery(currentServiceId);

    const [deleteReview, { isLoading: isDeletingReview }] = useDeleteReviewMutation();

    // Safely derive state from API response
    const service = serviceResponse?.data;
    const discountedPrice = calculateDiscountedPrice(service?.price, service?.discount);
    const hasDiscount = service?.discount && discountedPrice < service?.price;
    const reviews = reviewsResponse?.data || [];

    // --- UPDATED LOGIC FOR REVIEW ELIGIBILITY ---
    // A user can review if:
    // 1. They have used the *current* specific service.
    // OR
    // 2. They have used *any* service within the same subcategory as the current service.
    const hasUsedService = userInfo?.usedServices?.some(s =>
        s.service === currentServiceId || (service?.subcategory && s.subcategory === service.subcategory)
    ) || false;

    const userReview = userInfo ? reviews.find(r => r.user?._id === userInfo._id) : null;

    // This effect handles redirection AFTER a new purchase is made via the modal.
    const prevHasUsedService = React.useRef(hasUsedService);
    React.useEffect(() => {
        // This checks if the user's usage status has just changed to true
        if (!prevHasUsedService.current && hasUsedService && isPurchaseModalOpen) {
            toast.success("Purchase successful! Redirecting...");
            // Correctly navigate to the subcategory page that was purchased.
            navigate(`/user/service/${service?.subcategory}`);
            setPurchaseModalOpen(false);
        }
        prevHasUsedService.current = hasUsedService;
    }, [hasUsedService, isPurchaseModalOpen, navigate, service?.subcategory]);


    const productData = {
        _id: service?._id,
        title: service?.name || "Service Verification",
        price: `₹${hasDiscount ? discountedPrice.toFixed(0) : (service?.price || 0)}`,
        originalPrice: hasDiscount ? `₹${service.price}` : null,
        rating: 4.8,
        totalReviews: service?.globalUsageCount || 100,
        description: service?.description || "Get your documents verified instantly with our secure and reliable verification service.",
        features: service?.features || [
            "Instant Verification",
            "100% Secure Process",
            "Government Approved",
            "24/7 Support Available",
            "Digital Certificate",
        ],
        processingTime: service?.processingTime || "2-5 minutes",
        successRate: service?.successRate || "99.9%",
        category: service?.category || "Document",
        subcategory: service?.subcategory, // Ensure subcategory is available
        inputFields: service?.inputFields || [],
        usedBy: service?.usedBy || [],
        discount: service?.discount || null,
        image: service?.imageUrl
    };

    // Data for the purchase card modal, based on the service's subcategory.
    const planDataForPurchase = {
        name: service?.subcategory,
        monthly: {
            price: service?.price // Pass the base price to the card
        }
    };


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // --- Handlers ---
    const handleOpenReviewModal = (review = null) => {
        if (!userInfo) {
            toast.error("Please log in to leave a review.");
            navigate("/login");
            return;
        }
        setReviewToEdit(review);
        setReviewModalOpen(true);
    };

    const handleNavigateAction = () => {
        if (userInfo) {
            navigate('/user');
        } else {
            toast.error("Please log in to get started.");
            navigate('/login');
        }
    };

    const handlePurchaseClick = () => {
        if (userInfo) {
            const subcategory = service?.subcategory;
            if (!subcategory) {
                toast.error("This service is not available for purchase at the moment.");
                return;
            }

            // Check if the user already has an active subscription for this subcategory
            const hasActiveSubscription = userInfo.activeSubscriptions?.some(
                sub => sub.category === subcategory && new Date(sub.expiresAt) > new Date()
            );

            if (hasActiveSubscription) {
                // If they do, navigate them directly to the service execution page for that category
                toast.success(`Accessing your "${subcategory}" plan...`);
                navigate(`/user/service/${subcategory}`);
            } else {
                // Otherwise, open the purchase modal
                prevHasUsedService.current = hasUsedService; // Set the flag before opening modal
                setPurchaseModalOpen(true);
            }
        } else {
            toast.error("Please log in to purchase this service.");
            navigate(`/login?status=${ service?.subcategory}`);
        }
    };


    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete your review? This action cannot be undone.")) {
            try {
                await deleteReview(reviewId).unwrap();
                toast.success("Your review has been deleted.");
            } catch (err) {
                toast.error(err.data?.message || "Failed to delete the review.");
            }
        }
    };

    // Render Functions
    const renderStars = (rating) => (
        Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`w-4 h-4 ${index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))
    );

    if (isLoadingService) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Service Details...</h2>
                        <p className="text-gray-600">Please wait while we fetch the service information.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
                        <p className="text-gray-600 mb-6">{error?.data?.message || "The requested service could not be found."}</p>
                        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Go Back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-2 gap-12 mb-12">
                        {/* Product Image Section */}
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative">
                            <div className=" rounded-2xl py-8 flex items-center justify-center">
                                    {productData.image ? (
                                        <img
                                            src={productData.image}
                                            alt={productData.title}
                                            className="transform rounded-2xl shadow-2xl scale-100 hover:scale-110 transition-transform duration-300 ease-in-out"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                            <div className="text-sm text-gray-600">{productData.category}</div>
                                            <div className="text-lg font-bold text-gray-800">Verification</div>
                                        </div>
                                    )}

                            </div>
                        </motion.div>

                        {/* Product Details Section */}
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{productData.title}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">{renderStars(productData.rating)}</div>
                                    <span className="text-gray-600">({productData.totalReviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-4xl font-bold text-blue-600">{productData.price}</span>
                                    {productData.originalPrice && <span className="text-xl text-gray-500 line-through">{productData.originalPrice}</span>}
                                </div>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">{productData.description}</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{productData.processingTime}</div>
                                    <div className="text-sm text-gray-600">Processing Time</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{productData.successRate}</div>
                                    <div className="text-sm text-gray-600">Success Rate</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{productData.totalReviews}+</div>
                                    <div className="text-sm text-gray-600">Happy Customers</div>
                                </div>
                            </div>
                            <button onClick={handlePurchaseClick} className="w-full bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg">
                                Verify Now - {productData.price}
                            </button>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Key Features
                                </h3>
                                <ul className="space-y-3">
                                    {productData.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tabs Section for Overview and Reviews */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                {["overview", "reviews"].map((tab) => (
                                    <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-8 py-4 font-semibold capitalize transition-colors ${selectedTab === tab ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-8">
                            {selectedTab === "overview" && (
                                <div className="space-y-10">
                                    <motion.div className="space-y-4">
                                        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Lightbulb className="w-8 h-8 text-blue-600" /> About This Service</h3>
                                        <p className="text-gray-700 text-lg leading-relaxed">{productData.description}</p>
                                    </motion.div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <motion.div className="bg-blue-50 rounded-xl p-6 shadow-md space-y-4">
                                            <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><Zap className="w-6 h-6 text-blue-600" /> How It Works</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { text: "Enter required information", icon: <FileText className="w-5 h-5 text-blue-600" /> },
                                                    { text: "Complete secure payment", icon: <CreditCard className="w-5 h-5 text-blue-600" /> },
                                                    { text: "Get instant verification", icon: <Clock className="w-5 h-5 text-blue-600" /> },
                                                    { text: "Download digital certificate", icon: <Award className="w-5 h-5 text-blue-600" /> },
                                                ].map((step, index) => (
                                                    <motion.div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{index + 1}</div>
                                                        {step.icon}
                                                        <span className="text-gray-700">{step.text}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                        <motion.div className="bg-blue-50 rounded-xl p-6 shadow-md space-y-4">
                                            <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><Lock className="w-6 h-6 text-blue-600" /> Security Features</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "SSL encrypted data transmission",
                                                    "Government API integration",
                                                    "No data storage policy",
                                                    "GDPR compliant process",
                                                ].map((feature, index) => (
                                                    <motion.li key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </div>
                                    {productData.inputFields && productData.inputFields.length > 0 && (
                                        <motion.div className="bg-gray-50 rounded-xl p-6 shadow-md">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="w-6 h-6 text-blue-600" /> Required Information
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {productData.inputFields.map((field, index) => (
                                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h5 className="font-semibold text-gray-900 mb-1">{field.label}</h5>
                                                        {field.placeholder && <p className="text-xs text-gray-500 mt-1">Example: {field.placeholder}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {selectedTab === "reviews" && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>

                                    {/* Case 1: User is logged in, has used the service (or a service in the same subcategory), and has NOT reviewed yet */}
                                    {userInfo && hasUsedService && !userReview && (
                                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center shadow-sm">
                                            <h4 className="font-bold text-xl text-gray-800 mb-2">Share Your Experience</h4>
                                            <p className="text-gray-600 mb-4">Your feedback helps other customers make informed decisions.</p>
                                            <button
                                                onClick={() => handleOpenReviewModal(null)}
                                                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
                                            >
                                                Leave a Review
                                            </button>
                                        </div>
                                    )}

                                    {/* Case 2: User has NOT used the service or any service in the subcategory */}
                                    {!hasUsedService && (
                                        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center shadow-sm">
                                            <h4 className="font-bold text-xl text-gray-800 mb-2">Want to leave a review?</h4>
                                            <p className="text-gray-600 mb-4">You must use a service in this category before you can share your feedback.</p>
                                            <button
                                                onClick={handleNavigateAction}
                                                className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-black transition-colors"
                                            >
                                                {userInfo ? 'Go to Your Dashboard' : 'Login to Get Started'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Case 3: User has already left a review. Their review appears below with edit/delete options. */}

                                    {isLoadingReviews ? (
                                        <div className="flex justify-center items-center py-10">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        </div>
                                    ) : reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {reviews.map((review) => (
                                                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{review.user?.name?.charAt(0) || 'U'}</div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                                                <span className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>

                                                                {userInfo && review.user?._id === userInfo._id && (
                                                                    <div className="ml-auto flex items-center gap-4">
                                                                        <button onClick={() => handleOpenReviewModal(review)} title="Edit Review" className="text-gray-500 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                                                        <button onClick={() => handleDeleteReview(review._id)} disabled={isDeletingReview} title="Delete Review" className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mb-3">{renderStars(review.rating)}</div>
                                                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600 font-semibold text-lg">This service has no reviews yet.</p>
                                            <p className="text-gray-500 mt-1">Be the first one to share your experience!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </motion.div>
                </div>
                <Footer />
            </div>

            {isReviewModalOpen && (
                <ReviewModal
                    onClose={() => setReviewModalOpen(false)}
                    existingReview={reviewToEdit}
                    serviceId={currentServiceId}
                />
            )}

            {isPurchaseModalOpen && userInfo && (
                <SubscriptionPurchaseCard
                    planData={planDataForPurchase}
                    userInfo={userInfo}
                    onClose={() => setPurchaseModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProductPage;