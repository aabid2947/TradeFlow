"use client"

import { useMemo, useEffect, useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, ChartSkeleton } from "@/components/skeletons/Skeletons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";

export default function DashboardAnalytics({ transactions, isLoading }) {
  const userInfo = useSelector(selectCurrentUser);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [])

  // Generate time series data from actual timestamps
  const generateTimeSeriesData = (services) => {
    if (services.length === 0) return [];

    // Get all timestamps from selected services
    const allTimestamps = [];
    services.forEach(service => {
      if (service.usageTimestamps && service.usageTimestamps.length > 0) {
        service.usageTimestamps.forEach(timestamp => {
          allTimestamps.push(new Date(timestamp));
        });
      }
    });

    if (allTimestamps.length === 0) {
      // Fallback to simulated data if no timestamps exist
      return generateFallbackData(services);
    }

    // Find date range
    const minDate = new Date(Math.min(...allTimestamps));
    const maxDate = new Date(Math.max(...allTimestamps));
    const today = new Date();

    // Use a reasonable date range (last 30 days or from first usage to today)
    const startDate = new Date(Math.max(
      minDate.getTime(),
      today.getTime() - (30 * 24 * 60 * 60 * 1000) // 30 days ago
    ));
    const endDate = new Date(Math.max(maxDate.getTime(), today.getTime()));

    // Generate date range
    const dateRange = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count usage per day for each service
    return dateRange.map(date => {
      const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const dataPoint = { date: dateStr, fullDate: date };

      services.forEach(service => {
        let dailyCount = 0;

        if (service.usageTimestamps && service.usageTimestamps.length > 0) {
          dailyCount = service.usageTimestamps.filter(timestamp => {
            const timestampDate = new Date(timestamp);
            return timestampDate.toDateString() === date.toDateString();
          }).length;
        }

        dataPoint[service.service] = dailyCount;
      });

      return dataPoint;
    });
  };

  // Fallback data generation for services without timestamps
  const generateFallbackData = (services) => {
    // Generate last 15 days of data
    const dates = [];
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
    }

    return dates.map((date, index) => {
      const dataPoint = { date };

      services.forEach(service => {
        // Simulate realistic usage patterns based on total usage count
        const totalUsage = service.usageCount;
        const baseUsage = Math.max(0, totalUsage / 15); // Average per day

        // Add some randomness and trend
        const randomFactor = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
        const trendFactor = (index / 14) * 0.5 + 0.75; // Slight upward trend

        const dailyUsage = Math.round(baseUsage * randomFactor * trendFactor);
        dataPoint[service.service] = Math.max(0, dailyUsage);
      });

      return dataPoint;
    });
  };

  const chartData = useMemo(() => {
    if (!userInfo || !userInfo.usedServices || selectedServices.length === 0) {
      return [];
    }

    return generateTimeSeriesData(selectedServices);
  }, [userInfo, selectedServices]);

  // Check if any selected services have timestamp data
  const hasTimestampData = useMemo(() => {
    return selectedServices.some(service =>
      service.usageTimestamps && service.usageTimestamps.length > 0
    );
  }, [selectedServices]);

  // Available services for selection
  const availableServices = useMemo(() => {
    if (!userInfo || !userInfo.usedServices) return [];

    // Create a completely new array with new objects to avoid read-only issues
    const servicesCopy = userInfo.usedServices.map(service => ({
      id: service.service,
      name: service.serviceName || 'Unknown Service',
      usageCount: service.usageCount,
      service: service.service,
      usageTimestamps: service.usageTimestamps ? [...service.usageTimestamps] : [],
      hasTimestamps: service.usageTimestamps && service.usageTimestamps.length > 0
    }));

    return servicesCopy.sort((a, b) => b.usageCount - a.usageCount);
  }, [userInfo]);

  // Colors for different lines
  const lineColors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#f59e0b'];

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.service === service.service);

      if (isSelected) {
        // Remove service
        return prev.filter(s => s.service !== service.service);
      } else if (prev.length < 3) {
        // Add service (max 3)
        return [...prev, service];
      }

      return prev;
    });
  };

  // Initialize with top 2 services
  useEffect(() => {
    if (availableServices.length > 0 && selectedServices.length === 0) {
      setSelectedServices(availableServices.slice(0, 2));
    }
  }, [availableServices]);

  const statsData = useMemo(() => {
    if (!userInfo || !userInfo.usedServices || userInfo.usedServices.length === 0) {
      return [
        { title: "Total Verifications", value: "0", change: "+0%", color: "bg-orange-500", textColor: "text-white" },
        { title: "Top Service Used", value: "N/A", change: "", color: "bg-blue-500", textColor: "text-white" },
        { title: "2nd Most Used", value: "N/A", change: "", color: "bg-red-500", textColor: "text-white" },
        { title: "3rd Most Used", value: "N/A", change: "", color: "bg-green-500", textColor: "text-white" },
      ];
    }

    // Create a map of service IDs to service names from the transactions list
    const serviceNameMap = transactions.reduce((map, transaction) => {
        if (transaction.service && transaction.service._id && transaction.service.name) {
            map[transaction.service._id] = transaction.service.name;
        }
        return map;
    }, {});

    // Calculate total verifications from userInfo.usedServices
    const totalVerifications = userInfo.usedServices.reduce((acc, service) => acc + service.usageCount, 0);

    // Create a completely new array with new objects to avoid read-only issues
    const sortedServices = userInfo.usedServices
      .map(service => ({
        // The user mentioned serviceName will be added in the future.
        // For now, we look it up from the transactions prop.
        // 'service' from usedServices is assumed to be the service ID.
        name: serviceNameMap[service.service] || service.serviceName || 'Unknown Service',
        count: service.usageCount
      }))
      .sort((a, b) => b.count - a.count);

    // Create the top service cards
    const topServiceCards = [
      { title: "Top Service Used", color: "bg-blue-500", textColor: "text-white" },
      { title: "2nd Most Used", color: "bg-red-500", textColor: "text-white" },
      { title: "3rd Most Used", color: "bg-green-500", textColor: "text-white" },
    ].map((card, index) => {
      if (sortedServices[index]) {
        const percentage = totalVerifications > 0 ? ((sortedServices[index].count / totalVerifications) * 100).toFixed(1) : "0";
        return {
          ...card,
          title: sortedServices[index].name,
          value: sortedServices[index].count.toLocaleString(),
          change: `${percentage}%`,
        };
      }
      return { ...card, value: '0', change: "0%" };
    });

    return [
      {
        title: "Total Verifications",
        value: totalVerifications.toLocaleString(),
        change: "+100%", // This can be adjusted based on a comparison period if available
        color: "bg-orange-500",
        textColor: "text-white"
      },
      ...topServiceCards
    ];
  }, [userInfo, transactions]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

    if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Loading Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Chart Skeleton */}
        <ChartSkeleton />

        {/* Additional loading indicators */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0 shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${stat.textColor} opacity-90 mb-1`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1">
                    <span className={`text-sm ${stat.textColor} opacity-90`}>{stat.change}</span>
                    <TrendingUp className={`w-4 h-4 ${stat.textColor}`} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Usage Trend Chart */}
      <Card className="mb-6 shadow-sm border-[#1A89C1]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg mt-2 font-semibold text-gray-900">Service Usage Trends</CardTitle>
              {selectedServices.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {hasTimestampData ? 'Real usage data over time' : 'Simulated data (no timestamps available)'}
                </p>
              )}
            </div>

            {/* Service Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-sm font-medium">
                  {selectedServices.length === 0
                    ? 'Select Services'
                    : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                  }
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Select 2-3 services to compare</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedServices.length}/3 services selected
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {availableServices.map((service, index) => {
                      const isSelected = selectedServices.some(s => s.service === service.service);
                      const canSelect = selectedServices.length < 3 || isSelected;

                      return (
                        <button
                          key={service.service}
                          onClick={() => handleServiceToggle(service)}
                          disabled={!canSelect}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors ${
                            isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          } ${!canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {service.name}
                                </p>
                                {service.hasTimestamps && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex-shrink-0">
                                    Real data
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {service.usageCount} total uses
                                {service.hasTimestamps && ` • ${service.usageTimestamps.length} timestamps`}
                              </p>
                            </div>
                            {isSelected && (
                              <div
                                className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                                style={{ backgroundColor: lineColors[selectedServices.findIndex(s => s.service === service.service)] }}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pr-1 sm:pr-4 pl-4 sm:pl-6">
          {chartData.length > 0 ? (
            <div 
              className="h-80 w-full focus:outline-none" 
              style={{ outline: 'none !important' }}
              onFocus={(e) => e.target.blur()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  style={{ outline: 'none' }}
                  onFocus={(e) => e.preventDefault()}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    interval="preserveStartEnd"
                    minTickGap={20}
                    style={{ outline: 'none' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    label={{ value: 'Daily Usage', angle: -90, position: 'insideLeft', offset: 10 }}
                    allowDecimals={false}
                    style={{ outline: 'none' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    height={36}
                    iconType="line"
                    wrapperStyle={{ paddingBottom: "20px", outline: 'none' }}
                    formatter={(value) => <span className="text-gray-700 truncate block" style={{ maxWidth: '120px' }}>{value}</span>}
                  />
                  {selectedServices.map((service, index) => (
                    <Line
                      key={service.service}
                      type="monotone"
                      dataKey={service.service}
                      stroke={lineColors[index]}
                      strokeWidth={2}
                      dot={{ r: 4, style: { outline: 'none' } }}
                      name={service.name}
                      style={{ outline: 'none' }}
                      tabIndex={-1}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-gray-500 text-lg">
                  {availableServices.length === 0
                    ? 'No service usage data available'
                    : 'Select 2-3 services to view trends'
                  }
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {availableServices.length === 0
                    ? 'Start using services to see your usage statistics'
                    : 'Use the dropdown above to choose services for comparison'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}