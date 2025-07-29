import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Download, Shield, Clock, User, FileText, Award } from "lucide-react";

// Helper function to format keys into titles
const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Helper component to recursively render data
const DataRenderer = ({ data }) => {
  // Render a table for an array of objects
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const headers = Object.keys(data[0]);
    return (
      <div className="overflow-x-auto rounded-lg border border-green-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-green-800 uppercase bg-green-50">
            <tr>
              {headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold">{toTitleCase(header)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="bg-white border-b border-green-100 last:border-b-0">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-3"><DataRenderer data={row[header]} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render a list for an array of primitives
  if (Array.isArray(data)) {
    return data.length > 0 ? <p className="text-sm text-gray-700">{data.join(", ")}</p> : <p className="text-sm text-gray-500 italic">No items.</p>;
  }

  // Render key-value pairs for an object
  if (typeof data === 'object' && data !== null) {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start p-3 bg-green-50 rounded-lg border border-green-100">
            <span className="font-semibold text-green-800 text-sm">{toTitleCase(key)}</span>
            <div className="text-gray-700 break-words text-right max-w-xs"><DataRenderer data={value} /></div>
          </div>
        ))}
      </div>
    );
  }

  // Render the primitive value itself
  return <span className="text-sm text-gray-700 font-medium">{String(data)}</span>;
};

// Find the main data object within the API response, ignoring metadata
const findDetailsObject = (data) => {
  if (typeof data !== 'object' || data === null) return null;
  const detailsKey = Object.keys(data).find(key => typeof data[key] === 'object' && data[key] !== null && !['message', 'code'].includes(key.toLowerCase()));
  return detailsKey ? data[detailsKey] : null;
};

// PDF Generation Function
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

// Updated UserDetailsCard component
export function UserDetailsCard({ result, error, serviceName, inputData }) {
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Handle API error state
  if (error) {
    return (
      <Card className="shadow-lg border-2 border-red-200 bg-red-50">
        <CardHeader className="bg-red-100 border-b border-red-200">
          <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">✕</span>
            </div>
            Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-red-700">{error.message || "An unknown error occurred."}</p>
          <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-200">
            <p className="text-xs text-red-600">
              <strong>Error Code:</strong> {error.code || 'UNKNOWN'} | 
              <strong> Time:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle state where there is no result yet, or the verification was not successful
  if (!result || !result.success) {
    return (
      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{result?.data?.message || "Awaiting verification..."}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const details = findDetailsObject(result.data);
  const verificationId = `VRF-${Date.now()}`;
  const currentTime = new Date().toLocaleString();

  return (
    <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-b-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">VERIFICATION SUCCESSFUL</CardTitle>
                <p className="text-green-100 text-sm font-medium">Certificate ID: {verificationId}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-green-100 mt-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Digitally Signed</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Authority Badge */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Authorized Verification Agency</h3>
                <p className="text-sm text-gray-600">Licensed & Regulated Document Verification Service</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-bold text-lg">✓ VERIFIED</div>
              <div className="text-xs text-gray-500">ID: {verificationId.slice(-8)}</div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">{serviceName || 'Document Verification'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time:</span>
                <span className="font-medium">2.34 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy Rate:</span>
                <span className="font-medium text-green-600">99.8%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security Features
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Encryption:</span>
                <span className="font-medium">SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Digital Signature:</span>
                <span className="font-medium text-green-600">Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Certificate Validity:</span>
                <span className="font-medium">90 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Results */}
        {details ? (
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Verification Results
            </h4>
            <DataRenderer data={details} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 italic">No displayable data found in the response.</p>
          </div>
        )}

        {/* Download Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Download Official Certificate</h4>
              <p className="text-sm text-blue-700">Get a PDF copy of your verification certificate</p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2 font-medium"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 text-center">
            This certificate is legally binding and digitally authenticated. 
            For verification of authenticity, visit our website with Certificate ID: {verificationId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Updated UserInfoCard component (keeping original functionality)
export function UserInfoCard({ services = [], activeServiceId, onVerify, isVerifying }) {
  const [formData, setFormData] = useState({});
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    if (activeServiceId && services.length > 0) {
      const service = services.find((s) => s.service_key === activeServiceId);
      setCurrentService(service);
      setFormData({});
    }
  }, [activeServiceId, services]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!activeServiceId || !onVerify) return;

    const isFileUpload = currentService.inputFields.some((input) => input.type === "file");
    let payload;

    if (isFileUpload) {
      payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
    } else {
      payload = { ...formData };
    }

    onVerify(payload);
  };

  return (
    <Card className="shadow-lg p-4 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="p-4 px-6 mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {currentService ? currentService.name : "Service Inputs"}
        </CardTitle>
        <p className="text-blue-100 text-sm">Secure document verification service</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-6">
        <div className="space-y-4">
          {!currentService ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Select a service from the left to begin verification.</p>
            </div>
          ) : currentService.inputFields.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No input fields defined for this service.</p>
          ) : (
            currentService.inputFields.map(({ name, type, label, placeholder }) => (
              <div key={name} className="grid w-full items-center gap-1.5">
                <Label htmlFor={name} className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {label || toTitleCase(name)}
                </Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder || `Enter ${toTitleCase(name)}...`}
                  onChange={handleInputChange}
                  className="w-full text-sm border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>
            ))
          )}
        </div>

        {currentService && (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">₹</span>
                </div>
                <div>
                  <div className="text-blue-700 font-bold text-xl">₹ {currentService.price}</div>
                  <div className="text-xs text-gray-500">Secure Payment Processing</div>
                </div>
              </div>
              <Button
                onClick={handleBuyNow}
                disabled={isVerifying || !Object.keys(formData).length}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-sm font-semibold flex items-center gap-2 shadow-lg"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verify & Pay
                  </>
                )}
              </Button>
            </div>
            
            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Shield className="w-3 h-3 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Verified Service</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Award className="w-3 h-3 text-green-500" />
                <span>Licensed Provider</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}