// // // firebaseRealTimeAnalytics.js
// // import { initializeApp } from "firebase/app";
// // import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
// // import { getAnalytics, logEvent, setUserProperties, setUserId } from "firebase/analytics";
// // import { 
// //   getFirestore, 
// //   collection, 
// //   addDoc, 
// //   onSnapshot, 
// //   query, 
// //   orderBy, 
// //   limit, 
// //   where, 
// //   Timestamp,
// //   doc,
// //   updateDoc,
// //   setDoc,
// //   serverTimestamp,
// //   increment,
// //   deleteDoc,
// //   getDocs
// // } from "firebase/firestore";

// // const firebaseConfig = {
// //   apiKey: "AIzaSyCha_5Z4QZA41TvvCjc1E8J9ClD52eS7NE",
// //   authDomain: "verifymykyc-78426.firebaseapp.com",
// //   projectId: "verifymykyc-78426",
// //   storageBucket: "verifymykyc-78426.firebasestorage.app",
// //   messagingSenderId: "1010588187987",
// //   appId: "1:1010588187987:web:30e78230ab2144857835a6",
// //   measurementId: "G-SVW7326TYH"
// // };

// // const app = initializeApp(firebaseConfig);
// // export const auth = getAuth(app);
// // export const googleProvider = new GoogleAuthProvider();
// // export const analytics = getAnalytics(app);
// // export const db = getFirestore(app);

// // // Enhanced User Location and Device Detection
// // export const getUserLocationAndDevice = async () => {
// //   try {
// //     // Enhanced location detection using multiple APIs
// //     const locationPromises = [
// //       fetch('https://ipapi.co/json/').then(res => res.json()),
// //       fetch('https://ip-api.com/json/').then(res => res.json()),
// //       fetch('https://ipinfo.io/json/').then(res => res.json())
// //     ];

// //     const locationResults = await Promise.allSettled(locationPromises);
// //     const primaryLocation = locationResults.find(result => result.status === 'fulfilled')?.value;

// //     const deviceInfo = getEnhancedDeviceInfo();
// //     const browserInfo = getEnhancedBrowserInfo();
// //     const screenInfo = getScreenInfo();
// //     const connectionInfo = getConnectionInfo();
    
// //     return {
// //       // Location data
// //       country: primaryLocation?.country_name || primaryLocation?.country || 'Unknown',
// //       countryCode: primaryLocation?.country_code || primaryLocation?.countryCode || 'XX',
// //       city: primaryLocation?.city || 'Unknown',
// //       region: primaryLocation?.region || primaryLocation?.regionName || 'Unknown',
// //       lat: primaryLocation?.latitude || primaryLocation?.lat || 0,
// //       lng: primaryLocation?.longitude || primaryLocation?.lon || 0,
// //       timezone: primaryLocation?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
// //       ip: primaryLocation?.ip || 'Unknown',
// //       isp: primaryLocation?.org || primaryLocation?.isp || 'Unknown',
      
// //       // Device and browser data
// //       ...deviceInfo,
// //       ...browserInfo,
// //       ...screenInfo,
// //       ...connectionInfo,
      
// //       // Additional metadata
// //       language: navigator.language || 'en-US',
// //       languages: navigator.languages || ['en-US'],
// //       platform: navigator.platform || 'Unknown',
// //       cookieEnabled: navigator.cookieEnabled,
// //       onlineStatus: navigator.onLine,
// //       timestamp: Date.now(),
      
// //       // Performance metrics
// //       performanceMetrics: getPerformanceMetrics()
// //     };
// //   } catch (error) {
// //     console.error('Error getting user location and device info:', error);
// //     return getBasicUserInfo();
// //   }
// // };

// // const getEnhancedDeviceInfo = () => {
// //   const userAgent = navigator.userAgent.toLowerCase();
// //   let deviceType = 'desktop';
// //   let deviceModel = 'Unknown';
// //   let os = 'Unknown';
// //   let osVersion = 'Unknown';
  
// //   // Device Type Detection
// //   if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
// //     deviceType = 'tablet';
// //   } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
// //     deviceType = 'mobile';
// //   }
  
// //   // OS Detection with version
// //   if (userAgent.includes('windows')) {
// //     os = 'Windows';
// //     const match = userAgent.match(/windows nt ([\d.]+)/);
// //     osVersion = match ? match[1] : 'Unknown';
// //   } else if (userAgent.includes('mac')) {
// //     os = 'macOS';
// //     const match = userAgent.match(/mac os x ([\d_]+)/);
// //     osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
// //   } else if (userAgent.includes('linux')) {
// //     os = 'Linux';
// //   } else if (userAgent.includes('android')) {
// //     os = 'Android';
// //     const match = userAgent.match(/android ([\d.]+)/);
// //     osVersion = match ? match[1] : 'Unknown';
// //   } else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
// //     os = 'iOS';
// //     const match = userAgent.match(/os ([\d_]+)/);
// //     osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
// //   }
  
