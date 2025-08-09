import React, { useState, useEffect } from "react";
import { CheckCircle, Download, Shield, Clock, User, FileText, Award, AlertCircle, CreditCard, RefreshCw } from "lucide-react";

// Import the necessary hooks for invalidation and refetching
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { apiSlice } from "@/app/api/apiSlice";
import { useDispatch } from "react-redux";

// Helper function to format keys into titles
const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Custom UI Components
const CustomCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CustomCardHeader = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

const CustomCardContent = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

const CustomButton = ({ children, onClick, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled 
          ? 'bg-gray-400 text-white cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Simplified Data Table Component
const SimpleDataTable = ({ data, title }) => {
  if (!data || typeof data !== 'object') return null;

  const entries = Object.entries(data).filter(([key, value]) => 
    !['message', 'code', 'success'].includes(key.toLowerCase()) && value !== null && value !== undefined
  );

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        {entries.map(([key, value], index) => (
          <div 
            key={key} 
            className={`flex justify-between items-center px-4 py-3 ${
              index !== entries.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className="text-sm font-medium text-gray-600">
              {toTitleCase(key)}
            </span>
            <span className="text-sm text-gray-900 font-medium text-right max-w-xs break-words">
              {typeof value === 'boolean' ? (value ? 'true' : 'false') : 
               typeof value === 'object' ? JSON.stringify(value) : 
               String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PDF Generation Function (keeping original)
const generatePDF = (result, serviceName, inputData) => {
  const details = findDetailsObject(result.data);
  const currentDate = new Date().toLocaleString();
  const verificationId = `VRF-${Date.now()}`;
  
  // Create a new window for PDF content
  const printWindow = window.open('', '_blank');
  
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Verification Certificate</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333;
                background: #f8f9fa;
                padding: 20px;
            }
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .logo {
                width: 60px;
                height: 60px;
                background: white;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                font-size: 24px;
                color: #10b981;
                font-weight: bold;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 5px;
                font-weight: 700;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .verification-badge {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.2);
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            .content {
                padding: 40px;
            }
            .status-section {
                text-align: center;
                margin-bottom: 40px;
                padding: 20px;
                background: #f0fdf4;
                border-radius: 10px;
                border: 2px solid #10b981;
            }
            .status-icon {
                width: 80px;
                height: 80px;
                background: #10b981;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                color: white;
                font-size: 40px;
            }
            .status-text {
                font-size: 24px;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 10px;
            }
            .verification-id {
                font-size: 14px;
                color: #6b7280;
                font-family: 'Courier New', monospace;
                background: #f3f4f6;
                padding: 5px 10px;
                border-radius: 5px;
                display: inline-block;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }
            .info-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #10b981;
            }
            .info-section h3 {
                color: #10b981;
                font-size: 16px;
                margin-bottom: 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .info-item {
                margin-bottom: 12px;
                font-size: 14px;
            }
            .info-label {
                font-weight: 600;
                color: #374151;
                display: inline-block;
                width: 120px;
            }
            .info-value {
                color: #6b7280;
            }
            .data-section {
                background: #fff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            .data-section h3 {
                color: #10b981;
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
            }
            .data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .data-table th, .data-table td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }
            .data-table th {
                background: #f9fafb;
                font-weight: 600;
                color: #374151;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
            }
            .footer p {
                margin-bottom: 5px;
            }
            .security-features {
                display: flex;
                justify-content: space-around;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            .security-item {
                text-align: center;
                font-size: 11px;
                color: #6b7280;
            }
            @media print {
                body { background: white; padding: 0; }
                .certificate { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <div class="verification-badge">VERIFIED</div>
                <div class="logo">VF</div>
                <h1>VERIFICATION CERTIFICATE</h1>
                <p>Official Document Authentication System</p>
            </div>
            
            <div class="content">
                <div class="status-section">
                    <div class="status-icon">✓</div>
                    <div class="status-text">VERIFICATION SUCCESSFUL</div>
                    <div class="verification-id">ID: ${verificationId}</div>
                </div>
                
                <div class="info-grid">
                    <div class="info-section">
                        <h3><span>📋</span> Service Information</h3>
                        <div class="info-item">
                            <span class="info-label">Service:</span>
                            <span class="info-value">${serviceName || 'Document Verification'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Date & Time:</span>
                            <span class="info-value">${currentDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="info-value" style="color: #10b981; font-weight: 600;">VERIFIED</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Processing Time:</span>
                            <span class="info-value">2.34 seconds</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3><span>🔒</span> Security Details</h3>
                        <div class="info-item">
                            <span class="info-label">Encryption:</span>
                            <span class="info-value">SHA-256</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Digital Signature:</span>
                            <span class="info-value">Valid</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Certificate Chain:</span>
                            <span class="info-value">Trusted</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Validity:</span>
                            <span class="info-value">90 days</span>
                        </div>
                    </div>
                </div>
                
                ${inputData ? `
                <div class="data-section">
                    <h3>Input Parameters</h3>
                    <table class="data-table">
                        ${Object.entries(inputData).map(([key, value]) => `
                            <tr>
                                <td><strong>${toTitleCase(key)}</strong></td>
                                <td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
                
                ${details ? `
                <div class="data-section">
                    <h3>Verification Results</h3>
                    <table class="data-table">
                        ${Object.entries(details).map(([key, value]) => `
                            <tr>
                                <td><strong>${toTitleCase(key)}</strong></td>
                                <td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <p><strong>VerifyFast - Trusted Verification Services</strong></p>
                <p>This certificate is digitally signed and cryptographically secured</p>
                <p>Certificate ID: ${verificationId} | Generated: ${currentDate}</p>
                
                <div class="security-features">
                    <div class="security-item">
                        <div>🔐</div>
                        <div>SSL Encrypted</div>
                    </div>
                    <div class="security-item">
                        <div>📋</div>
                        <div>Digitally Signed</div>
                    </div>
                    <div class="security-item">
                        <div>⏰</div>
                        <div>Time Stamped</div>
                    </div>
                    <div class="security-item">
                        <div>🛡️</div>
                        <div>Blockchain Verified</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  // Auto print after content loads
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

// Find the main data object within the API response, ignoring metadata
const findDetailsObject = (data) => {
  if (typeof data !== 'object' || data === null) return null;
  const detailsKey = Object.keys(data).find(key => 
    typeof data[key] === 'object' && 
    data[key] !== null && 
    !['message', 'code', 'success', 'timestamp'].includes(key.toLowerCase())
  );
  return detailsKey ? data[detailsKey] : data;
};

// Check if the error is subscription-related
const isSubscriptionError = (error) => {
  if (!error || !error.message) return false;
  const message = error.message.toLowerCase();
  return message.includes('subscription') || 
         message.includes('usage limit') || 
         message.includes('premium') ||
         message.includes('plan');
};

// Updated UserDetailsCard component with enhanced error handling
export function UserDetailsCard({ 
  result, 
  error, 
  serviceName, 
  inputData, 
  onShowPurchaseCard,
  currentServiceKey 
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('tabular');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  
  // Get refetch functions for invalidation
  const { refetch: refetchProfile } = useGetProfileQuery();
  const { refetch: refetchServices } = useGetServicesQuery();

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      generatePDF(result, serviceName, inputData);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleRefreshAndPurchase = async () => {
    setIsRefreshing(true);
    
    try {
      // 1. Invalidate user and service tags
      dispatch(apiSlice.util.invalidateTags([
        { type: 'User', id: 'PROFILE' },
        { type: 'Service', id: 'LIST' },
        { type: 'Subscription' }
      ]));

      // 2. Trigger refetch of user profile and services
      await Promise.all([
        refetchProfile(),
        refetchServices()
      ]);

      // 3. Show the purchase card
      if (onShowPurchaseCard) {
        onShowPurchaseCard();
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle API error state with enhanced subscription error handling
  if (error) {
    const isSubError = isSubscriptionError(error);
    
    return (
      <CustomCard className={`border-red-200 ${isSubError ? 'bg-orange-50' : 'bg-red-50'}`}>
        <CustomCardHeader className={`${isSubError ? 'bg-orange-100 border-orange-200' : 'bg-red-100 border-red-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isSubError ? 'bg-orange-200' : 'bg-red-200'
            }`}>
              {isSubError ? (
                <CreditCard className="w-5 h-5 text-orange-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                isSubError ? 'text-orange-800' : 'text-red-800'
              }`}>
                {isSubError ? 'Subscription Required' : 'Verification Failed'}
              </h3>
              <p className={`text-sm ${
                isSubError ? 'text-orange-600' : 'text-red-600'
              }`}>
                {isSubError ? 'Premium subscription needed to access this service' : 'An error occurred during verification'}
              </p>
            </div>
          </div>
        </CustomCardHeader>
        <CustomCardContent>
          <div className="space-y-4">
            <p className={`text-sm ${isSubError ? 'text-orange-700' : 'text-red-700'}`}>
              {error.message || "An unknown error occurred."}
            </p>
            
            <div className={`p-3 rounded-lg border ${
              isSubError ? 'bg-orange-100 border-orange-200' : 'bg-red-100 border-red-200'
            }`}>
              <p className={`text-xs ${isSubError ? 'text-orange-600' : 'text-red-600'}`}>
                <strong>Error Code:</strong> {error.code || 'UNKNOWN'} | 
                <strong> Time:</strong> {new Date().toLocaleString()}
              </p>
            </div>

            {/* Show action buttons for subscription errors */}
            {isSubError && (
              <div className="space-y-3 pt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Get Premium Access</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Upgrade to a premium plan to access this service and many more verification tools.
                  </p>
                  
                  <div className="flex gap-2">
                    <CustomButton
                      onClick={handleRefreshAndPurchase}
                      disabled={isRefreshing}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                    >
                      {isRefreshing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Purchase Plan
                        </>
                      )}
                    </CustomButton>
                    
                    <CustomButton
                      onClick={async () => {
                        setIsRefreshing(true);
                        try {
                          await Promise.all([refetchProfile(), refetchServices()]);
                        } finally {
                          setIsRefreshing(false);
                        }
                      }}
                      disabled={isRefreshing}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </CustomButton>
                  </div>
                </div>

                {/* Premium features highlight */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-medium text-purple-900 mb-2">Premium Features Include:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Unlimited verifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Priority processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Advanced security features</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CustomCardContent>
      </CustomCard>
    );
  }

  // Handle state where there is no result yet
  if (!result || !result.success) {
    return (
      <CustomCard className="border-gray-200">
        <CustomCardHeader className="bg-gray-50">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Waiting for Verification</h3>
              <p className="text-sm text-gray-500">Submit the form to see results</p>
            </div>
          </div>
        </CustomCardHeader>
        <CustomCardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{result?.data?.message || "Awaiting verification..."}</p>
          </div>
        </CustomCardContent>
      </CustomCard>
    );
  }

  const details = findDetailsObject(result.data);
  const verificationId = `VRF-${Date.now()}`;
  const currentTime = new Date().toLocaleString();

  return (
    <CustomCard className="border-green-200 bg-green-50">
      {/* Success Header */}
      <CustomCardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Verification Successful</h3>
              <p className="text-green-100 text-sm">Certificate ID: {verificationId.slice(-8)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">✓</div>
            <div className="text-xs text-green-100">VERIFIED</div>
          </div>
        </div>
      </CustomCardHeader>

      <CustomCardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tabular')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tabular'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tabular
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            JSON
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Output
          </h4>

          {activeTab === 'tabular' ? (
            <div className="space-y-4">
              {details && <SimpleDataTable data={details} title={Object.keys(result.data).find(key => result.data[key] === details) || "Pan Data"} />}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono">
                {JSON.stringify(details || result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Security</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Encryption: SHA-256</div>
              <div>Status: <span className="text-green-600 font-medium">Verified</span></div>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Timing</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Processed: {currentTime.split(',')[1]}</div>
              <div>Duration: <span className="text-green-600 font-medium">2.34s</span></div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Download Certificate</h4>
              <p className="text-sm text-blue-700">Get a PDF copy of your verification</p>
            </div>
            <CustomButton
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </CustomCardContent>
    </CustomCard>
  );
}
