"use client"

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { ArrowRight, Sparkles, Users, DollarSign, CheckSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";


/**
 * @param {object} props
 * @param {Array} props.users - An array of all user objects.
 * @param {Array} props.transactions - An array of all transaction objects.
 * @param {boolean} props.isLoading - The combined loading state.
 */
export default function DashboardOverview({ users, transactions, isLoading }) {

  const overviewData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter users registered this month
    const newUsersThisMonth = users.filter(user => 
        new Date(user.createdAt) >= startOfMonth
    );

    // Filter transactions that happened this month
    const transactionsThisMonth = transactions.filter(t => 
        new Date(t.timestamp) >= startOfMonth
    );

    // Calculate revenue generated this month
    const revenueThisMonth = transactionsThisMonth.reduce((acc, curr) => {
        return acc + (curr.service?.price || 0);
    }, 0);

    return [
        {
            title: "New Users This Month",
            value: newUsersThisMonth.length.toLocaleString(),
            Icon: Users,
            chartColor: "#3b82f6", 
        },
        {
            title: "Revenue This Month",
            // Format to currency
            value: `₹${revenueThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            Icon: DollarSign,
            chartColor: "#22c55e",
        },
        {
            title: "Verifications This Month",
            value: transactionsThisMonth.length.toLocaleString(),
            Icon: CheckSquare,
            chartColor: "#f97316", 
        },
    ];
  }, [users, transactions]);


  // Show skeletons while data is being fetched
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
                <LineChart data={[{uv:0}, {uv:20}, {uv:15}, {uv:40}, {uv:50}]}>
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke={item.chartColor}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
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