// //   // Device Model Detection
// //   if (userAgent.includes('iphone')) {
// //     deviceModel = 'iPhone';
// //     const match = userAgent.match(/iphone os ([\d_]+)/);
// //     if (match) osVersion = match[1].replace(/_/g, '.');
// //   } else if (userAgent.includes('ipad')) {
// //     deviceModel = 'iPad';
// //   } else if (userAgent.includes('android')) {
// //     deviceModel = 'Android Device';
// //     // Try to extract device model
// //     const modelMatch = userAgent.match(/\(([^)]+)\)/);
// //     if (modelMatch) {
// //       const details = modelMatch[1].split(';');
// //       deviceModel = details.find(d => d.includes('SM-') || d.includes('GT-') || d.includes('LG-')) || 'Android Device';
// //     }
// //   }
  
// //   return {
// //     deviceType,
// //     deviceModel,
// //     os,
// //     osVersion,
// //     userAgent: navigator.userAgent,
// //     vendor: navigator.vendor || 'Unknown',
// //     hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
// //     maxTouchPoints: navigator.maxTouchPoints || 0
// //   };
// // };

// // const getEnhancedBrowserInfo = () => {
// //   const userAgent = navigator.userAgent;
// //   let browser = 'Unknown';
// //   let browserVersion = 'Unknown';
// //   let engine = 'Unknown';
  
// //   // Browser Detection
// //   if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
// //     browser = 'Chrome';
// //     browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
// //     engine = 'Blink';
// //   } else if (userAgent.includes('Firefox')) {
// //     browser = 'Firefox';
// //     browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
// //     engine = 'Gecko';
// //   } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
// //     browser = 'Safari';
// //     browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
// //     engine = 'WebKit';
// //   } else if (userAgent.includes('Edg')) {
// //     browser = 'Edge';
// //     browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
// //     engine = 'Blink';
// //   } else if (userAgent.includes('Opera')) {
// //     browser = 'Opera';
// //     browserVersion = userAgent.match(/Opera\/([0-9.]+)/)?.[1] || 'Unknown';
// //     engine = 'Blink';
// //   }
  
// //   return {
// //     browser,
// //     browserVersion,
// //     engine,
// //     cookiesEnabled: navigator.cookieEnabled,
// //     javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
// //     plugins: Array.from(navigator.plugins || []).map(p => ({
// //       name: p.name,
// //       version: p.version,
// //       filename: p.filename
// //     })),
// //     doNotTrack: navigator.doNotTrack || 'unspecified',
// //     webdriver: navigator.webdriver || false
// //   };
// // };

// // const getScreenInfo = () => {
// //   return {
// //     screenWidth: screen.width,
// //     screenHeight: screen.height,
// //     screenColorDepth: screen.colorDepth,
// //     windowWidth: window.innerWidth,
// //     windowHeight: window.innerHeight,
// //     pixelRatio: window.devicePixelRatio || 1,
// //     orientation: screen.orientation ? screen.orientation.type : 'unknown',
// //     availWidth: screen.availWidth,
// //     availHeight: screen.availHeight
// //   };
// // };

// // const getConnectionInfo = () => {
// //   const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
// //   return {
// //     connectionType: connection?.effectiveType || 'unknown',
// //     downlink: connection?.downlink || 'unknown',
// //     rtt: connection?.rtt || 'unknown',
// //     saveData: connection?.saveData || false
// //   };
// // };

// // const getPerformanceMetrics = () => {
// //   if (!performance) return {};
  
// //   const navigation = performance.getEntriesByType('navigation')[0];
// //   const memory = performance.memory;
  
// //   return {
// //     loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
// //     domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
// //     firstPaint: getFirstPaint(),
// //     memoryUsage: memory ? {
// //       used: memory.usedJSHeapSize,
// //       total: memory.totalJSHeapSize,
// //       limit: memory.jsHeapSizeLimit
// //     } : null
// //   };
// // };

// // const getFirstPaint = () => {
// //   const paintEntries = performance.getEntriesByType('paint');
// //   const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
// //   return firstPaint ? firstPaint.startTime : 0;
// // };

