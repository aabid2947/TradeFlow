// src/pages/user/ServiceExecutionPage.jsx

import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Loader2, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
// import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useExecuteSubscribedServiceMutation } from "@/app/api/verificationApiSlice";
import { UserDetailsCard } from "./userComponents/UserDetailsCard";
import DashboardHeader from "./userComponents/DashboardHeader";
import SidebarComponent from "./userComponents/SidebarComponent";
import { apiSlice } from "@/app/api/apiSlice";
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { useDispatch } from "react-redux";

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

// **FIXED & UPDATED** Helper function to correctly check if verification was successful
const isVerificationSuccessful = (result) => {
    if (!result || !result.data) return false;
    const apiData = result.data;

    const errorCodes = ['1004', '1001', '1003', '1005', '1006', '404', '400'];
    if (apiData.code && errorCodes.includes(String(apiData.code))) return false;
    if (apiData.status === 'INVALID') return false;

    // Positive success indicators
    if (result.success === true) return true;
    if (apiData.message) {
        const message = apiData.message.toLowerCase();
        if (message.includes('verified successfully')) return true;
        if (message.includes('record found')) return true; // Fix for "1 record found"
    }
    if (apiData.status === 'VALID' || apiData.status === 'ACTIVE' || apiData.verified === true || apiData.account_exists === true) return true;
    if (String(apiData.code) === '1000') return true;

    return false;
};


export default function ServiceExecutionPage() {
    const { serviceKey } = useParams();
    const navigate = useNavigate();
    const dispatch= useDispatch()
    
    
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [verificationResult, setVerificationResult] = useState(null);
    const [verificationError, setVerificationError] = useState(null);
    const [inputData, setInputData] = useState(null);
    const [notification, setNotification] = useState(null);

    const { refetch: refetchProfile } = useGetProfileQuery();
      const { refetch: refetchServices } = useGetServicesQuery();

    const { data: servicesResponse } = useGetServicesQuery();
    const [executeService, { isLoading: isVerifying }] = useExecuteSubscribedServiceMutation();

    const service = useMemo(() => servicesResponse?.data?.find(s => s.service_key === serviceKey), [servicesResponse, serviceKey]);


    useEffect(()=>{
     window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });
  },[])

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };
    
    // **UPDATED** Handler to correctly process success and error states
    const handleExecuteVerification = async (payload) => {
        setInputData(payload);
        setVerificationResult(null);
        setVerificationError(null);
        
        const processError = (errorData) => {
            let apiMessage = errorData?.message || "An unexpected error occurred. Please try again.";
            let userMessage = apiMessage;

            const lowerCaseApiMessage = apiMessage.toLowerCase();
            if (lowerCaseApiMessage.includes('upstream source/government source internal server error') || lowerCaseApiMessage.includes('internal server error')) {
                userMessage = "The government server is temporarily unavailable. Please try again after some time.";
            }

            showNotification(userMessage, 'error');
            setVerificationError(errorData || { message: userMessage });
        };

        try {
            const result = await executeService({ serviceKey: service.service_key, payload }).unwrap();
            
            console.log(result.data)
            if (isVerificationSuccessful(result)) {
                showNotification(result.data?.message || 'Verification Successful!', 'success');
                setVerificationResult(result);
                console.log()
            } else {
                if(result.data?.message == "You do not have a valid subscription to use this service, or you have reached your usage limit for the month."){
                      dispatch(apiSlice.util.invalidateTags([
                            { type: 'User', id: 'PROFILE' },
                            { type: 'Service', id: 'LIST' },
                            { type: 'Subscription' }
                          ]));
                    
                          await Promise.all([
                            refetchProfile(),
                            refetchServices()
                          ]);
                          
                }
                if(result.data?.message == "You do not have a valid subscription to use this service, or you have reached your usage limit for the month."){
                      dispatch(apiSlice.util.invalidateTags([
                            { type: 'User', id: 'PROFILE' },
                            { type: 'Service', id: 'LIST' },
                            { type: 'Subscription' }
                          ]));
                    
                          await Promise.all([
                            refetchProfile(),
                            refetchServices()
                          ]);
                          
                }
                processError(result.data);
            }
            
        } catch (err) {
            // console.log(err.data)
            if(err.data?.message == "You do not have a valid subscription to use this service, or you have reached your usage limit for the month."){
                      dispatch(apiSlice.util.invalidateTags([
                            { type: 'User', id: 'PROFILE' },
                            { type: 'Service', id: 'LIST' },
                            { type: 'Subscription' }
                          ]));
                    
                          await Promise.all([
                            refetchProfile(),
                            refetchServices()
                          ]);
                          
                }
            processError(err.data);
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
                        <div className="mb-6">
                            <nav className="flex items-center text-sm text-gray-500 space-x-1">
                                <button onClick={() => handleNavigate('dashboard')} className="hover:text-gray-700 transition-colors">Dashboard</button>
                                <ChevronRight className="h-4 w-4" />
                                <button onClick={handleGoBackToCategory} className="hover:text-gray-700 transition-colors">{toTitleCase(service.category)}</button>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-800 font-medium">{service.name}</span>
                            </nav>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <DynamicServiceForm 
                                    service={service} 
                                    onVerify={handleExecuteVerification} 
                                    isVerifying={isVerifying} 
                                />
                            </div>
                            
                            <div className="space-y-6">
                                {/* **UPDATED RENDER LOGIC** */}
                                {/* Show results card ONLY on success */}
                                {verificationResult && !verificationError && (
                                    <UserDetailsCard 
                                        service={service}
                                        result={verificationResult} 
                                        error={null} // Pass null for error
                                        inputData={inputData}
                                        serviceName={service?.name}
                                        isSubscribed={true}
                                    />
                                )}
                                
                                {/* Show default service info card initially OR on error */}
                                {!verificationResult && (
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