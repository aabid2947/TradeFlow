"use client"

import { useState, useMemo ,useEffect} from "react";
import { useGetVerificationHistoryQuery } from "@/app/api/verificationApiSlice";
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Search, Filter,
  TrendingUp, Shield, User, MapPin, Phone, CreditCard, AlertTriangle,
  Info, Download
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import favicon from "@/assets/favicon.png";
import VerifyMyKyc from "@/assets/VerifyMyKyc.svg";

// --- PDF Generation Logic (Synchronized with UserDetailsCard.jsx) ---

// Helper function to format keys into titles (from UserDetailsCard.jsx)
const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Enhanced function to find the main data object within the API response (from UserDetailsCard.jsx)
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

// PDF Generation Function (Enhanced with Perfect UI)
const generatePDF = (result) => {
  const serviceName = result.service?.name || 'Verification';
  
  // Use the same data extraction logic as UserDetailsCard.jsx
  const details = findDetailsObject(result.resultData);
  const currentDate = new Date(result.createdAt).toLocaleDateString('en-GB');
  
  const flattenDetailsForDisplay = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = toTitleCase(key);
      
      // Skip if key contains base64 image file reference
      if (key.toLowerCase().includes('base64')) {
        return acc;
      }
      
      // Skip metadata fields
      if (key.toLowerCase().includes('metadata')) {
        return acc;
      }
      
      // Skip arrays as they display as "[object Object]"
      if (Array.isArray(value)) {
        return acc;
      }
      
      if (value && typeof value === 'object') {
        acc.push(...flattenDetailsForDisplay(value, newKey));
      } else {
        // Show full value without truncation
        const displayValue = value || '';
        acc.push({ key: newKey, value: displayValue });
      }
      return acc;
    }, []);
  };

  const allDetails = details ? flattenDetailsForDisplay(details) : [];
  // Get only the first 10 fields for display
  let displayDetails = allDetails;
  if(allDetails.length > 10) {
       displayDetails = allDetails.slice(0, 10);
  }

  // Enhanced html2canvas with separate pages
  const generateWithEnhancedCanvas = () => {
    // Create First Page (Verification Data)
    const createFirstPage = () => {
      const firstPageElement = document.createElement('div');
      firstPageElement.innerHTML = `
        <div class="report-container" style="
          font-family: 'Roboto', Arial, sans-serif; 
          font-size: 18px; 
          color: #333; 
          margin: 0; 
          padding: 8px; 
          background: #fff; 
          width: 800px;
          max-width: 800px;
          line-height: 1.6;
          box-sizing: border-box;
          height: 1000px;
        ">
          <div class="header" style="
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            padding-bottom: 8px; 
            border-bottom: 3px solid #e5e7eb; 
            margin-bottom: 0px;
          ">
            <img style="height:80px;width:240px;margin-left:-8px" src="${VerifyMyKyc}" alt="Company Logo"/>
            <div class="company-info" style="text-align: right; font-size: 16px; color: #555;">
              <h3 style="margin: 0 0 0px 0; color: #111; font-size: 24px; font-weight: 700;">Navigant Digital Pvt. Ltd.</h3>
              <p style="margin: 0; line-height: 1.7;">A-24/5, Mohan Cooperative Industrial Area,<br>Badarpur, Second Floor,<br>New Delhi 110044</p>
            </div>
          </div>

          <div class="title-section" style="padding: 0px 0; text-align: center; margin-bottom: 2px;">
            <h1 style="font-size: 32px; color: #1a202c; margin: 0 0 0px 0; font-weight: 700;">${serviceName}</h1>
            <p style="font-size: 12px; color: #4a5568; margin: 0; font-weight: 500;">Details of ${serviceName}: ${result.resultData?.document_number || result.resultData?.account_number || result.resultData?.pan_number || 'N/A'}</p>
          </div>
          
          <div class="status-section" style="margin-bottom: 2px;">
            <h2 style="font-size: 20px; color: #1a202c; margin: 0 0 0px 0; font-weight: 600; padding: 12px 0; border-bottom: 2px solid #e5e7eb;">
              Know Your ${serviceName.replace(' Verification', '').replace(' Status', '')} Status
            </h2>
          </div>
          
          <div class="current-date" style="text-align: right; margin-bottom: 8px; font-size: 18px; color: #718096; font-weight: 500;">
            <strong>Date of Report:</strong> ${currentDate}
          </div>
          
          <div class="data-section" style="margin-bottom: 8px;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #000;">
              <tbody>
                ${displayDetails.length > 0
                  ? displayDetails.map(({ key, value }) =>
                    `<tr style="border: 1px solid #000;">
                      <td style="padding: 15px; vertical-align: top; font-weight: 700; width: 45%; color: #4a5568; word-wrap: break-word; font-size: 18px; line-height: 1.5; border: 1px solid #000;">
                        ${key}
                      </td>
                      <td style="padding: 15px; color: #1a202c; font-weight: 500; word-wrap: break-word; font-size: 18px; width: 55%; line-height: 1.5; border: 1px solid #000;">
                        ${(value === null || value === undefined) ? 'N/A' : String(value)}
                      </td>
                    </tr>`
                  ).join('')
                  : `<tr>
                      <td colspan="2" style="text-align:center; padding: 50px; font-size: 20px; color: #718096; font-style: italic; border: 1px solid #000;">
                        No details available.
                      </td>
                    </tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
      return firstPageElement;
    };

    // Create Second Page (Legal Disclaimer)
    const createSecondPage = () => {
      const secondPageElement = document.createElement('div');
      secondPageElement.innerHTML = `
        <div class="report-container" style="
          font-family: 'Roboto', Arial, sans-serif; 
          font-size: 18px; 
          color: #333; 
          margin: 0; 
          padding: 20px; 
          background: #fff; 
          width: 800px;
          max-width: 800px;
          line-height: 1.6;
          box-sizing: border-box;
          height: 1000px;
        ">
          <div class="header" style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #e5e7eb;">
            <h1 style="font-size: 28px; color: #1a202c; margin: 0; font-weight: 700;">LEGAL DISCLAIMER</h1>
          </div>
          
          <div class="disclaimer-content" style="font-size: 14px; color: #718096; line-height: 1.8;">
            <p style="margin-bottom: 18px; text-align: justify;">
              All rights reserved. The report and its contents are the property of VerifyMyKyc (operated by Navigant Digital Pvt. Ltd.) and may not be reproduced in any manner without the express written permission of VerifyMyKyc.
            </p>
            <p style="margin-bottom: 18px; text-align: justify;">
              The reports and information contained herein are confidential and are meant only for the internal use of the VerifyMyKyc client for assessing the background of their applicant. The information and report are subject to change based on changes in factual information.
            </p>
            <p style="margin-bottom: 18px; text-align: justify;">
              Information and reports, including text, graphics, links, or other items, are provided on an "as is," "as available" basis. VerifyMyKyc expressly disclaims liability for errors or omissions in the report, information, and materials, as the information is obtained from various sources as per industry practice. No warranty of any kind implied, express, or statutory including but not limited to the warranties of non-infringement of third party rights, title, merchantability, fitness for a particular purpose or freedom from computer virus, is given with respect to the contents of this report.
            </p>
            <p style="margin-bottom: 18px; text-align: justify;">
              Our findings are based on the information available to us and industry practice; therefore, we cannot guarantee the accuracy of the information collected. Should additional information or documentation become available that impacts our conclusions, we reserve the right to amend our findings accordingly.
            </p>
            <p style="margin-bottom: 18px; text-align: justify;">
              These reports are not intended for publication or circulation. They should not be shared with any person, entity, association, corporation, or any other purposes, in whole or in part, without prior written consent from VerifyMyKyc in each specific instance. Our reports cannot be used by clients to claim all responsibility or liability that may arise due to omissions, additions, correction, and accuracy. All the information has been obtained from various sources as per industry practice to make an informed decision, and we hereby disclaim all responsibility or liability that may arise due to errors in the report.
            </p>
            <p style="margin-bottom: 30px; text-align: justify;">
              Due to the limitations mentioned above, the result of our work with respect to background checks should be considered only as a guideline. Our reports and comments should not be considered a definitive pronouncement on the individual.
            </p>
          </div>
          
          <div class="confidential" style="
            text-align: center; 
            font-weight: bold; 
            color: #c53030; 
            margin-top: 60px; 
            font-size: 16px; 
            letter-spacing: 1px;
            padding: 25px 0;
            border-top: 1px solid #e5e7eb;
          ">
            - VerifyMyKyc CONFIDENTIAL -
          </div>
        </div>
      `;
      return secondPageElement;
    };

    // Generate both pages and merge them
    const generateCombinedPDF = async () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      try {
        // Generate First Page
        const firstPageElement = createFirstPage();
        document.body.appendChild(firstPageElement);
        
        const firstPageCanvas = await html2canvas(firstPageElement.querySelector('.report-container'), {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          width: 800,
          height: 1000,
          windowWidth: 800,
          windowHeight: 1000
        });

        const firstPageData = firstPageCanvas.toDataURL('image/png', 1.0);
        
        // Add first page to PDF
        const firstPageAspectRatio = firstPageCanvas.height / firstPageCanvas.width;
        const firstPageHeight = contentWidth * firstPageAspectRatio;
        
        pdf.addImage(
          firstPageData,
          'PNG',
          margin,
          margin,
          contentWidth,
          Math.min(firstPageHeight, contentHeight)
        );

        // Generate Second Page
        const secondPageElement = createSecondPage();
        document.body.appendChild(secondPageElement);
        
        const secondPageCanvas = await html2canvas(secondPageElement.querySelector('.report-container'), {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          width: 800,
          height: 1000,
          windowWidth: 800,
          windowHeight: 1000
        });

        const secondPageData = secondPageCanvas.toDataURL('image/png', 1.0);
        
        // Add second page to PDF
        pdf.addPage();
        const secondPageAspectRatio = secondPageCanvas.height / secondPageCanvas.width;
        const secondPageHeight = contentWidth * secondPageAspectRatio;
        
        pdf.addImage(
          secondPageData,
          'PNG',
          margin,
          margin,
          contentWidth,
          Math.min(secondPageHeight, contentHeight)
        );

        // Clean up DOM elements
        if (document.body.contains(firstPageElement)) {
          document.body.removeChild(firstPageElement);
        }
        if (document.body.contains(secondPageElement)) {
          document.body.removeChild(secondPageElement);
        }

        // Save the PDF
        const fileName = `${serviceName.replace(/\s+/g, '_')}_Verification_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

      } catch (error) {
        console.error("Error generating PDF:", error);
        // Clean up in case of error
        const elements = document.querySelectorAll('.report-container');
        elements.forEach(el => {
          if (document.body.contains(el.parentElement)) {
            document.body.removeChild(el.parentElement);
          }
        });
      }
    };

    generateCombinedPDF();
  };

  // Use the enhanced canvas method with separate pages
  try {
    generateWithEnhancedCanvas();
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};

// --- UI Helper Components ---

const Badge = ({ variant, children, className = "" }) => {
  const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 inline-block";
  const variants = {
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    error: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ variant = "default", size = "md", disabled, onClick, children, className = "" }) => {
  const baseClasses = "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    ghost: "text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500",
    outline: "border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 focus:ring-blue-500 bg-white"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2 text-sm rounded-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const InfoCard = ({ icon: Icon, title, value, description, status = "neutral" }) => {
  const statusColors = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    neutral: "border-gray-200 bg-gray-50"
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          status === 'success' ? 'bg-green-100' :
          status === 'error' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-4 h-4 ${
            status === 'success' ? 'text-green-600' :
            status === 'error' ? 'text-red-600' : 'text-blue-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-700 text-xs">{title}</h4>
          <p className="text-base font-bold text-gray-900 mt-1 truncate">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// **Enhanced Data Display Component with Scrollbar**
const SimpleDataTable = ({ data, title }) => {
  if (!data || typeof data !== 'object') return null;

  // Function to get all meaningful entries from the data (same as UserDetailsCard.jsx)
  const getMeaningfulEntries = (obj, prefix = '') => {
    const entries = [];
    
    for (const [key, value] of Object.entries(obj)) {
      if (['message', 'code', 'success', 'timestamp', 'status_code'].includes(key.toLowerCase())) {
        continue;
      }
      
      if (value === null || value === undefined) continue;
      
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
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
  
  // Custom scrollbar styling
  const scrollbarStyles = `
    .modern-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .modern-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    .modern-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db; /* gray-300 */
      border-radius: 3px;
    }
    .modern-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af; /* gray-400 */
    }
    .modern-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #d1d5db transparent;
    }
  `;

  return (
    <div className="space-y-3">
      <style>{scrollbarStyles}</style>
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <Info className="w-4 h-4" />
          {title}
        </h4>
      )}
      {/* UPDATE: Added overflow-y-auto, max-h-72 for scrolling, and the custom scrollbar class */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto max-h-72 modern-scrollbar">
        {entries.map(([key, value], index) => (
          <div 
            key={key} 
            className={`flex justify-between items-start px-4 py-3 hover:bg-gray-100 transition-colors ${
              index !== entries.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className="text-sm font-medium text-gray-700 min-w-0 flex-1 pr-4">
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

// --- Reusable ResultCard Component ---
const ResultCard = ({ result, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isSuccess = result.status === 'success';
  
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      generatePDF(result);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const getServiceIcon = (serviceName = "") => {
    if (serviceName.toLowerCase().includes('identity')) return User;
    if (serviceName.toLowerCase().includes('address')) return MapPin;
    if (serviceName.toLowerCase().includes('phone')) return Phone;
    return Shield;
  };

  const formatInputData = (payload, serviceName) => {
    if (!payload) return [];
    if (serviceName.toLowerCase().includes('identity')) {
      return [
        { icon: User, title: "Full Name", value: `${payload.firstName || ''} ${payload.lastName || ''}`, description: "Name provided" },
        { icon: CreditCard, title: "Document Type", value: payload.documentType?.toUpperCase() || 'N/A', description: "ID document type" },
        { icon: Info, title: "Document Number", value: payload.documentNumber ? "••••••" + payload.documentNumber.slice(-4) : 'N/A', description: "Last 4 digits" }
      ];
    }
    
    if (serviceName.toLowerCase().includes('address')) {
      return [
        { icon: MapPin, title: "Street Address", value: payload.address || 'N/A', description: "Primary address to verify" },
        { icon: MapPin, title: "City & State", value: `${payload.city || 'N/A'}, ${payload.state || ''}`, description: "City and state information" },
        { icon: Info, title: "ZIP Code", value: payload.zipCode || 'N/A', description: "Postal code for verification" }
      ];
    }

    if (serviceName.toLowerCase().includes('phone') || serviceName.toLowerCase().includes('mobile')) {
      return [
        { icon: Phone, title: "Phone Number", value: payload.phoneNumber || payload.mobile_number || 'N/A', description: "Phone number to verify" },
        { icon: Info, title: "Country", value: payload.countryCode || 'N/A', description: "Country code for the number" }
      ];
    }
    return Object.entries(payload).map(([key, value]) => ({ icon: Info, title: toTitleCase(key), value, description: "Checked parameter" }));
  };

  const ServiceIcon = getServiceIcon(result.service?.name);

  // Extract meaningful data using the same logic as UserDetailsCard.jsx
  const details = findDetailsObject(result.resultData);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isSuccess
          ? 'bg-white border-green-200 hover:border-green-300'
          : 'bg-white border-red-200 hover:border-red-300'
      }`}
      style={{
        animationDelay: `${index * 80}ms`,
        animation: 'slideInUp 0.5s ease-out forwards'
      }}
    >
      <div className="relative p-4 md:p-5">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-2.5 rounded-lg ${isSuccess ? 'bg-green-50' : 'bg-red-50'} transition-transform duration-200 group-hover:scale-110`}>
              <ServiceIcon className={`w-5 h-5 ${isSuccess ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-gray-900 transition-colors">
                {result.service?.name || 'Unknown Service'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(result.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <Badge variant={isSuccess ? "success" : "error"}>
                {isSuccess ? "✓ Successful" : "✗ Failed"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {isSuccess && (
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 mr-1.5"/> Download
                  </>
                )}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="group/btn">
              <span className="mr-1">Details</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-100 pt-5 space-y-6">
            <div>
              <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>What We Checked</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formatInputData(result.inputPayload, result.service?.name).map((item, idx) => <InfoCard key={idx} {...item} />)}
              </div>
            </div>

            {isSuccess && details && (
              <div>
                <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>Verification Results</h4>
                <SimpleDataTable data={details} />
              </div>
            )}

            {!isSuccess && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-800 text-sm mb-1">Need Help?</h5>
                    <p className="text-blue-700 text-xs leading-relaxed">If your verification failed, please double-check your information and try again. Ensure details match your official documents. If issues persist, contact support.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function VerificationHistory() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: response, isLoading, isError, error } = useGetVerificationHistoryQuery({ page, limit: 10 });
  const results = response?.data || [];
  const pagination = response?.pagination;
  console.log(response)

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    },[page]) // Trigger scroll on page change

  const filteredResults = useMemo(() => {
    return (results || []).filter(result => {
      const serviceName = result.service?.name || '';
      const matchesSearch = serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || result.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [results, searchTerm, filterStatus]);

  const totalCount = pagination?.total || 0;
  const successCount = useMemo(() => (results || []).filter(r => r.status === 'success').length, [results]);
  const failureCount = useMemo(() => (results || []).filter(r => r.status === 'failed').length, [results]);

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-blue-600 font-medium text-sm">Loading verifications...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-xl mx-auto text-center py-12">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 text-sm">{error?.data?.message || "We couldn't load your verification history. Please try again."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-blue-600 font-semibold text-sm">Your Verification Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-3">
            My Verifications
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Review your verification history, check detailed results, and download certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-lg"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalCount.toLocaleString()}</p>
                        <p className="text-gray-500 font-medium text-sm">Total Verifications</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{successCount.toLocaleString()}</p>
                        <p className="text-gray-500 font-medium text-sm">Successful (on page)</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-100 rounded-lg"><XCircle className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{failureCount.toLocaleString()}</p>
                        <p className="text-gray-500 font-medium text-sm">Needs Attention (on page)</p>
                    </div>
                </div>
            </div>
        </div>


        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by service name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200 bg-white text-base"/>
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-auto pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200 bg-white appearance-none text-base min-w-[180px]">
                <option value="all">All Statuses</option>
                <option value="success">✓ Successful</option>
                <option value="failed">✗ Failed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredResults.length > 0 ? (
          <div className="space-y-4 mb-6">
            <style jsx>{`
              @keyframes slideInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {filteredResults.map((result, index) => (
              <ResultCard key={result._id} result={result} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-md mx-auto">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-5" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{searchTerm || filterStatus !== "all" ? "No Matches Found" : "No Verifications Yet"}</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">{searchTerm || filterStatus !== "all" ? "Try adjusting your search or filter to find what you're looking for." : "When you complete your first verification, it will appear here."}</p>
              {(searchTerm || filterStatus !== "all") && (<Button variant="outline" onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} size="md">Clear Filters</Button>)}
            </div>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-6 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={isLoading || page === 1}>
              Previous
            </Button>
            <span className="text-sm font-semibold text-gray-600">Page {pagination.page} of {pagination.pages}</span>
            <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={isLoading || page === pagination.pages}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}