// // const getBasicUserInfo = () => {
// //   return {
// //     country: 'Unknown',
// //     countryCode: 'XX',
// //     city: 'Unknown',
// //     region: 'Unknown',
// //     lat: 0,
// //     lng: 0,
// //     timezone: 'UTC',
// //     ip: 'Unknown',
// //     deviceType: 'desktop',
// //     browser: 'Unknown',
// //     os: 'Unknown'
// //   };
// // };

// // // Generate unique session ID
// // const generateSessionId = () => {
// //   return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// // };

// // // Enhanced User Session Tracking
// // export const startUserSession = async (user, locationData) => {
// //   try {
// //     const sessionId = generateSessionId();
// //     const sessionData = {
// //       // User info
// //       userId: user.uid,
// //       userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
// //       email: user.email,
// //       photoURL: user.photoURL,
      
// //       // Session info
// //       sessionId,
// //       startTime: serverTimestamp(),
// //       lastActivity: serverTimestamp(),
// //       isActive: true,
      
// //       // Location and device
// //       ...locationData,
      
// //       // Activity tracking
// //       pageViews: 0,
// //       clickCount: 0,
// //       scrollDepth: 0,
// //       totalTimeSpent: 0,
// //       bounced: false,
      
// //       // Engagement metrics
// //       engagementScore: 0,
// //       actions: [],
// //       visitedPages: [],
// //       referrer: document.referrer || 'direct',
      
// //       // Technical metrics
// //       errors: [],
// //       warnings: []
// //     };

// //     // Store session in Firestore
// //     const sessionRef = await addDoc(collection(db, 'user_sessions'), sessionData);
    
// //     // Store session ID for future updates
// //     sessionStorage.setItem('firebaseSessionId', sessionRef.id);
// //     sessionStorage.setItem('sessionStartTime', Date.now().toString());
    
// //     // Log to Firebase Analytics
// //     logEvent(analytics, 'session_start', {
// //       session_id: sessionId,
// //       user_id: user.uid,
// //       country: locationData.country,
// //       city: locationData.city,
// //       device_type: locationData.deviceType,
// //       browser: locationData.browser
// //     });

// //     // Set user properties for analytics
// //     setUserId(analytics, user.uid);
// //     setUserProperties(analytics, {
// //       country: locationData.country,
// //       city: locationData.city,
// //       device_type: locationData.deviceType,
// //       browser: locationData.browser,
// //       user_type: 'authenticated'
// //     });

// //     // Update location-based analytics
// //     await updateLocationAnalytics(locationData);
    
// //     // Start heartbeat for session tracking
// //     startSessionHeartbeat();
    
// //     return sessionRef.id;
// //   } catch (error) {
// //     console.error('Error starting user session:', error);
// //     throw error;
// //   }
// // };

// // // Session heartbeat to track active users
// // const startSessionHeartbeat = () => {
// //   const heartbeatInterval = setInterval(async () => {
// //     const sessionId = sessionStorage.getItem('firebaseSessionId');
// //     const user = auth.currentUser;
    
// //     if (!sessionId || !user) {
// //       clearInterval(heartbeatInterval);
// //       return;
// //     }

// //     try {
// //       const sessionRef = doc(db, 'user_sessions', sessionId);
// //       await updateDoc(sessionRef, {
// //         lastActivity: serverTimestamp(),
// //         isActive: true
// //       });
// //     } catch (error) {
// //       console.error('Heartbeat error:', error);
// //     }
// //   }, 30000); // Update every 30 seconds

// //   // Store interval ID for cleanup
// //   sessionStorage.setItem('heartbeatInterval', heartbeatInterval);
// // };

// // // Real-time Activity Tracking
// // export const trackUserActivity = async (activityType, data = {}, user = null) => {
// //   try {
// //     const sessionId = sessionStorage.getItem('firebaseSessionId');
// //     if (!sessionId) return;

// //     const currentUser = user || auth.currentUser;
// //     if (!currentUser) return;

// //     const activityData = {
// //       userId: currentUser.uid,
// //       sessionId,
// //       activityType,
// //       timestamp: serverTimestamp(),
// //       data,
// //       url: window.location.href,
// //       pathname: window.location.pathname,
// //       userAgent: navigator.userAgent,
// //       viewportSize: {
// //         width: window.innerWidth,
// //         height: window.innerHeight
// //       }
// //     };

// //     // Store individual activity
// //     await addDoc(collection(db, 'user_activities'), activityData);

// //     // Update session with latest activity
// //     const sessionRef = doc(db, 'user_sessions', sessionId);
// //     const updateData = {
// //       lastActivity: serverTimestamp(),
// //       totalTimeSpent: increment(Math.floor((Date.now() - parseInt(sessionStorage.getItem('sessionStartTime'))) / 1000))
// //     };

