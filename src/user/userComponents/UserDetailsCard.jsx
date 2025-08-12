import React, { useState, useEffect } from "react";
import { CheckCircle, Download, Shield, Clock, User, FileText, Award, AlertCircle, CreditCard, RefreshCw } from "lucide-react";

// Import the necessary hooks for invalidation and refetching
import { useGetProfileQuery } from "@/app/api/authApiSlice";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";
import { apiSlice } from "@/app/api/apiSlice";
import { useDispatch } from "react-redux";
// import { useGetProfileQuery } from "@/app/api/authApiSlice";
import favicon from "@/assets/favicon.png"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import VerifyMyKyc from "@/assets/VerifyMyKyc.svg"

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

// Enhanced Data Table Component that handles nested objects better
const SimpleDataTable = ({ data, title }) => {
  if (!data || typeof data !== 'object') return null;

  // Function to get all meaningful entries from the data
  const getMeaningfulEntries = (obj, prefix = '') => {
    const entries = [];
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip metadata fields
      if (['message', 'code', 'success', 'timestamp', 'status_code'].includes(key.toLowerCase())) {
        continue;
      }
      
      if (value === null || value === undefined) continue;
      
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For nested objects, recursively get entries
        const nestedEntries = getMeaningfulEntries(value, fullKey);
        entries.push(...nestedEntries);
      } else {
        entries.push([fullKey, value]);
      }
    }
    
    return entries;
  };

  const entries = getMeaningfulEntries(data);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {title}
        </h4>
      )}
      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        {entries.map(([key, value], index) => (
          <div 
            key={key} 
            className={`flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              index !== entries.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
              {toTitleCase(key.split('.').pop())}
              {key.includes('.') && (
                <span className="text-xs text-gray-500 block">
                  {key.split('.').slice(0, -1).map(toTitleCase).join(' → ')}
                </span>
              )}
            </span>
            <span className="text-sm text-gray-900 font-medium text-right max-w-xs break-words ml-4">
              {typeof value === 'boolean' ? (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {value ? 'Yes' : 'No'}
                </span>
              ) : (
                String(value)
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PDF Generation Function (updated to remove input parameters)
// Paste this updated function into your UserDetailsCard.jsx file

// UPDATED PDF GENERATION FUNCTION
// Paste this updated function into your UserDetailsCard.jsx file

// UPDATED PDF GENERATION FUNCTION
const generatePDF = (result, serviceName) => {
  const reportElement = document.createElement('div');
  
  // The HTML and CSS for the report content remain the same
  const details = findDetailsObject(result.data);
  const currentDate = new Date().toLocaleDateString('en-GB');
  const flattenDetailsForDisplay = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix} → ${toTitleCase(key)}` : toTitleCase(key);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        acc.push(...flattenDetailsForDisplay(value, newKey));
      } else {
        acc.push({ key: newKey, value });
      }
      return acc;
    }, []);
  };
  const allDetails = details ? flattenDetailsForDisplay(details) : [];

  reportElement.innerHTML = `
    <html>
    <head>
        <meta charset="utf-8">
        <title>${serviceName} Verification Report</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            body { font-family: 'Roboto', Arial, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 0; background-color: #fff; }
            .report-container { width: 550px; padding: 60px; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
            .logo { width: 80px; height: 50px; }
            .company-info { text-align: right; font-size: 11px; color: #555; }
            .company-info h3 { margin: 0 0 5px 0; color: #111; font-size: 14px; font-weight: 700; }
            .title-section { padding: 25px 0; text-align: center; }
            .title-section h1 { font-size: 22px; color: #1a202c; margin: 0 0 8px 0; font-weight: 700; }
            .title-section p { font-size: 14px; color: #4a5568; margin: 0; }
            .current-date { text-align: right; margin-bottom: 20px; font-size: 11px; color: #718096; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table tr { border-bottom: 1px solid #edf2f7; }
            .data-table tr:last-child { border-bottom: none; }
            .data-table td { padding: 12px 0; vertical-align: top; }
            .data-table td:first-child { font-weight: 500; width: 45%; color: #4a5568; }
            .data-table td:last-child { color: #1a202c; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #718096; }
            .footer h4 { font-size: 11px; font-weight: 700; color: #2d3748; margin-bottom: 10px; }
            .footer p { margin-bottom: 8px; text-align: justify; line-height: 1.6; }
            .confidential { text-align: center; font-weight: bold; color: #c53030; margin-top: 20px; font-size: 10px; letter-spacing: 0.5px; }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <img src="${VerifyMyKyc}" alt="Company Logo" class="logo"/>
                <div class="company-info"><h3>Verify My KYC</h3><p>A-24/5, Mohan Cooperative Industrial Area,<br>Badarpur, Second Floor,<br>New Delhi 110044</p></div>
            </div>
            <div class="title-section"><h1>Verification Report</h1><p>${serviceName} Status</p></div>
            <div class="current-date"><strong>Date of Report:</strong> ${currentDate}</div>
            <div class="data-section">
                <table class="data-table"><tbody>
                    ${allDetails.length > 0 ? allDetails.map(({ key, value }) => `<tr><td>${key}</td><td>${(value === null || value === undefined) ? 'N/A' : String(value)}</td></tr>`).join('') : '<tr><td colspan="2" style="text-align:center; padding: 20px;">No details available.</td></tr>'}
                </tbody></table>
            </div>
            <div class="footer">
                <h4>LEGAL DISCLAIMER</h4>
                <p>All rights reserved. The report and its contents are the property of Verify My KYC and may not be reproduced in any manner without the express written permission of Verify My KYC.</p>
                <p>The reports and information contained herein are confidential and are meant only for the internal use of the Verify My KYC client for assessing the background of their applicant. The information and report are subject to change based on changes in factual information.</p>
                <p>Information and reports, including text, graphics, links, or other items, are provided on an "as is," "as available" basis. Verify My KYC expressly disclaims liability for errors or omissions in the report, information, and materials, as the information is obtained from various sources as per industry practice.</p>
                <p>Our findings are based on the information available to us and industry practice; therefore, we cannot guarantee the accuracy of the information collected. Should additional information or documentation become available that impacts our conclusions, we reserve the right to amend our findings accordingly.</p>
                <p>Due to the limitations mentioned above, the result of our work with respect to background checks should be considered only as a guideline. Our reports and comments should not be considered a definitive pronouncement on the individual.</p>
                <div class="confidential">- VERIFY MY KYC CONFIDENTIAL -</div>
            </div>
        </div>
    </body></html>
  `;

  // Append to body to render it off-screen
  document.body.appendChild(reportElement);
  
  const elementToCapture = reportElement.querySelector('.report-container');

  if (elementToCapture) {
      html2canvas(elementToCapture, { 
        scale: 2, // Higher scale for better quality
        useCORS: true,
        // These options are key to capturing the entire element, not just the visible part
        height: elementToCapture.scrollHeight,
        windowHeight: elementToCapture.scrollHeight
      }).then(canvas => {
          try {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('p', 'mm', 'a4');
              
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              
              const canvasWidth = canvas.width;
              const canvasHeight = canvas.height;
              
              const ratio = canvasWidth / canvasHeight;
              const imgHeight = pdfWidth / ratio;
              
              let heightLeft = imgHeight;
              let position = 0;
              let page = 1;

              // Add the first page
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdfHeight;

              // Add more pages if the content is longer than one page
              while (heightLeft > 0) {
                  position = -pdfHeight * page;
                  pdf.addPage();
                  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                  heightLeft -= pdfHeight;
                  page++;
              }
              
              pdf.save(`Verification_Report_${serviceName.replace(/\s+/g, '_')}.pdf`);
          } catch (e) {
              console.error("Error creating PDF:", e);
          } finally {
              document.body.removeChild(reportElement);
          }
      }).catch(err => {
          console.error("html2canvas failed:", err);
          if (document.body.contains(reportElement)) {
              document.body.removeChild(reportElement);
          }
      });
  } else {
      console.error("Could not find element to capture for PDF generation.");
  }
};

