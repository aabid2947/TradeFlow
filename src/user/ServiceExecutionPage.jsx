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

// Category to Subcategory mapping based on service data
const CATEGORY_SUBCATEGORY_MAPPING = {
    "Identity Verification": [
        "Address Verification",
        "Passport Verification", 
        "Voter ID verification",
        "Driving License verification"
    ],
    "Financial & Business Checks": [
        "GSTIN verification",
        "Bank Account Verification", 
        "Buissness Check"
    ],
    "Employer Verification": [
        "Employer Verification"
    ],
    "Biometric & AI-Based Verification": [
        "Facematch",
        "Liveness"
    ],
    "Profile & Database Lookup": [
        "Profile Lookup"
    ],
    "Legal & Compliance Checks": [
        "Criminal and Court Record Verification"
    ],
    "Vehicle Verification": [
        "Driving License verification"
    ]
};

// Subcategory to Category reverse mapping for quick lookup
const SUBCATEGORY_TO_CATEGORY_MAPPING = {
    "Address Verification": "Identity Verification",
    "Passport Verification": "Identity Verification", 
    "Voter ID verification": "Identity Verification",
    "Driving License verification": "Identity Verification", // Can also be Vehicle Verification
    "GSTIN verification": "Financial & Business Checks",
    "Bank Account Verification": "Financial & Business Checks", 
    "Buissness Check": "Financial & Business Checks",
    "Employer Verification": "Employer Verification",
    "Facematch": "Biometric & AI-Based Verification",
    "Liveness": "Biometric & AI-Based Verification",
    "Profile Lookup": "Profile & Database Lookup",
    "Criminal and Court Record Verification": "Legal & Compliance Checks"
};

// Function to get category by subcategory
const getCategoryBySubcategory = (subcategory) => {
    return SUBCATEGORY_TO_CATEGORY_MAPPING[subcategory] || null;
};

// Function to get all subcategories for a category
const getSubcategoriesByCategory = (category) => {
    return CATEGORY_SUBCATEGORY_MAPPING[category] || [];
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

// Function to get available financial years (current and past only)
const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11
    
    // Financial year in India runs from April to March
    // If current month is April (3) or later, current FY is currentYear-currentYear+1
    // If current month is Jan-Mar, current FY is (currentYear-1)-currentYear
    const currentFY = currentMonth >= 3 ? currentYear : currentYear - 1;
    
    const years = [];
    // Generate past 10 financial years including current
    for (let i = 0; i <= 10; i++) {
        const startYear = currentFY - i;
        const endYear = startYear + 1;
        years.push(`${startYear}-${endYear.toString().slice(-2)}`);
    }
    
    return years;
};

// Custom Select Component for Financial Year
const CustomSelect = ({ id, name, value, onChange, required, children, className = "" }) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`
                w-full px-3 py-2.5 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                transition-all duration-200 bg-white
                ${className}
            `}
        >
            {children}
        </select>
    );
};