// //     // Increment specific activity counters
// //     if (activityType === 'page_view') updateData.pageViews = increment(1);
// //     if (activityType === 'click') updateData.clickCount = increment(1);
// //     if (activityType === 'scroll') updateData.scrollDepth = Math.max(data.scrollDepth || 0, 0);

// //     await updateDoc(sessionRef, updateData);

// //     // Log to Firebase Analytics
// //     logEvent(analytics, activityType, {
// //       session_id: sessionId,
// //       user_id: currentUser.uid,
// //       ...data
// //     });

// //     // Calculate engagement score
// //     await updateEngagementScore(sessionId, activityType, data);

// //   } catch (error) {
// //     console.error('Error tracking user activity:', error);
// //   }
// // };

// // // Page View Tracking with Enhanced Metrics
// // export const trackPageView = async (pageName, additionalData = {}) => {
// //   try {
// //     const sessionId = sessionStorage.getItem('firebaseSessionId');
// //     const user = auth.currentUser;
    
// //     if (!sessionId || !user) return;

// //     const pageData = {
// //       pageName,
// //       url: window.location.href,
// //       pathname: window.location.pathname,
// //       title: document.title,
// //       referrer: document.referrer,
// //       loadTime: performance.now(),
// //       timestamp: serverTimestamp(),
// //       viewport: {
// //         width: window.innerWidth,
// //         height: window.innerHeight
// //       },
// //       ...additionalData
// //     };

// //     await trackUserActivity('page_view', pageData, user);

// //     // Update session with visited pages
// //     const sessionRef = doc(db, 'user_sessions', sessionId);
// //     await updateDoc(sessionRef, {
// //       pageViews: increment(1),
// //       visitedPages: [...(additionalData.visitedPages || []), pageName]
// //     });

// //     // Firebase Analytics
// //     logEvent(analytics, 'page_view', {
// //       page_title: document.title,
// //       page_location: window.location.href,
// //       page_path: window.location.pathname
// //     });

// //   } catch (error) {
// //     console.error('Error tracking page view:', error);
// //   }
// // };

// // // Click Tracking
// // export const trackClick = async (elementInfo) => {
// //   try {
// //     const clickData = {
// //       elementType: elementInfo.tagName || 'unknown',
// //       elementId: elementInfo.id || '',
// //       elementClass: elementInfo.className || '',
// //       elementText: elementInfo.textContent?.slice(0, 100) || '',
// //       position: {
// //         x: elementInfo.x || 0,
// //         y: elementInfo.y || 0
// //       }
// //     };

// //     await trackUserActivity('click', clickData);
// //   } catch (error) {
// //     console.error('Error tracking click:', error);
// //   }
// // };

// // // Scroll Tracking
// // export const trackScroll = async (scrollDepth) => {
// //   try {
// //     const scrollData = {
// //       scrollDepth: Math.round(scrollDepth),
// //       documentHeight: document.documentElement.scrollHeight,
// //       viewportHeight: window.innerHeight
// //     };

// //     await trackUserActivity('scroll', scrollData);
// //   } catch (error) {
// //     console.error('Error tracking scroll:', error);
// //   }
// // };

// // // Error Tracking
// // export const trackError = async (error, context = {}) => {
// //   try {
// //     const sessionId = sessionStorage.getItem('firebaseSessionId');
// //     if (!sessionId) return;

// //     const errorData = {
// //       message: error.message || 'Unknown error',
// //       stack: error.stack || '',
// //       filename: error.filename || '',
// //       lineno: error.lineno || 0,
// //       colno: error.colno || 0,
// //       context,
// //       timestamp: serverTimestamp(),
// //       url: window.location.href,
// //       userAgent: navigator.userAgent
// //     };

// //     await addDoc(collection(db, 'user_errors'), {
// //       sessionId,
// //       userId: auth.currentUser?.uid || 'anonymous',
// //       ...errorData
// //     });

// //     // Update session with error count
// //     const sessionRef = doc(db, 'user_sessions', sessionId);
// //     await updateDoc(sessionRef, {
// //       errors: increment(1)
// //     });

// //     logEvent(analytics, 'exception', {
// //       description: error.message,
// //       fatal: false
// //     });

// //   } catch (err) {
// //     console.error('Error tracking error:', err);
// //   }
// // };

// // // Location Analytics Update
// // const updateLocationAnalytics = async (locationData) => {
// //   try {
// //     const locationKey = `${locationData.country}_${locationData.city}`;
// //     const locationRef = doc(db, 'location_analytics', locationKey);
    
