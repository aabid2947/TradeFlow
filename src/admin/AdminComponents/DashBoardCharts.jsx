// import React, { useState, useEffect, useMemo } from "react";
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
//   XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend 
// } from "recharts";
// import { 
//   Users, Globe, Activity, Clock, Smartphone, MapPin, 
//   TrendingUp, Eye, Pause, Play, ZoomIn, ZoomOut, 
//   Maximize2, Filter, Download, AlertTriangle
// } from "lucide-react";
// import { useRealTimeUserActivity } from '@/firebase/useRealTimeUserActivity'; // Import the custom hook

// // A simple loader component
// const Loader = ({ message = "Initializing Real-time Analytics..." }) => (
//   <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-700">
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
//     <p className="text-lg font-semibold">{message}</p>
//     <p className="text-sm">Connecting to Firebase and fetching live data.</p>
//   </div>
// );

// // A simple error component
// const ErrorMessage = ({ message }) => (
//   <div className="flex flex-col items-center justify-center min-h-screen text-red-600 bg-red-50">
//     <AlertTriangle className="w-16 h-16 mb-4" />
//     <h2 className="text-2xl font-bold">An Error Occurred</h2>
//     <p className="text-lg mt-2">{message || "Failed to connect to real-time analytics."}</p>
//   </div>
// );

// // User journey data (can be made dynamic with custom backend logic)
// const userJourneySteps = [
//   { step: "Landing", users: 1000, conversion: 85, avgTime: 45 },
//   { step: "Registration", users: 850, conversion: 72, avgTime: 120 },
//   { step: "Email Verification", users: 612, conversion: 88, avgTime: 30 },
//   { step: "Profile Setup", users: 539, conversion: 95, avgTime: 180 },
//   { step: "Service Selection", users: 512, conversion: 68, avgTime: 240 },
//   { step: "Payment", users: 348, conversion: 92, avgTime: 90 },
//   { step: "Completion", users: 320, conversion: 100, avgTime: 60 }
// ];


// const StatCard = ({ title, value, change, icon: Icon, color = "blue", subtitle, trend }) => {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-600 border-blue-200",
//     green: "bg-green-50 text-green-600 border-green-200",
//     orange: "bg-orange-50 text-orange-600 border-orange-200",
//     purple: "bg-purple-50 text-purple-600 border-purple-200",
//   };

//   return (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-3">
//         <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//         {change !== undefined && (
//           <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
//             change > 0 ? 'bg-green-100 text-green-800' : change < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
//           }`}>
//             <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
//             {Math.abs(change)}%
//           </div>
//         )}
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//         <p className="text-sm text-gray-600">{title}</p>
//         {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//       </div>
//     </div>
//   );
// };

// export default function FirebaseUserActivityDashboard() {
//   const { realTimeData, loading, error, getAnalyticsData, isInitialized } = useRealTimeUserActivity(); // DEBUG: Added isInitialized
//   const [isLive, setIsLive] = useState(true);
//   const [mapZoom, setMapZoom] = useState(1);
//   const [hoveredLocation, setHoveredLocation] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState('activeSessions');
//   const [timeRange, setTimeRange] = useState('24h');
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
  
//   // DEBUG: Log the raw realTimeData whenever it changes
//   useEffect(() => {
//     console.log("DEBUG: Raw realTimeData from hook:", realTimeData);
//   }, [realTimeData]);

//   // Fetch aggregated analytics data when the component mounts or time range changes
//   useEffect(() => {
//     // DEBUG: Ensure the hook is initialized before fetching data
//     if (!isInitialized) {
//         console.log("DEBUG: Skipping analytics fetch because hook is not initialized.");
//         return;
//     }

