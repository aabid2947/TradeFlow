"use client"

import { useMemo } from "react";
import { TrendingUp, Users, CheckCircle, BarChart2 } from "lucide-react" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { date: "14 Jun", kyc: 400, business: 300 }, { date: "15 Jun", kyc: 500, business: 400 }, { date: "16 Jun", kyc: 600, business: 500 }, { date: "17 Jun", kyc: 800, business: 600 }, { date: "18 Jun", kyc: 900, business: 700 }, { date: "19 Jun", kyc: 1000, business: 800 }, { date: "20 Jun", kyc: 1100, business: 900 }, { date: "21 Jun", kyc: 1200, business: 1000 }, { date: "22 Jun", kyc: 1300, business: 1100 }, { date: "23 Jun", kyc: 1200, business: 1200 }, { date: "24 Jun", kyc: 1100, business: 1300 }, { date: "25 Jun", kyc: 1000, business: 1200 }, { date: "26 Jun", kyc: 1100, business: 1100 }, { date: "27 Jun", kyc: 1200, business: 1000 }, { date: "28 Jun", kyc: 1400, business: 1100 },
];

/**
 * An analytics component for the Admin Dashboard.
 * @param {object} props
 * @param {Array} props.transactions - An array containing ALL transactions from ALL users.
 * @param {boolean} props.isLoading - The loading state from the API query.
 */
export default function Analytics({ transactions, isLoading }) {

  const statsData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [
        { title: "Total Verifications", value: "0", Icon: CheckCircle, color: "bg-blue-500", textColor: "text-white" },
        { title: "Top Service Used", value: "N/A", Icon: TrendingUp, color: "bg-green-500", textColor: "text-white" },
        { title: "2nd Most Used", value: "N/A", Icon: TrendingUp, color: "bg-orange-500", textColor: "text-white" },
        { title: "3rd Most Used", value: "N/A", Icon: TrendingUp, color: "bg-red-500", textColor: "text-white" },
      ];
    }

    const totalVerifications = transactions.length;


    const serviceCounts = transactions.reduce((acc, transaction) => {
      const serviceName = transaction.service?.name || 'Unknown Service';
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    //SORT SERVICES BY USAGE to find the top ones
    const sortedServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topServiceCards = [
      { Icon: TrendingUp, color: "bg-green-500", textColor: "text-white" },
      { Icon: TrendingUp, color: "bg-orange-500", textColor: "text-white" },
      { Icon: TrendingUp, color: "bg-red-500", textColor: "text-white" },
    ].map((card, index) => {
      if (sortedServices[index]) {
        // Return a card with real data if a top service exists at this index
        return {
          ...card,
          title: sortedServices[index].name,
          value: sortedServices[index].count.toLocaleString(),
        };
      }
      // Return a placeholder card if there are fewer than 3 unique services used
      return { ...card, title: `Top Service #${index + 2}`, value: '0' };
    });

 
    return [
      {
        title: "Total Verifications",
        value: totalVerifications.toLocaleString(),
        Icon: CheckCircle,
        color: "bg-blue-500",
        textColor: "text-white"
      },
      ...topServiceCards
    ];
  }, [transactions]);


  // Display skeleton loaders while fetching data
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
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
                  <p className={`text-sm font-medium ${stat.textColor} opacity-90 mb-1`}>{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                {stat.Icon && <stat.Icon className={`w-8 h-8 ${stat.textColor} opacity-80`} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Statistics Chart */}
      <Card className="mb-6 shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Platform-Wide API Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
                <Line type="monotone" dataKey="kyc" stroke="#3b82f6" strokeWidth={2} dot={false} name="KYC Verifications"/>
                <Line type="monotone" dataKey="business" stroke="#f97316" strokeWidth={2} dot={false} name="Business Verifications" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}