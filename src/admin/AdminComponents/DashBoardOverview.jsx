"use client"

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight, Sparkles, Users, DollarSign, CheckSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview({ users, transactions, isLoading }) {

  const { overviewData, chartData } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        date: new Date(now.getFullYear(), now.getMonth(), i + 1).toLocaleDateString('en-US', { day: 'numeric' }),
        users: 0,
        revenue: 0,
        verifications: 0,
    }));

    const newUsersThisMonth = users.filter(user => new Date(user.createdAt) >= startOfMonth);
    newUsersThisMonth.forEach(user => {
        const dayIndex = new Date(user.createdAt).getDate() - 1;
        if (dailyData[dayIndex]) dailyData[dayIndex].users += 1;
    });

    const transactionsThisMonth = transactions.filter(t => new Date(t.timestamp) >= startOfMonth);
    transactionsThisMonth.forEach(t => {
        const dayIndex = new Date(t.timestamp).getDate() - 1;
        if (dailyData[dayIndex]) {
            dailyData[dayIndex].verifications += 1;
            dailyData[dayIndex].revenue += t.service?.price || 0;
        }
    });

    const totalRevenue = transactionsThisMonth.reduce((acc, curr) => acc + (curr.service?.price || 0), 0);

    const overview = [
        { title: "New Users This Month", value: newUsersThisMonth.length.toLocaleString(), Icon: Users, chartKey: "users", chartColor: "#3b82f6" },
        { title: "Revenue This Month", value: `₹${totalRevenue.toLocaleString('en-IN')}`, Icon: DollarSign, chartKey: "revenue", chartColor: "#22c55e" },
        { title: "Verifications This Month", value: transactionsThisMonth.length.toLocaleString(), Icon: CheckSquare, chartKey: "verifications", chartColor: "#f97316" },
    ];

    return { overviewData: overview, chartData: dailyData };
  }, [users, transactions]);

  if (isLoading) {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">This Month's Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => (
          <Card key={index} className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-700">{item.title}</CardTitle>
                <item.Icon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
            </CardHeader>
            <CardContent className="h-20 p-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ccc' }} />
                  <Line type="monotone" dataKey={item.chartKey} stroke={item.chartColor} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col justify-between bg-gray-800 text-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Explore Full Reports</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Dive deeper into user behavior and transaction details.
            </p>
          </div>
          <Button className="w-full bg-white hover:bg-gray-200 text-gray-800 font-medium rounded-md flex items-center justify-center gap-2">
            Get Insights <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}