//     const fetchData = async () => {
//       try {
//         console.log(`DEBUG: Fetching analytics for time range: ${timeRange}`);
//         const data = await getAnalyticsData(timeRange);
//         // DEBUG: Log the data that comes back from the analytics function
//         console.log("DEBUG: Aggregated analytics data received:", data);
//         setAnalytics(data);
//       } catch (err) {
//         console.error("Failed to fetch aggregated analytics:", err);
//       }
//     };
//     fetchData();
//   }, [timeRange, getAnalyticsData, isInitialized]); // DEBUG: Added isInitialized dependency

//   // Calculate high-level metrics
//   const metrics = useMemo(() => {
//     const dashboard = realTimeData.dashboardMetrics || {};
//     if (!analytics) {
//       // DEBUG: Log a message if analytics data isn't ready for calculation
//       console.log("DEBUG: Calculating metrics but analytics data is null.");
//       return {
//         totalUsers: dashboard.totalUsers || 0,
//         totalSessions: dashboard.activeSessions || 0,
//         avgSessionTime: 0,
//         avgBounceRate: 0,
//         avgConversionRate: 0,
//         activeRegions: 0,
//         deviceBreakdown: []
//       };
//     }
    
//     // DEBUG: Log a message when metrics are calculated successfully
//     console.log("DEBUG: Successfully calculating metrics with analytics data.", analytics);
//     return {
//       totalUsers: dashboard.totalUsers || analytics.uniqueUsers || 0,
//       totalSessions: dashboard.activeSessions || analytics.totalSessions || 0,
//       avgSessionTime: Math.floor(analytics.averageSessionDuration / 1000) || 0,
//       avgBounceRate: Math.floor(analytics.bounceRate) || 0,
//       avgConversionRate: Math.floor(analytics.engagementMetrics?.engagementRate) || 0,
//       activeRegions: realTimeData.locationAnalytics.filter(loc => loc.isActive).length,
//       deviceBreakdown: analytics.deviceBreakdown || []
//     };
//   }, [realTimeData, analytics]);

//   const deviceBreakdownForChart = metrics.deviceBreakdown.map((d, i) => {
//     const colors = ['#3B82F6', '#10B981', '#F59E0B'];
//     const total = metrics.deviceBreakdown.reduce((sum, dev) => sum + dev.value, 0);
//     return {
//       name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
//       value: d.value,
//       color: colors[i % colors.length],
//       percentage: total > 0 ? Math.floor((d.value / total) * 100) : 0
//     };
//   });

//   // DEBUG: Check the final data being passed to the chart right before rendering
//   console.log("DEBUG: Data for Hourly Chart:", analytics?.hourlyActivity);
//   console.log("DEBUG: Data for Device Chart:", deviceBreakdownForChart);
//   console.log("DEBUG: Data for Map:", realTimeData.locationAnalytics);
//   console.log("DEBUG: Data for Live Feed:", realTimeData.recentActivities);


//   if (loading && !analytics) {
//     return <Loader />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.3, 4));
//   const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.3, 0.5));

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Enhanced Header */}
//       <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Firebase User Activity Monitor</h1>
//             <p className="text-blue-100">Real-time global user analytics and behavior tracking</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsLive(!isLive)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
//                 isLive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
//               }`}
//             >
//               {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//               {isLive ? 'Live' : 'Paused'}
//             </button>
//             <div className="text-right">
//               <div className="text-sm opacity-90">Last Update</div>
//               <div className="font-mono text-lg">{new Date(realTimeData.dashboardMetrics?.lastActivity || Date.now()).toLocaleTimeString()}</div>
//             </div>
//           </div>
//         </div>
        
//         {/* Live Stats Row */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <div className="text-center">
//             <div className="text-3xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
//             <div className="text-sm opacity-90">Total Users</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">{metrics.totalSessions.toLocaleString()}</div>
//             <div className="text-sm opacity-90">Active Sessions</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">{Math.floor(metrics.avgSessionTime / 60)}m</div>
//             <div className="text-sm opacity-90">Avg Session</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">{metrics.activeRegions}</div>
//             <div className="text-sm opacity-90">Active Regions</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">{metrics.avgConversionRate}%</div>
//             <div className="text-sm opacity-90">Engagement Rate</div>
//           </div>
//         </div>
//       </div>