// //     await setDoc(locationRef, {
// //       country: locationData.country,
// //       countryCode: locationData.countryCode,
// //       city: locationData.city,
// //       region: locationData.region,
// //       lat: locationData.lat,
// //       lng: locationData.lng,
// //       timezone: locationData.timezone,
// //       lastUpdated: serverTimestamp(),
// //       totalUsers: increment(1),
// //       activeSessions: increment(1)
// //     }, { merge: true });

// //   } catch (error) {
// //     console.error('Error updating location analytics:', error);
// //   }
// // };

// // // Engagement Score Calculation
// // const updateEngagementScore = async (sessionId, activityType, data) => {
// //   try {
// //     let scoreIncrement = 0;
    
// //     switch (activityType) {
// //       case 'page_view':
// //         scoreIncrement = 10;
// //         break;
// //       case 'click':
// //         scoreIncrement = 5;
// //         break;
// //       case 'scroll':
// //         scoreIncrement = Math.min(data.scrollDepth || 0, 25) / 5;
// //         break;
// //       case 'form_interaction':
// //         scoreIncrement = 15;
// //         break;
// //       case 'video_play':
// //         scoreIncrement = 20;
// //         break;
// //       case 'download':
// //         scoreIncrement = 25;
// //         break;
// //       default:
// //         scoreIncrement = 1;
// //     }

// //     const sessionRef = doc(db, 'user_sessions', sessionId);
// //     await updateDoc(sessionRef, {
// //       engagementScore: increment(scoreIncrement)
// //     });

// //   } catch (error) {
// //     console.error('Error updating engagement score:', error);
// //   }
// // };

// // // End User Session
// // export const endUserSession = async () => {
// //   try {
// //     const sessionId = sessionStorage.getItem('firebaseSessionId');
// //     const heartbeatInterval = sessionStorage.getItem('heartbeatInterval');
    
// //     if (heartbeatInterval) {
// //       clearInterval(parseInt(heartbeatInterval));
// //     }
    
// //     if (!sessionId) return;

// //     const sessionRef = doc(db, 'user_sessions', sessionId);
// //     const totalTime = Math.floor((Date.now() - parseInt(sessionStorage.getItem('sessionStartTime'))) / 1000);
    
// //     await updateDoc(sessionRef, {
// //       endTime: serverTimestamp(),
// //       isActive: false,
// //       totalTimeSpent: totalTime,
// //       bounced: totalTime < 30 // Consider bounced if less than 30 seconds
// //     });

// //     // Clear session storage
// //     sessionStorage.removeItem('firebaseSessionId');
// //     sessionStorage.removeItem('sessionStartTime');
// //     sessionStorage.removeItem('heartbeatInterval');

// //     logEvent(analytics, 'session_end', {
// //       session_duration: totalTime
// //     });

// //   } catch (error) {
// //     console.error('Error ending user session:', error);
// //   }
// // };

// // // Real-time Data Listeners
// // export const subscribeToRealTimeData = (callback) => {
// //   const queries = [
// //     query(collection(db, 'user_sessions'), where('isActive', '==', true), orderBy('lastActivity', 'desc'), limit(100)),
// //     query(collection(db, 'user_activities'), orderBy('timestamp', 'desc'), limit(50)),
// //     query(collection(db, 'location_analytics'))
// //   ];

// //   const unsubscribes = queries.map((q, index) => {
// //     return onSnapshot(q, (snapshot) => {
// //       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //       callback(index, data);
// //     });
// //   });

// //   return () => unsubscribes.forEach(unsubscribe => unsubscribe());
// // };

// // // Clean up old sessions (call this periodically)
// // export const cleanupOldSessions = async () => {
// //   try {
// //     const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
// //     const oldSessionsQuery = query(
// //       collection(db, 'user_sessions'),
// //       where('lastActivity', '<', Timestamp.fromDate(cutoffTime))
// //     );

// //     const oldSessions = await getDocs(oldSessionsQuery);
// //     const deletePromises = oldSessions.docs.map(doc => deleteDoc(doc.ref));
    
// //     await Promise.all(deletePromises);
// //     console.log(`Cleaned up ${oldSessions.size} old sessions`);

// //   } catch (error) {
// //     console.error('Error cleaning up old sessions:', error);
// //   }
// // };

// // // Initialize global error tracking
// // if (typeof window !== 'undefined') {
// //   window.addEventListener('error', (event) => {
// //     trackError(event.error || new Error(event.message), {
// //       type: 'javascript_error',
// //       filename: event.filename,
// //       lineno: event.lineno,
// //       colno: event.colno
// //     });
// //   });

