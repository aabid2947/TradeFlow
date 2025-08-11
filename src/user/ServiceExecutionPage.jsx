// src/pages/user/ServiceExecutionPage.jsx

import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Loader2, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import DashboardHeader from "./userComponents/DashboardHeader";
import SidebarComponent from "./userComponents/SidebarComponent";

// Custom Notification Component
const CustomNotification = ({ notification, onClose }) => {
    if (!notification) return null;

    const isError = notification.type === 'error';
    
    return (
        <div className="fixed top-20 right-4 z-[9999] animate-in slide-in-from-right-5 fade-in-0 duration-300">
            <div className={`
                max-w-md p-4 rounded-lg shadow-lg border-l-4 ${
                isError 
                    ? 'bg-red-50 border-red-500 text-red-800' 
                    : 'bg-green-50 border-green-500 text-green-800'
                }
            `}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {isError ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className={`
                                rounded-md p-1 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isError 
                                    ? 'text-red-500 hover:bg-red-100 focus:ring-red-500' 
                                    : 'text-green-500 hover:bg-green-100 focus:ring-green-500'
                                }
                            `}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Custom Button Component
const CustomButton = ({ children, onClick, disabled, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
                ${disabled 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 hover:shadow-lg'
                }
                ${className}
            `}
        >
            {children}
        </button>
    );
};

// Custom Input Component
const CustomInput = ({ id, name, type, placeholder, onChange, required, className = "" }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            className={`
                w-full px-3 py-2.5 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                transition-all duration-200 placeholder-gray-400
                ${className}
            `}
        />
    );
};

// Custom Label Component
const CustomLabel = ({ htmlFor, children, className = "" }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
        >
            {children}
        </label>
    );
};

// Custom Card Component
const CustomCard = ({ children, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

const CustomCardHeader = ({ children }) => {
    return (
        <div className="px-6 py-4 border-b border-gray-100">
            {children}
        </div>
    );
};

const CustomCardContent = ({ children }) => {
    return (
        <div className="px-6 py-4">
            {children}
        </div>
    );
};

const DynamicServiceForm = ({ service, onVerify, isVerifying }) => {
    const [formData, setFormData] = useState({});
    const [consentChecked, setConsentChecked] = useState(false);
    
    const isFormFilled = service ? 
        service.inputFields.every(field => !!formData[field.name]) && consentChecked : false;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormFilled) {
            onVerify({ ...formData });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <CustomCard>
                <CustomCardHeader>
                    <h2 className="text-xl font-semibold text-gray-800">{service.name}</h2>
                    {service.description && (
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    )}
                </CustomCardHeader>
                
                <CustomCardContent>
                    <div className="space-y-4">
                        {service.inputFields.map(({ name, type, label, placeholder }) => (
                            <div key={name} className="space-y-1">
                                <CustomLabel htmlFor={name}>
                                    {label || toTitleCase(name)} <span className="text-red-500">*</span>
                                </CustomLabel>
                                <CustomInput
                                    id={name}
                                    name={name}
                                    type={type}
                                    placeholder={placeholder || `Enter ${toTitleCase(name)}`}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        ))}
                        
                        {/* Consent Checkbox */}
                        <div className="flex items-start space-x-3 pt-3 pb-2">
                            <input
                                type="checkbox"
                                id="consent"
                                name="consent"
                                onChange={handleConsentChange}
                                className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                                I agree that this data is shared with the informed consent of owner/user for the purpose of verification and processing.
                            </label>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="pt-4 text-center">
                            <CustomButton
                                type="submit"
                                disabled={isVerifying || !isFormFilled}
                                  className="flex justify-center items-center text-center"
                            >
                                {isVerifying && <Loader2 className="w-4 h-4  text-center animate-spin mr-2" />}
                                {isVerifying ? "Processing..." : "Submit Verification"}
                            </CustomButton>
                        </div>
                    </div>
                </CustomCardContent>
            </CustomCard>
        </form>
    );
};

// **FIXED** Helper function to correctly check if verification was successful
const isVerificationSuccessful = (result) => {
    // A result is not successful if it's falsy or has no data property.
    if (!result || !result.data) {
        return false;
    }

    // The actual API response is nested in the `data` property.
    const apiData = result.data;

    // Define known error codes from the backend API (Gridline).
    const errorCodes = ['1004', '1001', '1002', '1003', '1005', '1006', '404', '400'];

    // If the response contains a known error code, it's not successful.
    if (apiData.code && errorCodes.includes(String(apiData.code))) {
        return false;
    }

    // If the response status is explicitly 'INVALID', it's not successful.
    if (apiData.status === 'INVALID') {
        return false;
    }

    // A top-level `success: true` flag in the wrapper is a strong success indicator.
    if (result.success === true) {
        return true;
    }

    // A message containing "verified successfully" is also a reliable success indicator.
    if (apiData.message && apiData.message.toLowerCase().includes('verified successfully')) {
        return true;
    }

    // Other explicit success statuses from the API.
    if (apiData.status === 'VALID' || apiData.status === 'ACTIVE' || apiData.verified === true || apiData.account_exists === true) {
        return true;
    }

    // A success code like '1000' is a positive indicator.
    if (String(apiData.code) === '1000') {
      return true;
    }

    // Default to false if no clear success indicators are found.
    return false;
};


export default function ServiceExecutionPage() {
    const { serviceKey } = useParams();
    const navigate = useNavigate();
    
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [verificationResult, setVerificationResult] = useState(null);
    const [verificationError, setVerificationError] = useState(null);
    const [inputData, setInputData] = useState(null);
    const [notification, setNotification] = useState(null);

    const { data: servicesResponse } = useGetServicesQuery();
    const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

    const service = useMemo(() => servicesResponse?.data?.find(s => s.service_key === serviceKey), [servicesResponse, serviceKey]);

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };
    
    // **FIXED** Handler to correctly process success and error states
    const handleExecuteVerification = async (payload) => {
        setInputData(payload);
        setVerificationResult(null);
        setVerificationError(null);
        
        try {
            const result = await executeService({ serviceKey: service.service_key, payload }).unwrap();
            console.log('API Response:', result); // For debugging
            
            // Use the improved function to check for success
            if (isVerificationSuccessful(result)) {
                // On success, set the result to trigger the UserDetailsCard success view.
                setVerificationResult(result);
            } else {
                // On failure, construct the error object.
                const data = result.data || {};
                
                // Use the exact message from the API if it exists, otherwise provide a fallback.
                const errorMessage = data.message || "Verification failed. The details could not be found or are invalid.";
                
                // Show the error notification with the exact API message.
                showNotification(errorMessage, 'error');

                // Set the error state to render the error view in UserDetailsCard.
                setVerificationError({ 
                    message: errorMessage, 
                    code: String(data.code || 'UNKNOWN'),
                    details: data 
                });
            }
            
        } catch (err) {
            console.error('Service execution error:', err); // For debugging
            
            // Handle critical network errors or exceptions from `unwrap()`.
            const errorMessage = err.data?.message || "An unexpected error occurred. Please try again.";
            showNotification(errorMessage, 'error');
            setVerificationError(err.data || { message: "Service execution failed." });
        }
    };
    
    const handleGoBackToCategory = () => {
        navigate('/user', { 
          state: { 
            view: 'services', 
            category: service.category 
          },
          replace: true 
        });
    };

    const handleNavigate = (view) => {
        navigate('/user', { state: { view } });
    };
    
    const handleCategorySelect = (category) => {
        navigate('/user', {
            state: {
                view: 'services',
                category: category
            }
        });
    };

    if (!service) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading service...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Custom Notification */}
            <CustomNotification 
                notification={notification} 
                onClose={hideNotification} 
            />
            
            <SidebarComponent
                isOpen={sidebarOpen}
                activeView="services"
                onNavigate={handleNavigate}
                activeCategory={service?.category}
                onCategorySelect={handleCategorySelect}
            />
            <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16">
                    <div className="max-w-6xl mx-auto">
                        {/* Breadcrumb Navigation */}
                        <div className="mb-6">
                            <nav className="flex items-center text-sm text-gray-500 space-x-1">
                                <button 
                                    onClick={() => handleNavigate('dashboard')}
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    Dashboard
                                </button>
                                <ChevronRight className="h-4 w-4" />
                                <button 
                                    onClick={handleGoBackToCategory}
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    {toTitleCase(service.category)}
                                </button>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-800 font-medium">{service.name}</span>
                            </nav>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Form Section */}
                            <div className="space-y-6">
                                <DynamicServiceForm 
                                    service={service} 
                                    onVerify={handleExecuteVerification} 
                                    isVerifying={isVerifying} 
                                />
                            </div>
                            
                            {/* Results Section */}
                            <div className="space-y-6">
                                {/* Show results when there's verification data or error */}
                                {(verificationResult || verificationError) && (
                                    <UserDetailsCard 
                                        service={service}
                                        result={verificationResult} 
                                        error={verificationError} 
                                        inputData={inputData}
                                        serviceName={service?.name}
                                        isSubscribed={true}
                                    />
                                )}
                                
                                {/* Show default service info when no verification has been performed */}
                                {!verificationResult && !verificationError && (
                                    <CustomCard>
                                        <CustomCardHeader>
                                            <h3 className="text-lg font-semibold text-gray-800">Service Information</h3>
                                        </CustomCardHeader>
                                        <CustomCardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">About this service:</h4>
                                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">Required Information:</h4>
                                                    <ul className="space-y-1">
                                                        {service.inputFields.map((field, index) => (
                                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                                                                {field.label || toTitleCase(field.name)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <p className="text-blue-800 text-sm">
                                                        <strong>💡 Tip:</strong> Fill out the form on the left to verify your details instantly.
                                                    </p>
                                                </div>
                                            </div>
                                        </CustomCardContent>
                                    </CustomCard>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}