//        {/* Key Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Users Online Now"
//           value={metrics.totalUsers.toLocaleString()}
//           icon={Users}
//           color="green"
//         />
//         <StatCard
//           title="Active Sessions"
//           value={metrics.totalSessions.toLocaleString()}
//           icon={Activity}
//           color="blue"
//         />
//         <StatCard
//           title="Avg Session Duration"
//           value={`${Math.floor(metrics.avgSessionTime / 60)}m ${metrics.avgSessionTime % 60}s`}
//           icon={Clock}
//           color="orange"
//         />
//         <StatCard
//           title="Bounce Rate"
//           value={`${metrics.avgBounceRate}%`}
//           icon={TrendingUp}
//           color="purple"
//         />
//       </div>

//       {/* Main Dashboard Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
//         {/* Enhanced World Map */}
//         <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
//              <div>
//                <h3 className="text-xl font-bold text-gray-900 mb-1">Global User Distribution</h3>
//                <p className="text-sm text-gray-600">Real-time activity heatmap by location</p>
//              </div>
//              <div className="flex items-center gap-3">
//                <select 
//                  value={selectedMetric}
//                  onChange={(e) => setSelectedMetric(e.target.value)}
//                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                >
//                  <option value="activeSessions">Active Sessions</option>
//                  <option value="totalUsers">Total Users</option>
//                </select>
//                <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-lg">
//                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                  <span className="text-xs font-medium text-green-700">
//                    {metrics.activeRegions} regions live
//                  </span>
//                </div>
//              </div>
//            </div>

//            <div className="relative h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//             {/* Map Controls & Legend */}
//             <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
//               <button onClick={handleZoomIn} className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200"><ZoomIn className="h-4 w-4 text-gray-600" /></button>
//               <button onClick={handleZoomOut} className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200"><ZoomOut className="h-4 w-4 text-gray-600" /></button>
//               <button onClick={() => setMapZoom(1)} className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200"><Maximize2 className="h-4 w-4 text-gray-600" /></button>
//             </div>
            
//             <div className="w-full h-full flex items-center justify-center transition-transform duration-500" style={{ transform: `scale(${mapZoom})` }}>
//               <svg viewBox="0 0 1200 600" className="w-full h-full">
//                 {/* Simplified World Map Path */}
//                 <g fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1">
//                   <path d="M150 150 L300 140 L340 200 L320 280 L250 290 L180 250 Z M250 320 L320 310 L340 420 L300 480 L260 460 L240 380 Z M500 120 L600 110 L620 180 L580 200 L520 190 L510 150 Z M520 220 L600 210 L620 350 L580 420 L540 400 L525 300 Z M620 100 L850 90 L900 200 L870 280 L720 290 L640 220 Z M850 380 L950 370 L970 420 L940 450 L870 440 Z" />
//                 </g>

//                 {/* User Activity Points from Firebase */}
//                 {realTimeData.locationAnalytics.map((location) => {
//                   const x = ((location.lng + 180) / 360) * 1200;
//                   const y = ((90 - location.lat) / 180) * 600;
//                   const value = location[selectedMetric] || 0;
//                   const radius = Math.max(5, Math.min(Math.sqrt(value) * 2.5, 30));
//                   const activityLevel = value > 50 ? 'high' : value > 10 ? 'medium' : 'low';
                  
