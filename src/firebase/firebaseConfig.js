// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCha_5Z4QZA41TvvCjc1E8J9ClD52eS7NE",
  authDomain: "verifymykyc-78426.firebaseapp.com",
  projectId: "verifymykyc-78426",
  storageBucket: "verifymykyc-78426.firebasestorage.app",
  messagingSenderId: "1010588187987",
  appId: "1:1010588187987:web:30e78230ab2144857835a6",
  measurementId: "G-SVW7326TYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

// Connect to emulators in development
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099");
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectStorageEmulator(storage, "localhost", 9199);
//   } catch (error) {
//     console.log("Emulators already connected or not available");
//   }
// }

// Firestore Security Rules (to be deployed via Firebase CLI)
// export const firestoreRules = `
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {

//     // User sessions can be written by anyone, but with validation.
//     // This allows tracking of anonymous users.
//     match /user_sessions/{sessionId} {
//       allow read: if true; // Allow any client to read session data for analytics dashboards.
//       allow write: if (request.auth != null && request.resource.data.userId == request.auth.uid) ||
//                     (request.auth == null && request.resource.data.userId.matches('anonymous_.*'));
//     }

//     // User activities can also be written by anyone, with the same validation.
//     match /user_activities/{activityId} {
//       allow read: if true;
//       allow write: if (request.auth != null && request.resource.data.userId == request.auth.uid) ||
//                     (request.auth == null && request.resource.data.userId.matches('anonymous_.*'));
//     }

//     // User errors can be written by anyone, with validation.
//     match /user_errors/{errorId} {
//       allow read: if true;
//       allow write: if (request.auth != null && request.resource.data.userId == request.auth.uid) ||
//                     (request.auth == null && request.resource.data.userId.matches('anonymous_.*'));
//     }

//     // Location analytics can be updated by any client session.
//     match /location_analytics/{locationId} {
//       allow read, write: if true;
//     }

//     // Real-time dashboard data can be updated by any client.
//     match /dashboard_data/{docId} {
//       allow read, write: if true;
//     }

//     // Admin-specific analytics should remain locked down.
//     match /admin_analytics/{docId} {
//       allow read, write: if request.auth != null &&
//         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
//     }
//   }
// }
// `;

// // Cloud Functions for server-side analytics processing
// export const cloudFunctions = {
//   // Aggregate user data every hour
//   aggregateUserData: `
//     exports.aggregateUserData = functions.pubsub
//       .schedule('0 * * * *') // Every hour
//       .onRun(async (context) => {
//         const admin = require('firebase-admin');
//         const db = admin.firestore();
        
//         const now = new Date();
//         const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        
//         // Get sessions from the last hour
//         const sessionsSnapshot = await db.collection('user_sessions')
//           .where('startTime', '>=', hourAgo)
//           .get();
        
//         // Aggregate data by country and city
//         const locationStats = {};
        
//         sessionsSnapshot.forEach(doc => {
//           const session = doc.data();
//           const key = \`\${session.country}_\${session.city}\`;
          
//           if (!locationStats[key]) {
//             locationStats[key] = {
//               country: session.country,
//               city: session.city,
//               users: 0,
//               sessions: 0,
//               totalTime: 0,
//               devices: { mobile: 0, desktop: 0, tablet: 0 },
//               browsers: {}
//             };
//           }
          
//           locationStats[key].users++;
//           locationStats[key].sessions++;
//           locationStats[key].totalTime += session.totalTimeSpent || 0;
//           locationStats[key].devices[session.deviceType] = 
//             (locationStats[key].devices[session.deviceType] || 0) + 1;
//           locationStats[key].browsers[session.browser] = 
//             (locationStats[key].browsers[session.browser] || 0) + 1;
//         });
        
//         // Store aggregated data
//         const batch = db.batch();
//         Object.keys(locationStats).forEach(key => {
//           const docRef = db.collection('hourly_analytics').doc(\`\${now.getFullYear()}-\${now.getMonth()+1}-\${now.getDate()}-\${now.getHours()}_\${key}\`);
//           batch.set(docRef, {
//             ...locationStats[key],
//             timestamp: admin.firestore.FieldValue.serverTimestamp(),
//             hour: now.getHours(),
//             date: now.toISOString().split('T')[0]
//           });
//         });
        
//         await batch.commit();
//         console.log('Hourly analytics aggregated successfully');
//       });
//   `,
  
//   // Clean up old data
//   cleanupOldData: `
//     exports.cleanupOldData = functions.pubsub
//       .schedule('0 2 * * *') // Daily at 2 AM
//       .onRun(async (context) => {
//         const admin = require('firebase-admin');
//         const db = admin.firestore();
        
//         const cutoffDate = new Date();
//         cutoffDate.setDate(cutoffDate.getDate() - 30); // Keep 30 days
        
//         // Clean up old sessions
//         const oldSessions = await db.collection('user_sessions')
//           .where('lastActivity', '<', cutoffDate)
//           .limit(500)
//           .get();
        
//         const batch = db.batch();
//         oldSessions.docs.forEach(doc => {
//           batch.delete(doc.ref);
//         });
        
//         await batch.commit();
//         console.log(\`Cleaned up \${oldSessions.size} old sessions\`);
//       });
//   `,
  
//   // Process real-time user updates
//   processUserActivity: `
//     exports.processUserActivity = functions.firestore
//       .document('user_activities/{activityId}')
//       .onCreate(async (snap, context) => {
//         const activity = snap.data();
//         const admin = require('firebase-admin');
//         const db = admin.firestore();
        
//         // Update real-time dashboard metrics
//         const dashboardRef = db.collection('dashboard_data').doc('real_time');
        
//         await dashboardRef.update({
//           lastActivity: admin.firestore.FieldValue.serverTimestamp(),
//           totalActivities: admin.firestore.FieldValue.increment(1),
//           [\`activities.\${activity.activityType}\`]: admin.firestore.FieldValue.increment(1)
//         });
        
//         // Update location-specific metrics
//         if (activity.country && activity.city) {
//           const locationKey = \`\${activity.country}_\${activity.city}\`;
//           const locationRef = db.collection('location_analytics').doc(locationKey);
          
//           await locationRef.set({
//             country: activity.country,
//             city: activity.city,
//             lastActivity: admin.firestore.FieldValue.serverTimestamp(),
//             activityCount: admin.firestore.FieldValue.increment(1),
//             isActive: true
//           }, { merge: true });
//         }
//       });
//   `
// };

// // Analytics Collection Schemas
// export const analyticsSchemas = {
//   userSession: {
//     userId: 'string',
//     sessionId: 'string',
//     startTime: 'timestamp',
//     endTime: 'timestamp',
//     lastActivity: 'timestamp',
//     isActive: 'boolean',
    
//     // Location data
//     country: 'string',
//     countryCode: 'string',
//     city: 'string',
//     region: 'string',
//     lat: 'number',
//     lng: 'number',
//     timezone: 'string',
//     ip: 'string',
//     isp: 'string',
    
//     // Device info
//     deviceType: 'string', // mobile, desktop, tablet
//     deviceModel: 'string',
//     os: 'string',
//     osVersion: 'string',
//     browser: 'string',
//     browserVersion: 'string',
//     screenWidth: 'number',
//     screenHeight: 'number',
    
//     // Activity metrics
//     pageViews: 'number',
//     clickCount: 'number',
//     scrollDepth: 'number',
//     totalTimeSpent: 'number',
//     engagementScore: 'number',
//     bounced: 'boolean',
    
//     // Technical data
//     connectionType: 'string',
//     performanceMetrics: 'object',
//     errors: 'number',
//     referrer: 'string'
//   },
  
//   userActivity: {
//     userId: 'string',
//     sessionId: 'string',
//     activityType: 'string', // page_view, click, scroll, form_submit, etc.
//     timestamp: 'timestamp',
//     url: 'string',
//     pathname: 'string',
//     data: 'object', // Activity-specific data
//     viewportSize: 'object'
//   },
  
//   locationAnalytics: {
//     country: 'string',
//     countryCode: 'string',
//     city: 'string',
//     region: 'string',
//     lat: 'number',
//     lng: 'number',
//     timezone: 'string',
//     totalUsers: 'number',
//     activeSessions: 'number',
//     lastUpdated: 'timestamp',
//     isActive: 'boolean'
//   },
  
//   hourlyAnalytics: {
//     timestamp: 'timestamp',
//     hour: 'number',
//     date: 'string',
//     country: 'string',
//     city: 'string',
//     users: 'number',
//     sessions: 'number',
//     totalTime: 'number',
//     devices: 'object',
//     browsers: 'object',
//     avgSessionDuration: 'number',
//     bounceRate: 'number'
//   }
// };

// // Helper functions for analytics
// export const analyticsHelpers = {
//   // Initialize dashboard data
//   initializeDashboard: async () => {
//     const dashboardRef = doc(db, 'dashboard_data', 'real_time');
//     await setDoc(dashboardRef, {
//       totalUsers: 0,
//       activeSessions: 0,
//       totalActivities: 0,
//       activities: {},
//       lastActivity: serverTimestamp(),
//       initialized: true
//     });
//   },
  
//   // Get dashboard metrics
//   getDashboardMetrics: async () => {
//     const dashboardDoc = await getDoc(doc(db, 'dashboard_data', 'real_time'));
//     return dashboardDoc.exists() ? dashboardDoc.data() : null;
//   },
  
//   // Create indexes for better query performance
//   createIndexes: [
//     'user_sessions: userId, isActive, lastActivity',
//     'user_sessions: country, city, isActive',
//     'user_sessions: startTime, endTime',
//     'user_activities: userId, timestamp',
//     'user_activities: activityType, timestamp',
//     'location_analytics: country, isActive',
//     'hourly_analytics: date, hour, country'
//   ]
// };

export default {
  app,
  auth,
  db,
  analytics,
  storage,
  // firestoreRules,
  // cloudFunctions,
  // analyticsSchemas,
  // analyticsHelpers
};