const DynamicServiceForm = ({ service, onVerify, isVerifying }) => {
    const [formData, setFormData] = useState({});
    const [consentChecked, setConsentChecked] = useState(false);
    
    const isFormFilled = service ? 
        service.inputFields.every(field => !!formData[field.name]) && consentChecked : false;

    // **UPDATED** handleInputChange now supports file inputs and base64 conversion
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        console.log('📝 Input change detected:', { name, type, hasFiles: !!files?.[0] });
        
        if (type === 'file') {
            const file = files[0];
            
            // Validate file for image uploads
            if (file) {
                console.log('📁 File details:', { 
                    name: file.name, 
                    size: file.size, 
                    type: file.type, 
                    fieldName: name 
                });
                
                // Check file size (3MB = 3 * 1024 * 1024 bytes)
                const maxSize = 3 * 1024 * 1024; // 3MB
                if (file.size > maxSize) {
                    setNotification({
                        type: 'error',
                        message: 'File size must be less than 3MB. Please choose a smaller file.'
                    });
                    // Clear the file input
                    e.target.value = '';
                    return;
                }
                
                // Check file format for image uploads
                const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
                if (!allowedTypes.includes(file.type)) {
                    setNotification({
                        type: 'error',
                        message: 'Only PNG, JPG, and JPEG formats are allowed. Please choose a valid image file.'
                    });
                    // Clear the file input
                    e.target.value = '';
                    return;
                }
            }
            
            // Check if this is a base64 field (regardless of what type is specified in service config)
            if (file && (name === 'base64data' || name === 'base64_data' || name.toLowerCase().includes('base64'))) {
                console.log('🖼️ Processing base64 field:', name);
                
                // Create a closure to capture the current field name and timestamp for uniqueness
                const currentFieldName = name;
                const timestamp = Date.now();
                console.log('🔐 Captured field name in closure:', currentFieldName, 'at', timestamp);
                
                // Convert image to base64 for base64data field
                const reader = new FileReader();
                reader.onload = (event) => {
                    console.log('🎯 FileReader completed for field:', currentFieldName, 'at', timestamp);
                    let base64String = event.target.result;
                    
                    // Debug: Log the original base64 string
                    console.log('🖼️ Original base64 from FileReader for field', currentFieldName, ':', base64String.substring(0, 100) + '...');
                    
                    // Extract just the base64 part (remove data:image/jpeg;base64, prefix)
                    if (base64String.includes(',')) {
                        base64String = base64String.split(',')[1];
                        console.log('🔧 Extracted base64 for field', currentFieldName, '(without prefix):', base64String.substring(0, 100) + '...');
                    }
                    
                    console.log('💾 Updating formData for field:', currentFieldName);
                    setFormData((prev) => {
                        console.log('📥 Previous form data before update:', Object.keys(prev));
                        const newData = { 
                            ...prev, 
                            [currentFieldName]: base64String 
                        };
                        console.log('📊 Updated form state fields:', Object.keys(newData));
                        console.log('📊 Form data for field', currentFieldName, ':', newData[currentFieldName] ? 'Has data' : 'No data');
                        
                        // Log all base64 fields to see if multiple are being affected
                        Object.keys(newData).forEach(key => {
                            if (key.toLowerCase().includes('base64')) {
                                console.log(`📋 Base64 field ${key}:`, newData[key] ? 'Has data' : 'No data');
                            }
                        });
                        
                        return newData;
                    });
                };
                reader.readAsDataURL(file);
            } else {
                console.log('📎 Processing regular file field:', name);
                // Regular file handling for other file inputs
                setFormData((prev) => ({ ...prev, [name]: file || null }));
            }
        } else {
            console.log('✏️ Processing text field:', name);
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormFilled) {
            console.log('🚀 Submitting form data:', formData);
            console.log('🚀 All base64 fields in submission:');
            Object.keys(formData).forEach(key => {
                if (key.toLowerCase().includes('base64')) {
                    console.log(`📤 ${key}:`, formData[key] ? 'Has data' : 'No data');
                }
            });
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
                        {/* **UPDATED** Conditional rendering for text vs file vs base64data inputs */}
                        {service.inputFields.map(({ name, type, label, placeholder }) => {
                            // **NEW** Special handling for base64data field - always treat as image upload regardless of type
                            const isBase64Field = name === 'base64data' || name === 'base64_data' || name.toLowerCase().includes('base64');
                            
                            console.log('🎯 Field analysis:', { 
                                name, 
                                type, 
                                label, 
                                isBase64Field,
                                hasData: !!formData[name]
                            });
                            
                            if (isBase64Field) {
                                console.log('🎯 Rendering base64 field:', { name, type, label });
                                const imageData = formData[name];
                                return (
                                    <div key={name} className="space-y-1">
                                        <CustomLabel htmlFor={name}>
                                            {label || 'Upload Image'} <span className="text-red-500">*</span>
                                        </CustomLabel>
                                        <p className="text-xs text-gray-500 mb-2">
                                            📁 File size must be less than 3MB. Supported formats: PNG, JPG, JPEG
                                        </p>
                                        {!imageData ? (
                                            <div className="relative">
                                                <input
                                                    id={name}
                                                    name={name}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleInputChange}
                                                    required
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex items-center justify-center w-full px-3 py-2.5 border border-dashed border-gray-400 rounded-lg text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <FileText className="inline-block w-5 h-5 mr-2" />
                                                    <span>Click to upload image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-300 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                                                        <span>Image uploaded successfully</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, [name]: null }))}
                                                        className="p-1 ml-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {/* Image preview */}
                                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={`data:image/jpeg;base64,${imageData}`}
                                                        alt="Uploaded preview" 
                                                        className="w-full h-32 object-contain bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            
                            // **NEW** Logic for file input rendering
                            if (type === 'file') {
                                const file = formData[name];
                                return (
                                    <div key={name} className="space-y-1">
                                        <CustomLabel htmlFor={name}>
                                            {label || toTitleCase(name)} <span className="text-red-500">*</span>
                                        </CustomLabel>
                                        <p className="text-xs text-gray-500 mb-2">
                                            📁 File size must be less than 3MB. Supported formats: PNG, JPG, JPEG
                                        </p>
                                        {!file ? (
                                            <div className="relative">
                                                <input
                                                    id={name}
                                                    name={name}
                                                    type="file"
                                                    onChange={handleInputChange}
                                                    required
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex items-center justify-center w-full px-3 py-2.5 border border-dashed border-gray-400 rounded-lg text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <FileText className="inline-block w-5 h-5 mr-2" />
                                                    <span>Click to upload file</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-300 bg-gray-50 rounded-lg">
                                                <div className="flex items-center text-sm text-gray-700 truncate">
                                                    <FileText className="w-5 h-5 mr-2 text-cyan-600 flex-shrink-0" />
                                                    <span className="truncate" title={file.name}>{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, [name]: null }))}
                                                    className="p-1 ml-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            

                            if (label === 'Financial Year (eg: 2024-25)') {
                                const financialYears = getFinancialYears();
                                return (
                                    <div key={name} className="space-y-1">
                                        <CustomLabel htmlFor={name}>
                                            {label || 'Financial Year'} <span className="text-red-500">*</span>
                                        </CustomLabel>
                                        <CustomSelect
                                            id={name}
                                            name={name}
                                            value={formData[name] || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Financial Year</option>
                                            {financialYears.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </CustomSelect>
                                    </div>
                                );
                            }
                            
                            // Existing logic for text-based inputs
                            return (
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
                            );
                        })}
                        
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


const isVerificationSuccessful = (result) => {
    console.log(result.data)
    if (!result || (!result.data || !result.ocr_data)) return false;
    const apiData = result.data || result.ocr_data;

    // First check for explicit error codes
    const errorCodes = [ '404', '400'];
    if (apiData.code && errorCodes.includes(String(apiData.code))) return false;
    // if (apiData.status === 'INVALID') return false;

    // Define negative words/phrases that indicate failure - using specific phrases to avoid false positives
    const negativeWords = [
        ' not ',
        ' no ',
        'no record',
        'not found',
        'not valid',
        'not verified',
        'not active',
        'no match',
        'no data',
        'does not exist',
        'does not match',
        'doesn\'t exist',
        'doesn\'t match',
        'cannot verify',
        'can\'t verify',
        'verification failed',
        'validation failed',
        'request failed',
        'processing failed',
        'failed to process',
        'failed to verify',
        'is invalid',
        'are invalid',
        'incorrect details',
        'data mismatch',
        'details mismatch',
        'service unavailable',
        'currently unavailable',
        'access denied',
        'request denied',
        'account blocked',
        'account suspended',
        'account inactive',
        'document expired',
        'subscription expired',
        'plan cancelled'
    ];

    // Check if the response contains negative indicators (using exact phrase matching)
    const responseText = ' ' + JSON.stringify(apiData).toLowerCase() + ' '; // Add spaces for boundary checking
    
    // Debug: Check each negative word individually
    console.log('🔍 Full API Response:', apiData);
    console.log('📝 Response Text:', responseText);
    
    const foundNegatives = negativeWords.filter(phrase => responseText.includes(phrase));
    console.log('❌ Found negative phrases:', foundNegatives);
    
    const hasNegativeWord = foundNegatives.length > 0;
    console.log('🎯 Has negative word:', hasNegativeWord);
    // If negative words are found, treat as error
    if (hasNegativeWord) {
        console.log('Verification failed: Negative indicators found in response', apiData);
        return false;
    }

    // Positive success indicators (only check if no negative words found)
    // if (result.success === true) return true;
    // if (apiData.message) {
    //     const message = apiData.message.toLowerCase();
    //     if (message.includes('verified successfully')) return true;
    //     if (message.includes('record found')) return true;
    //     if (message.includes('verification successful')) return true;
    // }
    // if (apiData.status === 'VALID' || apiData.status === 'ACTIVE' || apiData.verified === true || apiData.account_exists === true) return true;
    // if (String(apiData.code) === '1000') return true;

    // If no negative words and some positive indicators, consider successful
    return true;
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

    // Map service category/subcategory to sidebar categories
    const mappedActiveCategory = useMemo(() => {
        if (!service) return null;
        
        // Check subcategory first, then category
        const serviceSubcategory = service.subcategory;
        const serviceCategory = service.category;
        
        console.log('🔍 Service mapping debug:', {
            serviceKey,
            serviceCategory,
            serviceSubcategory,
            serviceName: service.name
        });
        
        // If we have a subcategory, map it to its parent category using our mapping
        if (serviceSubcategory) {
            const mappedCategory = getCategoryBySubcategory(serviceSubcategory);
            if (mappedCategory) {
                console.log('📍 Mapped subcategory to category:', serviceSubcategory, '->', mappedCategory);
                return mappedCategory;
            }
        }
        
        // If no subcategory mapping found, use direct category mapping
        const categoryMapping = {
            'Employment': 'Employer Verification',
            'Identity Verification': 'Identity Verification', 
            'Financial & Business Checks': 'Financial & Business Checks',
            'Legal & Compliance Checks': 'Legal & Compliance Checks',
            'Biometric & AI-Based Verification': 'Biometric & AI-Based Verification',
            'Profile & Database Lookup': 'Profile & Database Lookup',
            'Vehicle Verification': 'Vehicle Verification'
        };
        
        const mappedCategory = categoryMapping[serviceCategory] || serviceCategory || serviceSubcategory;
        console.log('📍 Final mapped category:', mappedCategory);
        return mappedCategory;
    }, [service, serviceKey]);


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
    
    // **UPDATED** Handler to correctly build FormData for file uploads and handle base64 data
   const handleExecuteVerification = async (payload) => {
    setInputData(payload);
    setVerificationResult(null);
    setVerificationError(null);

    // Check if we have regular file uploads (not base64data)
    const hasFileUpload = service.inputFields.some(field => 
        field.type === 'file' && 
        !field.name.toLowerCase().includes('base64') && 
        field.name !== 'base64data' && 
        field.name !== 'base64_data'
    );
    // Check if we have base64data field
    const hasBase64Data = service.inputFields.some(field => 
        field.name === 'base64data' || 
        field.name === 'base64_data' || 
        field.name.toLowerCase().includes('base64')
    );
    
    let finalPayload;

    if (hasFileUpload && !hasBase64Data) {
        // Regular file upload handling
        finalPayload = new FormData();
        
        for (const key in payload) {
            if (payload[key]) {
                finalPayload.append(key, payload[key]);
            }
        }
        // console.log('📤 Sending regular file FormData to backend');
    } else if (hasBase64Data && !hasFileUpload) {
        // Base64 data - send as JSON
        finalPayload = payload;
        // console.log('📤 Sending base64 JSON to backend:', {
        //     ...payload,
        //     // Don't log full base64 string, just show preview
        //     ...(payload.base64data && { base64data: payload.base64data.substring(0, 50) + '...' }),
        //     ...(payload.base64_data && { base64_data: payload.base64_data.substring(0, 50) + '...' })
        // });
    } else if (hasFileUpload && hasBase64Data) {
        // Mixed case - use FormData but base64 will be string
        finalPayload = new FormData();
        
        for (const key in payload) {
            if (payload[key]) {
                finalPayload.append(key, payload[key]);
            }
        }
        // console.log('📤 Sending mixed FormData (files + base64) to backend');
    } else {
        // No file uploads - send as regular JSON
        finalPayload = payload;
        // console.log('📤 Sending regular JSON to backend:', payload);
    }
    
    // --- Safe Debugging Logic ---
   
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
        const result = await executeService({ serviceKey: service.service_key, payload: finalPayload }).unwrap();
        
        if (isVerificationSuccessful(result)) {
            showNotification(result.data?.message || 'Verification Successful!', 'success');
            setVerificationResult(result);
        } else {
            if (result.data?.message === "You do not have a valid subscription to use this service, or you have reached your usage limit for the month.") {
                dispatch(apiSlice.util.invalidateTags([
                    { type: 'User', id: 'PROFILE' },
                    { type: 'Service', id: 'LIST' },
                    { type: 'Subscription' }
                ]));
                await Promise.all([refetchProfile(), refetchServices()]);
            }
            processError(result.data);
        }
    } catch (err) {
        if (err.data?.message === "You do not have a valid subscription to use this service, or you have reached your usage limit for the month.") {
            dispatch(apiSlice.util.invalidateTags([
                { type: 'User', id: 'PROFILE' },
                { type: 'Service', id: 'LIST' },
                { type: 'Subscription' }
            ]));
            await Promise.all([refetchProfile(), refetchServices()]);
        }
        processError(err.data);
    }
};
    
    const handleGoBackToCategory = () => {
        navigate(`/user/service/${service.subcategory}`, { 
          state: { 
            view: 'services', 
            category: service.subcategory || service.category 
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
                activeCategory={mappedActiveCategory}
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
                                <button onClick={handleGoBackToCategory} className="hover:text-gray-700 transition-colors">
                                    {service.subcategory ? toTitleCase(service.subcategory) : toTitleCase(service.category)}
                                </button>
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