// //   window.addEventListener('unhandledrejection', (event) => {
// //     trackError(new Error(event.reason), {
// //       type: 'unhandled_promise_rejection'
// //     });
// //   });

// //   // Track page unload
// //   window.addEventListener('beforeunload', () => {
// //     endUserSession();
// //   });

// //   // Track visibility changes
// //   document.addEventListener('visibilitychange', () => {
// //     if (document.hidden) {
// //       trackUserActivity('page_hidden');
// //     } else {
// //       trackUserActivity('page_visible');
// //     }
// //   });
// // }

// // export default {
// //   getUserLocationAndDevice,
// //   startUserSession,
// //   trackUserActivity,
// //   trackPageView,
// //   trackClick,
// //   trackScroll,
// //   trackError,
// //   endUserSession,
// //   subscribeToRealTimeData,
// //   cleanupOldSessions
// // };
// // firebaseRealTimeAnalytics.js

// // Import services directly from the central config file
// import { auth, db, analytics } from "./firebaseConfig";
// import { GoogleAuthProvider } from "firebase/auth";
// import { logEvent, setUserProperties, setUserId } from "firebase/analytics";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
//   limit,
//   where,
//   Timestamp,
//   doc,
//   updateDoc,
//   setDoc,
//   serverTimestamp,
//   increment,
//   deleteDoc,
//   getDocs
// } from "firebase/firestore";

// // Export the provider in case it's needed for UI components
// export const googleProvider = new GoogleAuthProvider();

// // --- User Location and Device Detection ---

// export const getUserLocationAndDevice = async () => {
//   try {
//     const locationPromises = [
//       fetch('https://ipapi.co/json/').then(res => res.json()),
//       fetch('https://ip-api.com/json/').then(res => res.json()),
//       fetch('https://ipinfo.io/json/').then(res => res.json())
//     ];

//     const locationResults = await Promise.allSettled(locationPromises);
//     const primaryLocation = locationResults.find(result => result.status === 'fulfilled')?.value;

//     const deviceInfo = getEnhancedDeviceInfo();
//     const browserInfo = getEnhancedBrowserInfo();
//     const screenInfo = getScreenInfo();
//     const connectionInfo = getConnectionInfo();

//     return {
//       country: primaryLocation?.country_name || primaryLocation?.country || 'Unknown',
//       countryCode: primaryLocation?.country_code || primaryLocation?.countryCode || 'XX',
//       city: primaryLocation?.city || 'Unknown',
//       region: primaryLocation?.region || primaryLocation?.regionName || 'Unknown',
//       lat: primaryLocation?.latitude || primaryLocation?.lat || 0,
//       lng: primaryLocation?.longitude || primaryLocation?.lon || 0,
//       timezone: primaryLocation?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
//       ip: primaryLocation?.ip || 'Unknown',
//       isp: primaryLocation?.org || primaryLocation?.isp || 'Unknown',
//       ...deviceInfo,
//       ...browserInfo,
//       ...screenInfo,
//       ...connectionInfo,
//       language: navigator.language || 'en-US',
//       platform: navigator.platform || 'Unknown',
//       cookieEnabled: navigator.cookieEnabled,
//       onlineStatus: navigator.onLine,
//       timestamp: Date.now(),
//       performanceMetrics: getPerformanceMetrics()
//     };
//   } catch (error) {
//     console.error('Error getting user location and device info:', error);
//     return getBasicUserInfo();
//   }
// };

// const getEnhancedDeviceInfo = () => {
//   const userAgent = navigator.userAgent.toLowerCase();
//   let deviceType = 'desktop';
//   let os = 'Unknown';
//   let osVersion = 'Unknown';

//   if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
//     deviceType = 'tablet';
//   } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
//     deviceType = 'mobile';
//   }

//   if (userAgent.includes('windows nt')) {
//     os = 'Windows';
//     osVersion = userAgent.match(/windows nt ([\d.]+)/)?.[1] || 'Unknown';
//   } else if (userAgent.includes('mac os x')) {
//     os = 'macOS';
//     osVersion = userAgent.match(/mac os x ([\d_]+)/)?.[1].replace(/_/g, '.') || 'Unknown';
//   } else if (userAgent.includes('android')) {
//     os = 'Android';
//     osVersion = userAgent.match(/android ([\d.]+)/)?.[1] || 'Unknown';
//   } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
//     os = 'iOS';
//     osVersion = userAgent.match(/os ([\d_]+)/)?.[1].replace(/_/g, '.') || 'Unknown';
//   } else if (userAgent.includes('linux')) {
//     os = 'Linux';
//   }

