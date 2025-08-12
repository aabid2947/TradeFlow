import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, IndianRupee, CreditCard, Activity,
  Calendar, Filter, Download, Eye, Clock, MapPin, Smartphone,
  AlertTriangle, CheckCircle, XCircle, BarChart3,
  Target, Zap, Globe, ShoppingCart, Star, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useGetAllTransactionsQuery } from '@/app/api/transactionApiSlice.js'; // Adjust this import path as needed

// Add CSS to remove focus outlines from charts
const chartStyles = `
  .recharts-wrapper, 
  .recharts-wrapper *, 
  .recharts-surface, 
  .recharts-layer, 
  .recharts-active-dot,
  .recharts-dot,
  .recharts-legend-wrapper,
  .recharts-legend-item,
  .recharts-cartesian-grid,
  .recharts-bar,
  .recharts-line,
  .recharts-area,
  .recharts-pie-sector,
  .recharts-cell {
    outline: none !important;
    border: none !important;
  }
  
  .recharts-wrapper:focus,
  .recharts-wrapper *:focus,
  .recharts-surface:focus,
  .recharts-layer:focus,
  .recharts-active-dot:focus,
  .recharts-dot:focus,
  .recharts-legend-wrapper:focus,
  .recharts-legend-item:focus,
  .recharts-cartesian-grid:focus,
  .recharts-bar:focus,
  .recharts-line:focus,
  .recharts-area:focus,
  .recharts-pie-sector:focus,
  .recharts-cell:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

// A simple loader component
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// A simple error component
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
    <AlertTriangle className="w-12 h-12 mb-4" />
    <h2 className="text-xl font-semibold">An Error Occurred</h2>
    <p>{message || "Failed to fetch data."}</p>
  </div>
);

// Sample user activity data (would come from Firebase Analytics or another service)
const userActivityData = [
  { page: "Home", visitors: 1250, avgTime: 45, bounceRate: 35 },
  { page: "Services", visitors: 890, avgTime: 120, bounceRate: 25 },
  { page: "Pricing", visitors: 670, avgTime: 95, bounceRate: 40 },
  { page: "About", visitors: 420, avgTime: 60, bounceRate: 50 },
  { page: "Contact", visitors: 310, avgTime: 30, bounceRate: 60 }
];

const MetricCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {changeType === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </div>
  );
};

const TrendChart = ({ data, dataKey, title, color = "#3B82F6" }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function DashboardOverview() {
  const [timeFilter, setTimeFilter] = useState('all'); // Changed default to 'all'
  const [isExporting, setIsExporting] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Fetch transaction data using the RTK Query hook
  const { data: transactionData, isLoading, isError, error } = useGetAllTransactionsQuery();

  // Export functionality
  const exportToCSV = (data, filename) => {
    const csvContent = data.map(row =>
      Object.values(row).map(val =>
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    ).join('\n');

    const headers = Object.keys(data[0]).join(',');
    const csv = headers + '\n' + csvContent;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate comprehensive report data
  const generateDetailedReport = () => {
    if (!transactionData || !transactionData.data) return;

    setIsExporting(true);

    const now = new Date();
    let startDate, endDate;
    let periodDescription = '';

    if (timeFilter === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      periodDescription = `${startDate.toLocaleDateString('en-IN')} to ${endDate.toLocaleDateString('en-IN')}`;
    } else if (timeFilter === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      periodDescription = 'Today';
    } else if (timeFilter === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      periodDescription = 'Last 7 Days';
    } else if (timeFilter === 'all') {
      // For all time, use the earliest transaction date or a very old date
      startDate = new Date('2020-01-01'); // Default start date for all time
      endDate = now;
      periodDescription = 'All Time';
    } else {
      // Default fallback
      startDate = new Date('2020-01-01');
      endDate = now;
      periodDescription = 'All Time';
    }

    const filteredTransactions = transactionData.data.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Generate comprehensive report data
    const reportData = filteredTransactions.map(transaction => ({
      'Transaction ID': transaction._id || 'N/A',
      'Date': new Date(transaction.createdAt).toLocaleDateString('en-IN'),
      'Time': new Date(transaction.createdAt).toLocaleTimeString('en-IN'),
      'User ID': transaction.user?._id || 'N/A',
      'User Name': transaction.user?.name || 'N/A',
      'User Email': transaction.user?.email || 'N/A',
      'Category': transaction.category || 'N/A',
      'Plan': transaction.plan || 'N/A',
      'Amount (₹)': transaction.amount || 0,
      'Status': transaction.status || 'N/A',
      'Payment Method': transaction.paymentMethod || 'N/A',
      'Description': transaction.description || 'N/A',
      'Created At': new Date(transaction.createdAt).toISOString(),
      'Updated At': transaction.updatedAt ? new Date(transaction.updatedAt).toISOString() : 'N/A'
    }));

    // Generate summary data
    const summaryData = [
      {
        'Metric': 'Report Period',
        'Value': periodDescription,
        'Details': `${filteredTransactions.length} transactions found`
      },
      {
        'Metric': 'Total Transactions',
        'Value': filteredTransactions.length,
        'Details': 'All transactions in period'
      },
      {
        'Metric': 'Total Revenue',
        'Value': `₹${filteredTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? (t.amount || 0) : 0), 0).toLocaleString('en-IN')}`,
        'Details': 'Completed transactions only'
      },
      {
        'Metric': 'Completed Transactions',
        'Value': filteredTransactions.filter(t => t.status === 'completed').length,
        'Details': 'Successfully processed'
      },
      {
        'Metric': 'Pending Transactions',
        'Value': filteredTransactions.filter(t => t.status === 'pending').length,
        'Details': 'Awaiting processing'
      },
      {
        'Metric': 'Failed Transactions',
        'Value': filteredTransactions.filter(t => t.status === 'failed').length,
        'Details': 'Unsuccessful transactions'
      },
      {
        'Metric': 'Success Rate',
        'Value': `${filteredTransactions.length > 0 ? ((filteredTransactions.filter(t => t.status === 'completed').length / filteredTransactions.length) * 100).toFixed(1) : 0}%`,
        'Details': 'Completed / Total transactions'
      },
      {
        'Metric': 'Average Order Value',
        'Value': `₹${filteredTransactions.filter(t => t.status === 'completed').length > 0 ? (filteredTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? (t.amount || 0) : 0), 0) / filteredTransactions.filter(t => t.status === 'completed').length).toFixed(2) : 0}`,
        'Details': 'Average value of completed transactions'
      }
    ];

    // Generate category analysis
    const categoryData = {};
    filteredTransactions.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { count: 0, revenue: 0, completed: 0, pending: 0, failed: 0 };
      }
      categoryData[t.category].count++;
      if (t.status === 'completed') {
        categoryData[t.category].revenue += (t.amount || 0);
        categoryData[t.category].completed++;
      } else if (t.status === 'pending') {
        categoryData[t.category].pending++;
      } else if (t.status === 'failed') {
        categoryData[t.category].failed++;
      }
    });

    const categoryAnalysis = Object.entries(categoryData).map(([category, data]) => ({
      'Category': category,
      'Total Transactions': data.count,
      'Completed': data.completed,
      'Pending': data.pending,
      'Failed': data.failed,
      'Revenue (₹)': data.revenue.toLocaleString('en-IN'),
      'Success Rate (%)': data.count > 0 ? ((data.completed / data.count) * 100).toFixed(1) : 0,
      'Average Value (₹)': data.completed > 0 ? (data.revenue / data.completed).toFixed(2) : 0
    }));

    // Export multiple sheets if needed, or create a comprehensive single file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

    // Export detailed transactions
    exportToCSV(reportData, `transactions_detailed_report_${timeFilter}_${timestamp}.csv`);

    // Small delay to allow first download to start
    setTimeout(() => {
      exportToCSV(summaryData, `transactions_summary_${timeFilter}_${timestamp}.csv`);
    }, 500);

    setTimeout(() => {
      exportToCSV(categoryAnalysis, `category_analysis_${timeFilter}_${timestamp}.csv`);
    }, 1000);

    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  // Process transaction data for analytics using useMemo for performance
  const analytics = useMemo(() => {
    if (!transactionData || !transactionData.data) {
      // Return a default state if data is not available yet
      return {
        totalRevenue: 0, totalTransactions: 0, successRate: 0, avgOrderValue: 0,
        dailyData: [], categoryChartData: [], statusData: [], planData: []
      };
    }

    const now = new Date();
    let startDate, endDate;
    let daysToTrack = 30; // default for chart generation

    if (timeFilter === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
      daysToTrack = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
    } else if (timeFilter === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      daysToTrack = 1;
    } else if (timeFilter === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      daysToTrack = 7;
    } else if (timeFilter === 'all') {
      // For all time, find the earliest transaction or use default
      const earliestTransaction = transactionData.data.length > 0
        ? new Date(Math.min(...transactionData.data.map(t => new Date(t.createdAt))))
        : new Date('2020-01-01');
      startDate = earliestTransaction;
      endDate = now;
      daysToTrack = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
      // Limit to reasonable number for chart rendering
      daysToTrack = Math.min(daysToTrack, 365);
    } else {
      // Default fallback to all time
      startDate = new Date('2020-01-01');
      endDate = now;
      daysToTrack = 30;
    }

    // Filter transactions based on the selected time filter
    const filteredTransactions = transactionData.data.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const totalRevenue = filteredTransactions.reduce((sum, t) => {
      if (t.status === 'completed' && t.amount && !isNaN(Number(t.amount))) {
        return sum + Number(t.amount);
      }
      return sum;
    }, 0);

    const totalTransactions = filteredTransactions.length;
    const completedTransactions = filteredTransactions.filter(t => t.status == 'completed').length;
    const successRate = totalTransactions > 0 ? (completedTransactions / totalTransactions * 100).toFixed(1) : 0;
    const avgOrderValue = completedTransactions > 0 ? (totalRevenue / completedTransactions).toFixed(2) : 0;

    // Daily trend data - adjust for different periods
    const dailyData = [];
    if (timeFilter === 'today') {
      // For today, show hourly data
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(startDate);
        hourStart.setHours(i, 0, 0, 0);
        const hourEnd = new Date(startDate);
        hourEnd.setHours(i, 59, 59, 999);

        const hourTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.createdAt);
          return tDate >= hourStart && tDate <= hourEnd;
        });

        dailyData.push({
          date: `${i.toString().padStart(2, '0')}:00`,
          revenue: hourTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
          transactions: hourTransactions.length,
          users: new Set(hourTransactions.map(t => t.user._id)).size
        });
      }
    } else if (timeFilter === 'all' && daysToTrack > 90) {
      // For all time with long periods, show monthly data
      const monthsToShow = Math.min(12, Math.ceil(daysToTrack / 30));
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const monthStart = new Date(endDate);
        monthStart.setMonth(monthStart.getMonth() - i);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        monthEnd.setHours(23, 59, 59, 999);

        const monthTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.createdAt);
          return tDate >= monthStart && tDate <= monthEnd;
        });

        dailyData.push({
          date: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: monthTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
          transactions: monthTransactions.length,
          users: new Set(monthTransactions.map(t => t.user._id)).size
        });
      }
    } else {
      // For other periods, show daily data
      const daysToShow = Math.min(daysToTrack, 30); // Limit to 30 days for readability
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
        const dayTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.createdAt);
          return tDate.toDateString() === date.toDateString();
        });

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
          transactions: dayTransactions.length,
          users: new Set(dayTransactions.map(t => t.user._id)).size
        });
      }
    }

    // Category analysis
    const categoryData = {};
    filteredTransactions.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { count: 0, revenue: 0, completed: 0 };
      }
      categoryData[t.category].count++;
      if (t.status === 'completed') {
        categoryData[t.category].revenue += t.amount;
        categoryData[t.category].completed++;
      }
    });

    const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
      category: category.length > 15 ? category.substring(0, 15) + '...' : category,
      fullCategory: category || subcategory,
      revenue: data.revenue,
      transactions: data.count,
      successRate: data.count > 0 ? ((data.completed / data.count) * 100).toFixed(1) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    // Status distribution
    const statusData = [
      { name: 'Completed', value: filteredTransactions.filter(t => t.status === 'completed').length, color: '#10B981' },
      { name: 'Pending', value: filteredTransactions.filter(t => t.status === 'pending').length, color: '#F59E0B' },
      { name: 'Failed', value: filteredTransactions.filter(t => t.status === 'failed').length, color: '#EF4444' }
    ];

    // Plan distribution
    const planData = [
      { name: 'Monthly', value: filteredTransactions.filter(t => t.plan === 'monthly').length, color: '#3B82F6' },
      { name: 'Yearly', value: filteredTransactions.filter(t => t.plan === 'yearly').length, color: '#8B5CF6' }
    ];

    return {
      totalRevenue,
      totalTransactions,
      successRate,
      avgOrderValue,
      dailyData,
      categoryChartData,
      statusData,
      planData
    };
  }, [timeFilter, transactionData, customStartDate, customEndDate]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message} />;
  }

  const timeFilterText = {
      'today': 'Today',
      '7d': 'Last 7 Days',
      'all': 'All Time',
      'custom': 'Custom Range',
  }[timeFilter];

  

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    if (value === 'custom') {
      setShowCustomDatePicker(true);
      // Set default dates for custom range
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      setCustomStartDate(lastWeek.toISOString().split('T')[0]);
      setCustomEndDate(today.toISOString().split('T')[0]);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Add the chart styles */}
      <style>{chartStyles}</style>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 hidden sm:block">Comprehensive insights into your KYC verification platform</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 md:mt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <select
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={timeFilter}
                onChange={(e) => handleTimeFilterChange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="custom">Custom Range</option>
              </select>

              {showCustomDatePicker && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 sm:mt-0 p-2 bg-white border border-gray-300 rounded-lg shadow-sm w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">From:</label>
                    <input
                      type="date"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      max={customEndDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <label className="text-sm text-gray-600">To:</label>
                    <input
                      type="date"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      min={customStartDate}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2 sm:mt-0 ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={generateDetailedReport}
              disabled={isExporting || !transactionData?.data || (timeFilter === 'custom' && (!customStartDate || !customEndDate))}
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          color="green"
        />
        <MetricCard
          title="Total Transactions"
          value={analytics.totalTransactions.toLocaleString()}
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${analytics.avgOrderValue}`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrendChart
          data={analytics.dailyData}
          dataKey="revenue"
          title={`Revenue Trend (${timeFilterText})`}
          color="#10B981"
        />
        <TrendChart
          data={analytics.dailyData}
          dataKey="transactions"
          title={`Transaction Volume (${timeFilterText})`}
          color="#3B82F6"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value,
                  name === 'revenue' ? 'Revenue' : 'Transactions'
                ]}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Category Deep Dive</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Transactions</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Success Rate</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Value</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categoryChartData.map((category, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{category.fullCategory}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    ₹{category.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right">{category.transactions}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseFloat(category.successRate) >= 80
                        ? 'bg-green-100 text-green-800'
                        : parseFloat(category.successRate) >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    ₹{category.transactions > 0 ? Math.round(category.revenue / category.transactions).toLocaleString('en-IN') : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}