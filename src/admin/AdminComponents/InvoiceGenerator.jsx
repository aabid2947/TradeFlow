// InvoiceGenerator.jsx
import React, { useRef } from 'react';
import { Download, FileText, CheckCircle, Clock, XCircle, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import html2pdf from 'html2pdf.js';

const sampleTransaction = {
  "_id": "68870995031956402748a783",
  "user": { "name": "Admin", "email": "superAdmin_9393eKyc@gmail.com" },
  "service": { "name": "Fetch CIN by PAN", "price": 29 },
  "status": "completed",
  "quantity": 1,
  "amount": 29,
  "razorpay_order_id": "order_QyN40De3JsrNKR",
  "razorpay_payment_id": "pay_QyN4R1bVyIPVYL",
  "razorpay_signature": "bfa57528415b499c262df78989044ae684966c8ada4f79b0870baac7a49c86dc",
  "metadata": { "message": "Fetch CIN details." },
  "createdAt": "2025-07-28T05:24:37.402Z"
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, border: 'border-green-200' };
    case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, border: 'border-yellow-200' };
    case 'failed': return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, border: 'border-red-200' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock, border: 'border-gray-200' };
  }
};

// --- FIX: Helper to get raw SVG strings instead of React components ---
const getStatusIconSVG = (status, style) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${style.text}"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`;
        case 'pending':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${style.text}"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
        case 'failed':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${style.text}"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
        default:
            return '';
    }
}

const generateInvoiceHtmlContent = (data) => {
    const statusStyle = getStatusStyle(data.status);
    const subtotal = data.amount || 0;
    const gstAmount = subtotal * 0.18;
    const totalAmount = subtotal + gstAmount;

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Invoice #${data._id.slice(-8).toUpperCase()}</title>
          <style>
              body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #111827; }
              .container { max-width: 800px; margin: 24px auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
              .header { background: linear-gradient(to right, #2563eb, #1e40af); color: white; padding: 32px; display: flex; justify-content: space-between; align-items: flex-start; }
              .header h1 { font-size: 1.875rem; font-weight: 700; margin: 0; }
              .header p { margin-top: 4px; color: #dbeafe; }
              .invoice-details { text-align: right; }
              .invoice-details h2 { font-size: 1.5rem; font-weight: 700; margin: 0; }
              .content { padding: 32px; }
              .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; margin-bottom: 32px; }
              .info-box { background-color: #f9fafb; padding: 16px; border-radius: 8px; }
              .info-box h3 { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 12px; }
              .info-box p { margin: 2px 0; color: #4b5563; font-size: 0.875rem; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
              thead { background-color: #f9fafb; }
              th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; }
              th { font-weight: 600; color: #374151; font-size: 0.75rem; text-transform: uppercase; }
              .text-right { text-align: right; }
              .total-section { display: flex; justify-content: flex-end; }
              .total-box { width: 50%; background-color: #f9fafb; padding: 24px; border-radius: 8px; }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .total-final { font-size: 1.25rem; font-weight: 700; color: #2563eb; }
              .footer { text-align: center; padding: 32px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.75rem; }
              .status-badge { display: inline-flex; align-items: center; gap: 8px; border-radius: 9999px; padding: 4px 12px; font-weight: 500; }
              .bg-green-100 { background-color: #dcfce7; } .text-green-800 { color: #166534; }
              .bg-yellow-100 { background-color: #fef9c3; } .text-yellow-800 { color: #92400e; }
              .bg-red-100 { background-color: #fee2e2; } .text-red-800 { color: #991b1b; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div>
                      <h1>eKYC Solutions</h1>
                      <p>Professional Verification Services</p>
                  </div>
                  <div class="invoice-details">
                      <h2>INVOICE</h2>
                      <p>#${data._id.slice(-8).toUpperCase()}</p>
                  </div>
              </div>
              <div class="content">
                  <div class="grid">
                      <div class="info-box">
                          <h3>From:</h3>
                          <p><strong>eKYC Solutions Pvt. Ltd.</strong></p>
                          <p>123 Business District, New Delhi, 110001</p>
                          <p>Email: support@ekycsolutions.com</p>
                          <p>GST: 07AABCE2207R1Z5</p>
                      </div>
                      <div class="info-box">
                          <h3>Bill To:</h3>
                          <p><strong>${data.user?.name || 'N/A'}</strong></p>
                          <p>${data.user?.email || 'N/A'}</p>
                          <p>Invoice Date: ${formatDate(data.createdAt)}</p>
                      </div>
                  </div>
                  <table>
                      <thead>
                          <tr><th>Description</th><th class="text-right">Unit Price</th><th class="text-right">Total</th></tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>${data.service?.name || 'Service'}</td>
                              <td class="text-right">${formatCurrency(data.amount || 0)}</td>
                              <td class="text-right">${formatCurrency(data.amount || 0)}</td>
                          </tr>
                      </tbody>
                  </table>
                  <div class="total-section">
                      <div class="total-box">
                          <div class="total-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
                          <div class="total-row"><span>GST (18%)</span><span>${formatCurrency(gstAmount)}</span></div>
                          <hr style="border-top: 1px solid #e5e7eb; margin: 16px 0;">
                          <div class="total-row"><strong>Total Amount</strong><strong class="total-final">${formatCurrency(totalAmount)}</strong></div>
                      </div>
                  </div>
                  <div style="margin-top: 32px;">
                      <h3>Payment Status:</h3>
                      <div class="status-badge ${statusStyle.bg} ${statusStyle.text}">
                          ${getStatusIconSVG(data.status, statusStyle)}
                          <span>${data.status?.charAt(0).toUpperCase() + data.status?.slice(1)}</span>
                      </div>
                  </div>
              </div>
              <div class="footer">
                  <p>Thank you for your business! For any queries, please contact support@ekycsolutions.com.</p>
                  <p>This is a computer-generated invoice and does not require a physical signature.</p>
              </div>
          </div>
      </body>
      </html>
    `;
};

export const generateInvoicePDF = (transactionData) => {
  const data = transactionData || sampleTransaction;
  const invoiceHtmlContent = generateInvoiceHtmlContent(data);

  const options = {
    margin: 0,
    filename: `Invoice_${data._id.slice(-8)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(invoiceHtmlContent).set(options).save();
};

export const InvoicePDFGenerator = ({ transactionData }) => {
  const printRef = useRef();
  const data = transactionData || sampleTransaction;
  const statusStyle = getStatusStyle(data.status);
  const StatusIcon = statusStyle.icon;

  const handlePrint = () => {
      const printWindow = window.open('', '_blank');
      const invoiceHtml = generateInvoiceHtmlContent(data);
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.onload = function() {
          printWindow.print();
      };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex gap-4 no-print">
        <Button onClick={() => generateInvoicePDF(data)} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> Print Invoice
        </Button>
      </div>
      <div ref={printRef}>
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            <div dangerouslySetInnerHTML={{ __html: generateInvoiceHtmlContent(data) }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};