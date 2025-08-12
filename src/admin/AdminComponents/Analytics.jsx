"use client"

import { useMemo, useState,useEffect } from "react";
import { TrendingUp, TrendingDown, Package, Calendar, BarChart3, Users, Filter, X, GitCompare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Mock data for demonstration - replace with actual API data
const generateMockUsageData = (services, timeInterval = 'alltime') => {
  let data = [];

  if (timeInterval === 'today') {
    // Generate hourly data for today
    for (let i = 0; i < 24; i++) {
      const entry = {
        date: `${i.toString().padStart(2, '0')}:00`,
        total: Math.floor(Math.random() * 100) + 20
      };

      // Add individual service data
      services?.forEach(service => {
        entry[service.service_key] = Math.floor(Math.random() * 20) + 5;
      });

      data.push(entry);
    }
  } else if (timeInterval === '7d') {
    // Generate daily data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const entry = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: Math.floor(Math.random() * 500) + 200
      };

      // Add individual service data
      services?.forEach(service => {
        entry[service.service_key] = Math.floor(Math.random() * 100) + 25;
      });

      data.push(entry);
    }
  } else if (timeInterval === 'alltime') {
    // Generate monthly data for all time (last 12 months)
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const entry = {
        date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        total: Math.floor(Math.random() * 1000) + 300
      };

      // Add individual service data
      services?.forEach(service => {
        entry[service.service_key] = Math.floor(Math.random() * 150) + 30;
      });

      data.push(entry);
    }
  } else if (timeInterval === 'custom') {
    // For custom, generate sample data (in real implementation, this would use custom date range)
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const entry = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: Math.floor(Math.random() * 400) + 150
      };

      // Add individual service data
      services?.forEach(service => {
        entry[service.service_key] = Math.floor(Math.random() * 80) + 20;
      });

      data.push(entry);
    }
  }

  return data;
};

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

/**
 * Advanced Analytics component for the Admin Dashboard.
 * @param {object} props
 * @param {Array} props.services - An array containing ALL available services.
 * @param {boolean} props.isLoading - The loading state from the API query.
 */