//   return { deviceType, os, osVersion, userAgent: navigator.userAgent };
// };

// const getEnhancedBrowserInfo = () => {
//   const userAgent = navigator.userAgent;
//   let browser = 'Unknown';
//   let browserVersion = 'Unknown';

//   if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
//     browser = 'Chrome';
//     browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1];
//   } else if (userAgent.includes('Firefox')) {
//     browser = 'Firefox';
//     browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1];
//   } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
//     browser = 'Safari';
//     browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1];
//   } else if (userAgent.includes('Edg')) {
//     browser = 'Edge';
//     browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1];
//   }

//   return { browser, browserVersion: browserVersion || 'Unknown' };
// };

// const getScreenInfo = () => ({
//   screenWidth: screen.width,
//   screenHeight: screen.height,
//   windowWidth: window.innerWidth,
//   windowHeight: window.innerHeight,
// });

// const getConnectionInfo = () => {
//   const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//   return { connectionType: connection?.effectiveType || 'unknown' };
// };

// const getPerformanceMetrics = () => {
//   if (!performance || !performance.getEntriesByType) return {};
//   const navigation = performance.getEntriesByType('navigation')[0];
//   return { loadTime: navigation ? navigation.duration : 0 };
// };

// const getBasicUserInfo = () => ({
//   country: 'Unknown', city: 'Unknown', deviceType: 'desktop', browser: 'Unknown', os: 'Unknown'
// });

// const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;


// // --- Core Session and Activity Tracking ---

// export const startUserSession = async (user, locationData) => {
//   try {
//     const sessionId = generateSessionId();

//     // Sanitize data to prevent Firestore errors by providing default values
//     const sessionData = {
//       userId: user.uid,
//       userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
//       email: user.email ?? 'No Email',
//       photoURL: user.photoURL ?? '',
//       sessionId,
//       startTime: serverTimestamp(),
//       lastActivity: serverTimestamp(),
//       isActive: true,
//       country: locationData.country ?? 'Unknown',
//       countryCode: locationData.countryCode ?? 'XX',
//       city: locationData.city ?? 'Unknown',
//       region: locationData.region ?? 'Unknown',
//       lat: locationData.lat ?? 0,
//       lng: locationData.lng ?? 0,
//       timezone: locationData.timezone ?? 'UTC',
//       ip: locationData.ip ?? 'Unknown',
//       isp: locationData.isp ?? 'Unknown',
//       deviceType: locationData.deviceType ?? 'desktop',
//       browser: locationData.browser ?? 'Unknown',
//       os: locationData.os ?? 'Unknown',
//       osVersion: locationData.osVersion ?? 'Unknown',
//       userAgent: locationData.userAgent ?? '',
//       screenWidth: locationData.screenWidth ?? 0,
//       screenHeight: locationData.screenHeight ?? 0,
//       pageViews: 0,
//       clickCount: 0,
//       scrollDepth: 0,
//       totalTimeSpent: 0,
//       bounced: false,
//       engagementScore: 0,
//       actions: [],
//       visitedPages: [],
//       referrer: document.referrer || 'direct',
//       errors: [],
//       warnings: []
//     };

//     const sessionRef = await addDoc(collection(db, 'user_sessions'), sessionData);
//     sessionStorage.setItem('firebaseSessionId', sessionRef.id);
//     sessionStorage.setItem('sessionStartTime', Date.now().toString());

//     logEvent(analytics, 'session_start', { session_id: sessionId, user_id: user.uid });
//     setUserId(analytics, user.uid);
//     setUserProperties(analytics, { country: sessionData.country, device_type: sessionData.deviceType });

//     await updateLocationAnalytics(locationData);
//     startSessionHeartbeat();
//     return sessionRef.id;
//   } catch (error) {
//     console.error('Error starting user session:', error);
//     throw error;
//   }
// };

// const startSessionHeartbeat = () => {
//   const intervalId = setInterval(async () => {
//     const sessionId = sessionStorage.getItem('firebaseSessionId');
//     if (!sessionId || !auth.currentUser) {
//       clearInterval(intervalId);
//       return;
//     }
//     try {
//       await updateDoc(doc(db, 'user_sessions', sessionId), {
//         lastActivity: serverTimestamp(),
//         isActive: true,
//       });
//     } catch (error) {
//       console.error('Heartbeat error:', error);
//     }
//   }, 30000);
//   sessionStorage.setItem('heartbeatInterval', intervalId.toString());
// };

// export const trackUserActivity = async (activityType, data = {}) => {
//   try {
//     const sessionId = sessionStorage.getItem('firebaseSessionId');
//     const currentUser = auth.currentUser;
//     if (!sessionId || !currentUser) return;

