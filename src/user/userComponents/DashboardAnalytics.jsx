"use client"

import { useMemo ,useEffect} from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, ChartSkeleton } from "@/components/skeletons/Skeletons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";

// Mock chart data, can be replaced with real data if available
const chartData = [
    { date: "14 Jun", kyc: 0.4, business: 0.3 }, { date: "15 Jun", kyc: 0.5, business: 0.4 }, { date: "16 Jun", kyc: 0.6, business: 0.5 }, { date: "17 Jun", kyc: 0.8, business: 0.6 }, { date: "18 Jun", kyc: 0.9, business: 0.7 }, { date: "19 Jun", kyc: 1.0, business: 0.8 }, { date: "20 Jun", kyc: 1.1, business: 0.9 }, { date: "21 Jun", kyc: 1.2, business: 1.0 }, { date: "22 Jun", kyc: 1.3, business: 1.1 }, { date: "23 Jun", kyc: 1.2, business: 1.2 }, { date: "24 Jun", kyc: 1.1, business: 1.3 }, { date: "25 Jun", kyc: 1.0, business: 1.2 }, { date: "26 Jun", kyc: 1.1, business: 1.1 }, { date: "27 Jun", kyc: 1.2, business: 1.0 }, { date: "28 Jun", kyc: 1.4, business: 1.1 },
];

export default function DashboardAnalytics({ transactions, isLoading }) {
  const userInfo = useSelector(selectCurrentUser);

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])
  

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

    // Sort services from userInfo.usedServices by usage count
    const sortedServices = [...userInfo.usedServices]
      .sort((a, b) => b.usageCount - a.usageCount)
      .map(service => ({
          // The user mentioned serviceName will be added in the future.
          // For now, we look it up from the transactions prop.
          // 'service' from usedServices is assumed to be the service ID.
          name: serviceNameMap[service.service] || service.serviceName || 'Unknown Service',
          count: service.usageCount
      }));

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


    if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <Card className="mb-6 shadow-sm border-[#1A89C1] ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">API Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis domain={[0, 1.6]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                <Line type="monotone" dataKey="kyc" stroke="#3b82f6" strokeWidth={2} dot={false} name="KYC Verification"/>
                <Line type="monotone" dataKey="business" stroke="#f97316" strokeWidth={2} dot={false} name="Business Verification" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}