export default function Analytics({ services = [], isLoading = false }) {
  const [timeInterval, setTimeInterval] = useState('alltime');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [analysisView, setAnalysisView] = useState('overview');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Generate mock usage data based on time interval
  const usageData = useMemo(() =>
    generateMockUsageData(services, timeInterval),
    [services, timeInterval]
  );

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(services.map(s => s.category))];
    // Filter out empty strings, null, undefined values
    return cats.filter(cat => cat && typeof cat === 'string' && cat.trim() !== '');
  }, [services]);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter(s => s.category === selectedCategory);
  }, [services, selectedCategory]);

  // Calculate category performance
  const categoryPerformance = useMemo(() => {
    const categoryStats = {};

    services.forEach(service => {
      if (!categoryStats[service.category]) {
        categoryStats[service.category] = {
          name: service.category,
          totalUsage: 0,
          serviceCount: 0,
          averagePrice: 0,
          totalRevenue: 0
        };
      }

      categoryStats[service.category].totalUsage += service.globalUsageCount || 0;
      categoryStats[service.category].serviceCount += 1;
      categoryStats[service.category].averagePrice += service.price || 0;
      categoryStats[service.category].totalRevenue += (service.globalUsageCount || 0) * (service.price || 0);
    });

    return Object.values(categoryStats).map(cat => ({
      ...cat,
      averagePrice: cat.averagePrice / cat.serviceCount
    })).sort((a, b) => b.totalUsage - a.totalUsage);
  }, [services]);

  // Top performing services for time interval
  const topPerformingServices = useMemo(() => {
    return [...filteredServices]
      .sort((a, b) => (b.globalUsageCount || 0) - (a.globalUsageCount || 0))
      .slice(0, 10);
  }, [filteredServices]);

  const statsData = useMemo(() => {
    const placeholder = [
      { title: "Total Services", name: null, value: "0", Icon: Package, color: "bg-blue-500", textColor: "text-white" },
      { title: "Top Used Service", name: "N/A", value: "", Icon: TrendingUp, color: "bg-green-500", textColor: "text-white" },
      { title: "2nd Most Used", name: "N/A", value: "", Icon: TrendingUp, color: "bg-orange-500", textColor: "text-white" },
      { title: "Least Used Service", name: "N/A", value: "", Icon: TrendingDown, color: "bg-red-500", textColor: "text-white" },
    ];

    if (!services || services.length === 0) {
      return placeholder;
    }

    const totalServices = services.length;
    const sortedByMostUsed = [...services]
      .sort((a, b) => (b.globalUsageCount || 0) - (a.globalUsageCount || 0));
    const usedServices = services.filter(s => s.globalUsageCount > 0);
    const sortedByLeastUsed = [...usedServices]
      .sort((a, b) => (a.globalUsageCount || 0) - (b.globalUsageCount || 0));

    const topService = sortedByMostUsed[0];
    const secondTopService = sortedByMostUsed[1];
    const leastUsedService = sortedByLeastUsed[0];

    return [
      {
        title: "Total Services",
        name: null,
        value: totalServices.toLocaleString(),
        Icon: Package,
        color: "bg-blue-500",
        textColor: "text-white"
      },
      {
        title: "Top Used Service",
        name: topService ? topService.name : "N/A",
        value: topService ? topService.globalUsageCount.toLocaleString() : "",
        Icon: TrendingUp,
        color: "bg-green-500",
        textColor: "text-white"
      },
      {
        title: "2nd Most Used",
        name: secondTopService ? secondTopService.name : "N/A",
        value: secondTopService ? secondTopService.globalUsageCount.toLocaleString() : "",
        Icon: TrendingUp,
        color: "bg-orange-500",
        textColor: "text-white"
      },
      {
        title: "Least Used Service",
        name: leastUsedService ? leastUsedService.name : "N/A",
        value: leastUsedService ? leastUsedService.globalUsageCount.toLocaleString() : "",
        Icon: TrendingDown,
        color: "bg-red-500",
        textColor: "text-white"
      },
    ];
  }, [services]);

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])

  const handleServiceComparison = (serviceKey) => {
    if (selectedServices.includes(serviceKey)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceKey));
    } else if (selectedServices.length < 3) {
      setSelectedServices([...selectedServices, serviceKey]);
    }
  };

  const handleTimeIntervalChange = (value) => {
    setTimeInterval(value);
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

  const getTimeIntervalText = () => {
    switch (timeInterval) {
      case 'today':
        return 'Today (Hourly)';
      case '7d':
        return 'Last 7 Days';
      case 'alltime':
        return 'All Time (Monthly)';
      case 'custom':
        return customStartDate && customEndDate
          ? `${new Date(customStartDate).toLocaleDateString('en-IN')} - ${new Date(customEndDate).toLocaleDateString('en-IN')}`
          : 'Custom Range';
      default:
        return 'All Time (Monthly)';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Add the chart styles */}
      <style>{chartStyles}</style>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0 shadow-sm`}>
            <CardContent className="p-4 flex flex-col justify-between h-28">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} opacity-90 mb-1`}>{stat.title}</p>
                  {stat.name && (
                    <p className={`text-sm font-semibold ${stat.textColor} truncate `}>{stat.name}</p>
                  )}
                </div>
                {stat.Icon && <stat.Icon className={`w-8 h-8 ${stat.textColor} opacity-80 flex-shrink-0`} />}
              </div>
              <p className={`text-3xl font-bold ${stat.textColor} self-start`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Controls */}
      <Card className="mb-6 shadow-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setAnalysisView('overview')}
                  className={`${analysisView === 'overview'
                      ? 'bg-white text-gray-900 border border-gray-300 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </Button>

                <Button
                  size="sm"
                  onClick={() => setAnalysisView('categories')}
                  className={`${analysisView === 'categories'
                      ? 'bg-white text-gray-900 border border-gray-300 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </div>

            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Select value={timeInterval} onValueChange={handleTimeIntervalChange}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="alltime">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                {showCustomDatePicker && (
                  <div className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">From:</label>
                      <input
                        type="date"
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={customEndDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">To:</label>
                      <input
                        type="date"
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        min={customStartDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {comparisonMode && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-900">Service Comparison (Select up to 3)</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setComparisonMode(false);
                    setSelectedServices([]);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredServices.map(service => (
                  <Button
                    key={service.service_key}
                    variant={selectedServices.includes(service.service_key) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleServiceComparison(service.service_key)}
                    disabled={!selectedServices.includes(service.service_key) && selectedServices.length >= 3}
                  >
                    {service.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Analytics Views */}
      {analysisView === 'overview' && (
        <>
          {/* Usage Trends Chart */}
          <Card className="mb-6 shadow-sm border-gray-200">
            <CardHeader className="my-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Service Usage Trends - {getTimeIntervalText()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total Usage" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Services Bar Chart */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="my-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPerformingServices} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Bar dataKey="globalUsageCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="my-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Service Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topPerformingServices.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          const percentage = (percent * 100).toFixed(0);
                          return percentage >= 20 ? `${name}: ${percentage}%` : `${percentage}%`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="globalUsageCount"
                      >
                        {topPerformingServices.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {analysisView === 'comparison' && comparisonMode && selectedServices.length > 0 && (
        <Card className="mb-6 shadow-sm border-gray-200">
          <CardHeader className="my-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Service Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                  {selectedServices.map((serviceKey, index) => {
                    const service = services.find(s => s.service_key === serviceKey);
                    return (
                      <Line
                        key={serviceKey}
                        type="monotone"
                        dataKey={serviceKey}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        name={service?.name || serviceKey}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisView === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="my-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Bar dataKey="totalUsage" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Revenue */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="my-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Category Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Bar dataKey="totalRevenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Stats Table */}
      {analysisView === 'categories' && (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardHeader className="my-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Detailed Category Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900">Category</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Services</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Total Usage</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Avg Price</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((category, index) => (
                    <tr key={category.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium text-gray-900">{category.name}</td>
                      <td className="px-4 py-3">{category.serviceCount}</td>
                      <td className="px-4 py-3">{category.totalUsage.toLocaleString()}</td>
                      <td className="px-4 py-3">₹{category.averagePrice.toFixed(2)}</td>
                      <td className="px-4 py-3">₹{category.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}