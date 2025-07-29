import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, CreditCard, Activity,
  Calendar, Filter, Download, Eye, Clock, MapPin, Smartphone,
  AlertTriangle, CheckCircle, XCircle, BarChart3,
  Target, Zap, Globe, ShoppingCart, Star, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useGetAllTransactionsQuery } from '@/app/api/transactionApiSlice.js'; // Adjust this import path as needed

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
  const [timeFilter, setTimeFilter] = useState('30d');
  
  // Fetch transaction data using the RTK Query hook
  const { data: transactionData, isLoading, isError, error } = useGetAllTransactionsQuery();

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
    let startDate;
    let daysToTrack;
    switch (timeFilter) {
      case '7d':
        daysToTrack = 7;
        break;
      case '90d':
        daysToTrack = 90;
        break;
      case '1y':
        daysToTrack = 365;
        break;
      default:
        daysToTrack = 30;
    }
    startDate = new Date(now.getTime() - daysToTrack * 24 * 60 * 60 * 1000);

    // Filter transactions based on the selected time filter
    const filteredTransactions = transactionData.data.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate;
    });
    console.log('Debugging transactions:');


const totalRevenue = filteredTransactions.reduce((sum, t) => {
  if (t.status === 'completed' && t.amount && !isNaN(Number(t.amount))) {
    return sum + Number(t.amount);
  }
  return sum;
}, 0);
    const totalTransactions = filteredTransactions.length;
    const completedTransactions = filteredTransactions.filter(t => t.status == 'completed').length;
    const successRate = totalTransactions > 0 ? (completedTransactions / totalTransactions * 100).toFixed(1) : 0;
    const avgOrderValue = completedTransactions > 0 ? (totalRevenue / completedTransactions).toFixed(0) : 0;

    // Daily trend data
    const dailyData = [];
    for (let i = daysToTrack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
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
      fullCategory: category,
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
  }, [timeFilter, transactionData]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message} />;
  }
  
  const timeFilterText = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days',
      '1y': 'Last Year',
  }[timeFilter];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your KYC verification platform</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
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

      {/* User Activity & Real-time Analytics (Static Data) */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {userActivityData.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{page.page}</p>
                  <p className="text-sm text-gray-600">{page.visitors} visitors</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{page.avgTime}s avg</p>
                  <p className="text-xs text-gray-500">{page.bounceRate}% bounce</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity (Static)</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          <div className="space-y-4">
           
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-4 h-4 text-blue-600" /></div>
                <div><p className="font-medium">Active Users</p><p className="text-sm text-gray-600">Currently online</p></div>
              </div>
              <span className="text-xl font-bold text-blue-600">127</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><Activity className="w-4 h-4 text-green-600" /></div>
                <div><p className="font-medium">Active Sessions</p><p className="text-sm text-gray-600">In progress</p></div>
              </div>
              <span className="text-xl font-bold text-green-600">89</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg"><Clock className="w-4 h-4 text-orange-600" /></div>
                <div><p className="font-medium">Avg Session</p><p className="text-sm text-gray-600">Duration</p></div>
              </div>
              <span className="text-xl font-bold text-orange-600">4m 32s</span>
            </div>
          </div>
        </div>
      </div> */}

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