//                   return (
//                     <g key={location.id}>
//                       {location.isActive && <circle cx={x} cy={y} r={radius + 15} fill={activityLevel === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'} className="animate-pulse" />}
//                       <circle
//                         cx={x}
//                         cy={y}
//                         r={radius}
//                         fill={activityLevel === 'high' ? '#ef4444' : activityLevel === 'medium' ? '#3b82f6' : '#9ca3af'}
//                         className="cursor-pointer transition-all duration-300 hover:opacity-80"
//                         stroke="white" strokeWidth="2"
//                         onMouseEnter={() => setHoveredLocation({ ...location, x, y, value, activityLevel })}
//                         onMouseLeave={() => setHoveredLocation(null)}
//                         onClick={() => setSelectedLocation(location)}
//                       />
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>

//             {hoveredLocation && (
//               <div className="absolute bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200 z-30" style={{ left: hoveredLocation.x + 20, top: hoveredLocation.y - 60 }}>
//                   <h4 className="font-bold text-gray-900">{hoveredLocation.city}, {hoveredLocation.country}</h4>
//                   <p className="text-sm text-gray-600 capitalize">{selectedMetric.replace(/([A-Z])/g, ' $1')}: <span className="font-bold">{hoveredLocation.value}</span></p>
//               </div>
//             )}
//            </div>
//         </div>

//         {/* Device Analytics Panel */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-900 mb-1">Device Analytics</h3>
//             <p className="text-sm text-gray-600">Real-time device distribution</p>
//           </div>
          
//           <div className="p-6">
//             <div className="h-48 mb-6">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={deviceBreakdownForChart} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
//                     {deviceBreakdownForChart.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                   </Pie>
//                   <Tooltip formatter={(value, name) => [`${value.toLocaleString()} users`, name]} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="space-y-3">
//               {deviceBreakdownForChart.map((device, index) => (
//                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-.center gap-3">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
//                     <span className="font-medium text-gray-900">{device.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-bold text-gray-900">{device.value.toLocaleString()}</div>
//                     <div className="text-xs text-gray-600">{device.percentage}%</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Second Row - Analytics Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
//         {/* Hourly Activity Chart */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 mb-1">Activity ({timeRange})</h3>
//               <p className="text-sm text-gray-600">User activity patterns</p>
//             </div>
//             <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option value="24h">Last 24 Hours</option>
//               <option value="7d">Last 7 Days</option>
//             </select>
//           </div>
          
//           <div className="h-80 p-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={analytics?.hourlyActivity}>
//                 <defs>
//                   <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
//                   <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} fill="url(#usersGradient)" name="Unique Users" />
//                 <Area type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} fill="url(#sessionsGradient)" name="Sessions" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* User Journey Funnel (Static data as placeholder) */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//            <div className="p-6 border-b border-gray-100">
//              <h3 className="text-xl font-bold text-gray-900 mb-1">User Journey Funnel</h3>
//              <p className="text-sm text-gray-600">Conversion rates through user flow (Sample)</p>
//            </div>
//           <div className="p-6">
//             {/* Funnel logic remains the same, using static data */}
//             <div className="space-y-4">
//               {userJourneySteps.map((step, index) => (
//                 <div key={step.step}>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="font-medium text-gray-900">{index + 1}. {step.step}</div>
//                     <div className="font-bold text-green-600">{step.conversion}%</div>
//                   </div>
//                   <div className="relative bg-gray-200 rounded-full h-3">
//                     <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: `${(step.users / userJourneySteps[0].users) * 100}%` }}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Live User Activity Feed */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-xl font-bold text-gray-900 mb-1">Live User Activity Feed</h3>
//         </div>
//         <div className="max-h-96 overflow-y-auto">
//           {realTimeData.recentActivities.map((activity) => (
//               <div key={activity.id} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
//                     {activity.data?.userName?.charAt(0) || 'A'}
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-900">{activity.data.userName || 'Anonymous'}</div>
//                     <div className="text-sm text-blue-600 font-mono">{activity.activityType}</div>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-600">{activity.data.url || activity.data.pathname}</div>
//                 <div className="text-sm text-gray-500">
//                   {new Date(activity.timestamp).toLocaleTimeString()}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }