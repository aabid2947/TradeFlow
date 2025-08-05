// // useRealTimeUserActivity.js
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux'; // <-- NEW: Import useSelector
// import { collection, query, where, orderBy, limit, onSnapshot, doc, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig';
// import {
//   getUserLocationAndDevice,
//   startUserSession,
//   trackUserActivity,
//   trackPageView,
//   trackClick,
//   trackScroll,
//   endUserSession,
// } from './firebaseRealTimeAnalytics';
// import { selectCurrentUser } from '../features/auth/authSlice'; // <-- NEW: Import your Redux selector

// export const useRealTimeUserActivity = () => {
//   // Get the user directly from the Redux store
//   const reduxUser = useSelector(selectCurrentUser);

//   const [isInitialized, setIsInitialized] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [realTimeData, setRealTimeData] = useState({
//     activeSessions: [],
//     recentActivities: [],
//     locationAnalytics: [],
//     dashboardMetrics: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- REWRITTEN INITIALIZATION LOGIC ---
//   // This effect now triggers whenever the Redux user object changes.
//   useEffect(() => {
//     const initialize = async (user) => {
//       try {
//         setLoading(true);
//         // We need to create a "Firebase-like" user object for the analytics functions.
//         // They expect a `uid` property. Your backend user object likely has `_id`.
//         const firebaseCompatibleUser = {
//           ...user,
//           uid: user._id, // Create the 'uid' property from your user's '_id'
//         };

//         const locationData = await getUserLocationAndDevice();
//         const newSessionId = await startUserSession(firebaseCompatibleUser, locationData);
        
//         setSessionId(newSessionId);
//         setIsInitialized(true);

//         await trackPageView(window.location.pathname, { initialLoad: true });
//       } catch (err) {
//         console.error('Error initializing user session:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // If there is a user in Redux and we haven't started the session yet...
//     if (reduxUser && !isInitialized) {
//       console.log("DEBUG: Redux user found. Initializing analytics session.");
//       initialize(reduxUser);
//     } 
//     // If there is no user in Redux and the session was previously active...
//     else if (!reduxUser && isInitialized) {
//       console.log("DEBUG: Redux user is gone. Ending analytics session.");
//       endUserSession();
//       setIsInitialized(false);
//       setSessionId(null);
//     }
//     // If there's no user and we haven't loaded, stop loading.
//     else if (!reduxUser) {
//         setLoading(false);
//     }

//   }, [reduxUser, isInitialized]); // Dependency array ensures this runs when the user logs in or out.


//   // The rest of the file remains largely the same, but we will remove any direct
//   // dependencies on `auth.currentUser` and rely on the `reduxUser` we got above.

//   const setupRealtimeListeners = useCallback(() => {
//     // ... setupRealtimeListeners code remains exactly the same ...
//     // ...
//   // --- PASTE THE EXISTING setupRealtimeListeners FUNCTION HERE ---
//   // (No changes needed inside this function)
//     const unsubscribes = [];
//     const activeSessionsQuery = query(collection(db, 'user_sessions'), where('isActive', '==', true), orderBy('lastActivity', 'desc'), limit(100));
//     const activeSessionsUnsubscribe = onSnapshot(activeSessionsQuery, (snapshot) => {
//         const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), lastActivity: doc.data().lastActivity?.toDate(), startTime: doc.data().startTime?.toDate() }));
//         setRealTimeData(prev => ({ ...prev, activeSessions: sessions }));
//     }, (err) => { console.error('Error listening to active sessions:', err); setError(err.message); });
//     unsubscribes.push(activeSessionsUnsubscribe);
//     const recentActivitiesQuery = query(collection(db, 'user_activities'), orderBy('timestamp', 'desc'), limit(50));
//     const activitiesUnsubscribe = onSnapshot(recentActivitiesQuery, (snapshot) => {
//         const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() }));
//         setRealTimeData(prev => ({ ...prev, recentActivities: activities }));
//     }, (err) => { console.error('Error listening to activities:', err); });
//     unsubscribes.push(activitiesUnsubscribe);
//     const locationAnalyticsUnsubscribe = onSnapshot(collection(db, 'location_analytics'), (snapshot) => {
//         const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), lastUpdated: doc.data().lastUpdated?.toDate() }));
//         setRealTimeData(prev => ({ ...prev, locationAnalytics: locations }));
//     }, (err) => { console.error('Error listening to location analytics:', err); });
//     unsubscribes.push(locationAnalyticsUnsubscribe);
//     const dashboardUnsubscribe = onSnapshot(doc(db, 'dashboard_data', 'real_time'), (snapshot) => {
//         if (snapshot.exists()) {
//             setRealTimeData(prev => ({ ...prev, dashboardMetrics: { ...snapshot.data(), lastActivity: snapshot.data().lastActivity?.toDate() } }));
//         }
//     }, (err) => { console.error('Error listening to dashboard metrics:', err); });
//     unsubscribes.push(dashboardUnsubscribe);
//     return unsubscribes;
//   }, []);