//     const activityData = {
//       userId: currentUser.uid,
//       sessionId,
//       activityType,
//       timestamp: serverTimestamp(),
//       data,
//       url: window.location.href,
//     };

//     await addDoc(collection(db, 'user_activities'), activityData);

//     const sessionRef = doc(db, 'user_sessions', sessionId);
//     const updateData = { lastActivity: serverTimestamp() };
//     if (activityType === 'page_view') updateData.pageViews = increment(1);
//     if (activityType === 'click') updateData.clickCount = increment(1);

//     await updateDoc(sessionRef, updateData);
//     await updateEngagementScore(sessionId, activityType, data);
//     logEvent(analytics, activityType, { ...data });
//   } catch (error) {
//     console.error(`Error tracking activity (${activityType}):`, error);
//   }
// };

// export const trackPageView = async (pageName, additionalData = {}) => {
//   const pageData = {
//     pageName,
//     title: document.title,
//     ...additionalData
//   };
//   await trackUserActivity('page_view', pageData);
// };

// export const trackClick = async (elementInfo) => {
//   await trackUserActivity('click', elementInfo);
// };

// export const trackScroll = async (scrollDepth) => {
//   await trackUserActivity('scroll', { scrollDepth });
// };

// export const trackError = async (error, context = {}) => {
//   await trackUserActivity('error', {
//     message: error.message,
//     stack: error.stack,
//     context
//   });
// };

// export const endUserSession = async () => {
//   try {
//     const sessionId = sessionStorage.getItem('firebaseSessionId');
//     const startTime = sessionStorage.getItem('sessionStartTime');
//     const intervalId = sessionStorage.getItem('heartbeatInterval');

//     if (intervalId) clearInterval(parseInt(intervalId));
//     if (!sessionId || !startTime) return;

//     const totalTime = Math.floor((Date.now() - parseInt(startTime)) / 1000);
//     await updateDoc(doc(db, 'user_sessions', sessionId), {
//       endTime: serverTimestamp(),
//       isActive: false,
//       totalTimeSpent: totalTime,
//       bounced: totalTime < 30,
//     });

//     sessionStorage.removeItem('firebaseSessionId');
//     sessionStorage.removeItem('sessionStartTime');
//     sessionStorage.removeItem('heartbeatInterval');
//   } catch (error) {
//     console.error('Error ending user session:', error);
//   }
// };

// const updateLocationAnalytics = async (locationData) => {
//   if (!locationData.country || !locationData.city) return;
//   const locationKey = `${locationData.country}_${locationData.city}`;
//   const locationRef = doc(db, 'location_analytics', locationKey);
//   try {
//     await setDoc(locationRef, {
//       country: locationData.country,
//       city: locationData.city,
//       lastUpdated: serverTimestamp(),
//       activeSessions: increment(1)
//     }, { merge: true });
//   } catch (error) {
//     console.error('Error updating location analytics:', error);
//   }
// };

// const updateEngagementScore = async (sessionId, activityType) => {
//   let scoreIncrement = 1;
//   if (activityType === 'page_view') scoreIncrement = 5;
//   if (activityType === 'click') scoreIncrement = 2;
//   try {
//     await updateDoc(doc(db, 'user_sessions', sessionId), {
//       engagementScore: increment(scoreIncrement)
//     });
//   } catch (error) {
//     console.error('Error updating engagement score:', error);
//   }
// };

// // --- Real-time Data Listeners ---

// export const subscribeToRealTimeData = (callback) => {
//   const queries = [
//     query(collection(db, 'user_sessions'), where('isActive', '==', true), orderBy('lastActivity', 'desc'), limit(100)),
//     query(collection(db, 'user_activities'), orderBy('timestamp', 'desc'), limit(50)),
//     query(collection(db, 'location_analytics'))
//   ];

//   const unsubscribes = queries.map((q, index) =>
//     onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const type = ['activeSessions', 'recentActivities', 'locationAnalytics'][index];
//       callback(type, data);
//     })
//   );

//   return () => unsubscribes.forEach(unsub => unsub());
// };



// if (typeof window !== 'undefined') {
//   window.addEventListener('error', (event) => trackError(event.error));
//   window.addEventListener('unhandledrejection', (event) => trackError(event.reason));
//   window.addEventListener('beforeunload', endUserSession);
// }



// export default {
//   getUserLocationAndDevice,
//   startUserSession,
//   trackUserActivity,
//   trackPageView,
//   trackClick,
//   trackScroll,
//   trackError,
//   endUserSession,
//   subscribeToRealTimeData,
// };