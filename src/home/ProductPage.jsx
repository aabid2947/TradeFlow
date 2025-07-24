import React, { useState } from "react";
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
    Download,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetServiceByIdQuery } from "@/app/api/serviceApiSlice";
import Header from "./homeComponents/Header";
import Footer from "./homeComponents/Footer";
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import { useNavigate } from "react-router-dom";

const staticImages = [PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage];

const ProductPage = ({ serviceId }) => {
    const currentServiceId = serviceId || window.location.pathname.split('/').pop();
    const navigate = useNavigate()
    const [selectedTab, setSelectedTab] = useState("overview");

    // Fetch service data from the API using the generated hook from the serviceApiSlice.
    const {
        data: serviceResponse,
        isLoading,
        isError,
        error
    } = useGetServiceByIdQuery(currentServiceId);

    // Static fallback data to ensure the page renders even if the API call fails or is in progress.
    const fallbackData = {
        title: "Service Verification",
        price: "₹299",
        originalPrice: "₹500",
        rating: 5.0,
        totalReviews: 1247,
        description: "Get your documents verified instantly with our secure and reliable verification service. Quick processing time and 100% accuracy guaranteed.",
        features: [
            "Instant Verification",
            "100% Secure Process",
            "Government Approved",
            "24/7 Support Available",
            "Digital Certificate",
        ],
        processingTime: "2-5 minutes",
        successRate: "99.9%",
    };

    // Helper function to calculate the final price after applying a discount.
    const calculateDiscountedPrice = (originalPrice, discount) => {
        if (!discount) return originalPrice;

        if (discount.type === 'percentage') {
            return originalPrice - (originalPrice * discount.value / 100);
        } else if (discount.type === 'fixed') {
            return Math.max(0, originalPrice - discount.value);
        }
        return originalPrice;
    };

    // Assign a random static image based on the service name's hash.
    const getServiceImage = (serviceName) => {
        if (!serviceName) return staticImages[0];
        const hash = serviceName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return staticImages[Math.abs(hash) % staticImages.length];
    };

    // Consolidate data from the API with fallbacks.
    let productData = fallbackData;
    if (serviceResponse?.data) {
        const service = serviceResponse.data;
        const discountedPrice = calculateDiscountedPrice(service.price, service.discount);
        const hasDiscount = service.discount && discountedPrice < service.price;

        productData = {
            title: service.name,
            price: `₹${hasDiscount ? discountedPrice.toFixed(0) : service.price}`,
            originalPrice: hasDiscount ? `₹${service.price}` : null,
            rating: 4.8, // Static for now, can be made dynamic later
            totalReviews: service.globalUsageCount || 100,
            description: service.description,
            features: [
                "Instant Verification",
                "100% Secure Process",
                "Government Approved",
                "24/7 Support Available",
                "Digital Certificate",
            ],
            processingTime: "2-5 minutes", // Static for now
            successRate: "99.9%", // Static for now
            image: getServiceImage(service.name),
            category: service.category,
            endpoint: service.endpoint,
            inputFields: service.inputFields || [],
            outputFields: service.outputFields || [],
        };
    }

    // Static reviews data for demonstration purposes.
    const reviewsData = [
        { id: 1, name: "Rajesh Kumar", rating: 5, comment: "Very quick service. Got my documents verified within 3 minutes. Highly recommended!", date: "2 days ago", verified: true },
        { id: 2, name: "Priya Sharma", rating: 4, comment: "Good service overall. The process was smooth and customer support was helpful.", date: "1 week ago", verified: true },
        { id: 3, name: "Amit Patel", rating: 5, comment: "Excellent service! Fast, reliable, and secure.", date: "2 weeks ago", verified: true },
    ];

    const renderStars = (rating) => (
        Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))
    );

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    // Loading state UI.
    if (isLoading) {
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
                        <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Go Back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Image Section */}
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative">
                        <div className="bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl p-8 shadow-2xl">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="bg-white rounded-lg p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                            <div className="text-sm text-gray-600">{productData.category || "Document"}</div>
                                            <div className="text-lg font-bold text-gray-800">Verification</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {productData.originalPrice && (
                            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                                {serviceResponse?.data?.discount?.type === 'percentage'
                                    ? `${serviceResponse.data.discount.value}% OFF`
                                    : `₹${serviceResponse.data.discount.value} OFF`
                                }
                            </div>
                        )}
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
                        <button onClick={() => navigate("/login")} className="w-full bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg">
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
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Lightbulb className="w-8 h-8 text-blue-600" /> About This Service</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">{productData.description}</p>
                                </motion.div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <motion.div variants={itemVariants} className="bg-blue-50 rounded-xl p-6 shadow-md space-y-4">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><Zap className="w-6 h-6 text-blue-600" /> How It Works</h4>
                                        <div className="space-y-4">
                                            {[
                                                { text: "Enter required information", icon: <FileText className="w-5 h-5 text-blue-600" /> },
                                                { text: "Complete secure payment", icon: <CreditCard className="w-5 h-5 text-blue-600" /> },
                                                { text: "Get instant verification", icon: <Clock className="w-5 h-5 text-blue-600" /> },
                                                { text: "Download digital certificate", icon: <Award className="w-5 h-5 text-blue-600" /> },
                                            ].map((step, index) => (
                                                <motion.div key={index} variants={itemVariants} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{index + 1}</div>
                                                    {step.icon}
                                                    <span className="text-gray-700">{step.text}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="bg-blue-50 rounded-xl p-6 shadow-md space-y-4">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><Lock className="w-6 h-6 text-blue-600" /> Security Features</h4>
                                        <ul className="space-y-3">
                                            {[
                                                "SSL encrypted data transmission",
                                                "Government API integration",
                                                "No data storage policy",
                                                "GDPR compliant process",
                                            ].map((feature, index) => (
                                                <motion.li key={index} variants={itemVariants} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                                {/* Dynamically render required input fields if they exist */}
                                {productData.inputFields && productData.inputFields.length > 0 && (
                                    <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6 shadow-md">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-blue-600" /> Required Information
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {productData.inputFields.map((field, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                    <h5 className="font-semibold text-gray-900 mb-1">{field.label}</h5>
                                                    <p className="text-sm text-gray-600">Type: {field.type}</p>
                                                    {field.placeholder && <p className="text-xs text-gray-500 mt-1">Example: {field.placeholder}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                        {selectedTab === "reviews" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">{renderStars(productData.rating)}</div>
                                        <span className="text-gray-600">({productData.totalReviews} reviews)</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {reviewsData.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{review.name.charAt(0)}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                        {review.verified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified Purchase</span>}
                                                        <span className="text-gray-500 text-sm">{review.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-3">{renderStars(review.rating)}</div>
                                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                                    Load More Reviews
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;