//   const getAnalyticsData = useCallback(async (timeRange = '24h') => {
//     // ... getAnalyticsData code remains exactly the same ...
//     // ...
//   // --- PASTE THE EXISTING getAnalyticsData and its helper functions HERE ---
//   // (No changes needed inside these functions)
//     try {
//         const endDate = new Date();
//         const startDate = new Date();
//         switch (timeRange) {
//             case '1h': startDate.setHours(startDate.getHours() - 1); break;
//             case '24h': startDate.setDate(startDate.getDate() - 1); break;
//             case '7d': startDate.setDate(startDate.getDate() - 7); break;
//             case '30d': startDate.setDate(startDate.getDate() - 30); break;
//             default: startDate.setDate(startDate.getDate() - 1);
//         }
//         const sessionsQuery = query(collection(db, 'user_sessions'), where('startTime', '>=', startDate), where('startTime', '<=', endDate), orderBy('startTime', 'desc'));
//         const sessionsSnapshot = await getDocs(sessionsQuery);
//         const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), startTime: doc.data().startTime?.toDate(), endTime: doc.data().endTime?.toDate(), lastActivity: doc.data().lastActivity?.toDate() }));
//         const analytics = {
//             totalSessions: sessions.length,
//             uniqueUsers: new Set(sessions.map(s => s.userId)).size,
//             totalPageViews: sessions.reduce((sum, s) => sum + (s.pageViews || 0), 0),
//             averageSessionDuration: sessions.reduce((sum, s) => sum + (s.totalTimeSpent || 0), 0) / sessions.length,
//             bounceRate: (sessions.filter(s => s.bounced).length / sessions.length) * 100,
//             topCountries: getTopItems(sessions, 'country'),
//             topCities: getTopItems(sessions, 'city'),
//             deviceBreakdown: getDeviceBreakdown(sessions),
//             browserBreakdown: getBrowserBreakdown(sessions),
//             hourlyActivity: getHourlyActivity(sessions),
//             engagementMetrics: getEngagementMetrics(sessions)
//         };
//         return analytics;
//     } catch (err) {
//         console.error('Error getting analytics data:', err);
//         throw err;
//     }
//   }, []);
//     const getTopItems = (sessions, field) => {
//         const counts = sessions.reduce((acc, session) => {
//             const value = session[field];
//             acc[value] = (acc[value] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, count]) => ({ name, count }));
//     };
//     const getDeviceBreakdown = (sessions) => {
//         const devices = sessions.reduce((acc, session) => {
//             const device = session.deviceType || 'unknown';
//             acc[device] = (acc[device] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.entries(devices).map(([name, value]) => ({ name, value }));
//     };
//     const getBrowserBreakdown = (sessions) => {
//         const browsers = sessions.reduce((acc, session) => {
//             const browser = session.browser || 'unknown';
//             acc[browser] = (acc[browser] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.entries(browsers).map(([name, value]) => ({ name, value }));
//     };
//     const getHourlyActivity = (sessions) => {
//         const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, sessions: 0, users: new Set() }));
//         sessions.forEach(session => {
//             if (session.startTime) {
//                 const hour = session.startTime.getHours();
//                 hourly[hour].sessions++;
//                 hourly[hour].users.add(session.userId);
//             }
//         });
//         return hourly.map(h => ({ ...h, users: h.users.size }));
//     };
//     const getEngagementMetrics = (sessions) => {
//         const engaged = sessions.filter(s => (s.totalTimeSpent || 0) > 30 && !s.bounced);
//         const highEngagement = sessions.filter(s => (s.engagementScore || 0) > 100);
//         return {
//             engagementRate: (engaged.length / sessions.length) * 100,
//             highEngagementRate: (highEngagement.length / sessions.length) * 100,
//             averageEngagementScore: sessions.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / sessions.length
//         };
//     };

//   // ... All other useEffects and returned values remain the same ...
//   return { isInitialized, realTimeData, loading, error, getAnalyticsData };
// };

// export default useRealTimeUserActivity;