// Enhanced function to find the main data object within the API response
const findDetailsObject = (data) => {
  if (typeof data !== 'object' || data === null) return null;
  
  // Look for specific verification data keys first (like bank_account_data, pan_data, etc.)
  const specificDataKeys = Object.keys(data).filter(key => 
    key.includes('_data') && typeof data[key] === 'object' && data[key] !== null
  );
  
  if (specificDataKeys.length > 0) {
    // Return the first specific data object found
    return data[specificDataKeys[0]];
  }
  
  // Then, look for a nested 'data' object that contains meaningful verification data
  if (data.data && typeof data.data === 'object') {
    const nestedData = data.data;
    const verificationFields = ['name', 'account_number', 'ifsc', 'bank_name', 'account_type', 'mobile', 'email', 'dob', 'father_name', 'document_type'];
    
    // Check if nested data has verification fields
    const hasVerificationData = verificationFields.some(field => nestedData[field]);
    if (hasVerificationData) {
      return nestedData;
    }
  }
  
  // If no nested data with verification fields, check the main data object
  const verificationFields = ['name', 'account_number', 'ifsc', 'bank_name', 'account_type', 'mobile', 'email', 'dob', 'father_name', 'document_type'];
  const hasMainVerificationData = verificationFields.some(field => data[field]);
  
  if (hasMainVerificationData) {
    // Return filtered data without metadata
    const filteredData = { ...data };
    delete filteredData.message;
    delete filteredData.code;
    delete filteredData.success;
    delete filteredData.timestamp;
    delete filteredData.status_code;
    delete filteredData.outputFields;
    return filteredData;
  }
  
  // Look for any object key that contains meaningful data
  const detailsKey = Object.keys(data).find(key => 
    typeof data[key] === 'object' && 
    data[key] !== null && 
    !['message', 'code', 'success', 'timestamp', 'status_code', 'outputFields'].includes(key.toLowerCase()) &&
    Object.keys(data[key]).length > 0
  );
  
  return detailsKey ? data[detailsKey] : null;
};

