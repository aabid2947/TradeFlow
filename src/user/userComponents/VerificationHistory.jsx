"use client"

import { useState, useMemo ,useEffect} from "react";
import { useGetVerificationHistoryQuery } from "@/app/api/verificationApiSlice";
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Search, Filter,
  TrendingUp, Shield, User, MapPin, Phone, CreditCard, AlertTriangle,
  Info, Download
} from "lucide-react";

// --- PDF Generation Logic ---
// This logic remains unchanged as it's not related to the UI rendering.
const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
};
const generatePDF = (result) => {
  const isSuccess = result.status === 'success';
  const currentDate = new Date(result.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });
  const verificationId = result._id;
  const printWindow = window.open('', '_blank');


  const renderDataRows = (data) => {
    if (!data || typeof data !== 'object') return '<tr><td colspan="2" style="padding: 8px;">No detailed data available.</td></tr>';

    return Object.entries(data).map(([key, value]) => `
      <tr>
        <td style="font-weight: 600; padding: 8px; border-bottom: 1px solid #eee; vertical-align: top; width: 30%;">${toTitleCase(key)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; word-break: break-all;">${typeof value === 'object' ? `<pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">${JSON.stringify(value, null, 2)}</pre>` : (value === true ? 'Yes' : value === false ? 'No' : value)}</td>
      </tr>`).join('');
  };

  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Verification Certificate - ${verificationId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .certificate { max-width: 800px; margin: 20px auto; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05); overflow: hidden; }
        .header { background: ${isSuccess ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'}; color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 4px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .status-section { text-align: center; margin-bottom: 30px; padding: 20px; border-radius: 10px; border: 1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}; background: ${isSuccess ? '#f0fdf4' : '#fef2f2'}; }
        .status-text { font-size: 24px; font-weight: 700; color: ${isSuccess ? '#047857' : '#b91c1c'}; }
        .status-id { font-family: monospace; color: #6b7280; margin-top: 5px; }
        .data-section { margin-bottom: 25px; }
        .data-section h3 { font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; color: #111827; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header"><h1>Verification Certificate</h1><p>Official System Record</p></div>
        <div class="content">
          <div class="status-section">
            <div class="status-text">VERIFICATION ${isSuccess ? 'SUCCESSFUL' : 'FAILED'}</div>
            <p class="status-id">ID: ${verificationId}</p>
          </div>
          <div class="data-section">
            <h3>Service Information</h3>
            <table class="data-table"><tbody>${renderDataRows({ Service: result.service.name, 'Date Issued': currentDate })}</tbody></table>
          </div>
          <div class="data-section">
            <h3>Input Parameters</h3>
            <table class="data-table"><tbody>${renderDataRows(result.inputPayload)}</tbody></table>
          </div>
          <div class="data-section">
            <h3>Verification Results</h3>
            <table class="data-table"><tbody>${isSuccess ? renderDataRows(result.resultData) : `<tr><td style="font-weight: 600;">Error Message</td><td>${result.errorMessage || 'N/A'}</td></tr>`}</tbody></table>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 500);
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


// --- Reusable ResultCard Component ---
const ResultCard = ({ result, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSuccess = result.status === 'success';

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
    // Other service formatters remain the same...
     if (serviceName.toLowerCase().includes('address')) {
      return [
        { icon: MapPin, title: "Street Address", value: payload.address || 'N/A', description: "Primary address to verify" },
        { icon: MapPin, title: "City & State", value: `${payload.city || 'N/A'}, ${payload.state || ''}`, description: "City and state information" },
        { icon: Info, title: "ZIP Code", value: payload.zipCode || 'N/A', description: "Postal code for verification" }
      ];
    }

    if (serviceName.toLowerCase().includes('phone')) {
      return [
        { icon: Phone, title: "Phone Number", value: payload.phoneNumber || 'N/A', description: "Phone number to verify" },
        { icon: Info, title: "Country", value: payload.countryCode || 'N/A', description: "Country code for the number" }
      ];
    }
    return Object.entries(payload).map(([key, value]) => ({ icon: Info, title: toTitleCase(key), value, description: "Checked parameter" }));
  };

  const formatResultData = (data, serviceName, isSuccess) => {
    if (!isSuccess) {
      return [
        {
          icon: AlertTriangle,
          title: "Verification Failed",
          value: result.errorMessage || "Unknown Error",
          description: data?.suggestion || "Please check your information and try again",
          status: "error"
        }
      ];
    }
    // Other service formatters remain the same...
     if (serviceName.toLowerCase().includes('identity')) {
      return [
        { icon: CheckCircle, title: "Identity Verified", value: data.verified ? "✓ Confirmed" : "✗ Not Verified", description: `Confidence: ${data.confidence || 'N/A'}%`, status: data.verified ? "success" : "error" },
        { icon: User, title: "Name Match", value: data.nameMatch ? "✓ Matches" : "✗ No Match", description: "Matches document records", status: data.nameMatch ? "success" : "error" },
        { icon: CreditCard, title: "Document Valid", value: data.documentValid ? "✓ Valid" : "✗ Invalid", description: "Authenticity verified", status: data.documentValid ? "success" : "error" }
      ];
    }

    if (serviceName.toLowerCase().includes('phone')) {
      return [
        { icon: CheckCircle, title: "Phone Status", value: data.valid ? "✓ Valid Number" : "✗ Invalid", description: data.isActive ? "Active line" : "Inactive line", status: data.valid ? "success" : "error" },
        { icon: Phone, title: "Carrier", value: data.carrier || 'N/A', description: `${data.lineType || ''} in ${data.region || ''}` }
      ];
    }
    return Object.entries(data).map(([key, value]) => ({ icon: CheckCircle, title: toTitleCase(key), value: String(value), status: "success" }));
  };

  const ServiceIcon = getServiceIcon(result.service?.name);

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
            <Button variant="outline" size="sm" onClick={() => generatePDF(result)}>
                <Download className="w-3.5 h-3.5 mr-1.5"/> Download
            </Button>
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

            <div>
              <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>Verification Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formatResultData(result.resultData, result.service?.name, isSuccess).map((item, idx) => <InfoCard key={idx} {...item} />)}
              </div>
            </div>

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