// Function to get display message from result
const getDisplayMessage = (result) => {
  if (!result || !result.data) return null;
  
  const data = result.data;
  if (data.message && data.message.toLowerCase().includes('verified successfully')) {
    return data.message;
  }
  
  return null;
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

// Main UserDetailsCard component with enhanced success/error handling
export function UserDetailsCard({ 
  result, 
  error, 
  serviceName, 
  inputData, 
  onShowPurchaseCard,
  currentServiceKey,
  service
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  
  const { refetch: refetchProfile } = useGetProfileQuery();
  const { refetch: refetchServices } = useGetServicesQuery();

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      generatePDF(result, serviceName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };
  
  const handleRefreshAndPurchase = async () => {
    setIsRefreshing(true);
    try {
      dispatch(apiSlice.util.invalidateTags([
        { type: 'User', id: 'PROFILE' },
        { type: 'Service', id: 'LIST' },
        { type: 'Subscription' }
      ]));

      await Promise.all([
        refetchProfile(),
        refetchServices()
      ]);

      if (onShowPurchaseCard) {
        onShowPurchaseCard();
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    // This error block is kept as a fallback but will not be rendered from ServiceExecutionPage
    // as per the new logic.
    const isSubError = isSubscriptionError(error);
    
    return (
      <CustomCard className={`border-red-200 ${isSubError ? 'bg-orange-50' : 'bg-red-50'}`}>
        <CustomCardHeader className={`${isSubError ? 'bg-orange-100 border-orange-200' : 'bg-red-100 border-red-200'}`}>
            {/* ... Error content ... */}
        </CustomCardHeader>
        <CustomCardContent>
          {/* ... Error content ... */}
        </CustomCardContent>
      </CustomCard>
    );
  }

  // Handle state where there is no result yet
  if (!result) {
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
            <p className="text-sm text-gray-500">Fill out the form to verify your details instantly.</p>
          </div>
        </CustomCardContent>
      </CustomCard>
    );
  }

  // If we have a result, show the verification details
  const details = findDetailsObject(result.data);
  const displayMessage = getDisplayMessage(result);
  const verificationId = `VRF-${Date.now()}`;
  const currentTime = new Date().toLocaleString();
  const hasOutputFields = result.data?.outputFields && result.data.outputFields.length > 0;
  const serviceType = serviceName || service?.name || 'Verification Service';

  return (
    <CustomCard className="border-green-200 bg-green-50">
      <div className="bg-gradient-to-r from-blue-500 to-emerald-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-12 h-12 " src={favicon} alt="" />
            <div>
              <h3 className="text-lg font-bold">Verified Successfully</h3>
              <p className="text-green-100 text-sm">{serviceType}</p>
            </div>
          </div>
        </div>
      </div>

      <CustomCardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-4">
              {details && (
                <SimpleDataTable 
                  data={details} 
                  title="Verified Information" 
                />
              )}
              {!details && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Verification Complete</h4>
                      <p className="text-sm text-green-700">
                        {displayMessage || 'Your details have been successfully verified.'}
                      </p>
                    </div>
                  </div>
                  {hasOutputFields && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <h5 className="font-medium text-gray-700 mb-2">Available Output Fields:</h5>
                      <div className="text-sm text-gray-600">
                        {result.data.outputFields.length > 0 
                          ? result.data.outputFields.join(', ')
                          : 'Standard verification fields available'
                        }
                      </div>
                    </div>
                  )}
                  {!hasOutputFields && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ Account details verified against official records
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Security</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Encryption: <span className="font-medium">SHA-256</span></div>
              <div>Status: <span className="text-green-600 font-medium">Verified</span></div>
            </div>
          </div>
          <div className="bg-white border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 text-center">
              <Clock className="w-4 h-4 text-green-600 text-center" />
              <span className="text-sm font-medium text-gray-700">Processing</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Time: <span className="font-medium">{currentTime.split(',')[1]}</span></div>
              <div>Duration: <span className="text-green-600 font-medium">2.34s</span></div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Download Certificate</h4>
              <p className="text-sm text-blue-700">Get a PDF copy of your verification results</p>
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