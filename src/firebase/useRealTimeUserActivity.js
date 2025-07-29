// useRealTimeUserActivity.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import {
  getUserLocationAndDevice,
  startUserSession,
  trackUserActivity,
  trackPageView,
  trackClick,
  trackScroll,
  endUserSession
} from './firebaseRealTimeAnalytics';

export const useRealTimeUserActivity = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    activeSessions: [],
    recentActivities: [],
    locationAnalytics: [],
    dashboardMetrics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unsubscribesRef = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const lastScrollDepth = useRef(0);

  // Initialize user session when authenticated
  const initializeUserSession = useCallback(async (user) => {
    try {
      setLoading(true);
      const locationData = await getUserLocationAndDevice();
      const newSessionId = await startUserSession(user, locationData);
      setSessionId(newSessionId);
      setCurrentUser(user);
      setIsInitialized(true);
      
      // Track initial page view
      await trackPageView(window.location.pathname, {
        title: document.title,
        initialLoad: true
      });
      
    } catch (err) {
      console.error('Error initializing user session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time listeners
  const setupRealtimeListeners = useCallback(() => {
    const unsubscribes = [];

    // Listen to active sessions
    const activeSessionsQuery = query(
      collection(db, 'user_sessions'),
      where('isActive', '==', true),
      orderBy('lastActivity', 'desc'),
      limit(100)
    );

    const activeSessionsUnsubscribe = onSnapshot(activeSessionsQuery, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity?.toDate(),
        startTime: doc.data().startTime?.toDate()
      }));
      
      setRealTimeData(prev => ({
        ...prev,
        activeSessions: sessions
      }));
    }, (err) => {
      console.error('Error listening to active sessions:', err);
      setError(err.message);
    });

    unsubscribes.push(activeSessionsUnsubscribe);

    // Listen to recent activities
    const recentActivitiesQuery = query(
      collection(db, 'user_activities'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const activitiesUnsubscribe = onSnapshot(recentActivitiesQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      setRealTimeData(prev => ({
        ...prev,
        recentActivities: activities
      }));
    }, (err) => {
      console.error('Error listening to activities:', err);
    });

    unsubscribes.push(activitiesUnsubscribe);

    // Listen to location analytics
    const locationAnalyticsUnsubscribe = onSnapshot(
      collection(db, 'location_analytics'),
      (snapshot) => {
        const locations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate()
        }));
        
        setRealTimeData(prev => ({
          ...prev,
          locationAnalytics: locations
        }));
      },
      (err) => {
        console.error('Error listening to location analytics:', err);
      }
    );

    unsubscribes.push(locationAnalyticsUnsubscribe);

    // Listen to dashboard metrics
    const dashboardUnsubscribe = onSnapshot(
      doc(db, 'dashboard_data', 'real_time'),
      (snapshot) => {
        if (snapshot.exists()) {
          setRealTimeData(prev => ({
            ...prev,
            dashboardMetrics: {
              ...snapshot.data(),
              lastActivity: snapshot.data().lastActivity?.toDate()
            }
          }));
        }
      },
      (err) => {
        console.error('Error listening to dashboard metrics:', err);
      }
    );

    unsubscribes.push(dashboardUnsubscribe);

    return unsubscribes;
  }, []);

  // Track page views automatically
  const trackPageChange = useCallback(async (pathname) => {
    if (isInitialized && currentUser) {
      await trackPageView(pathname, {
        title: document.title,
        timestamp: new Date()
      });
    }
  }, [isInitialized, currentUser]);

  // Track clicks with debouncing
  const trackClickEvent = useCallback(async (event) => {
    if (!isInitialized || !currentUser) return;

    const target = event.target;
    const rect = target.getBoundingClientRect();
    
    await trackClick({
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      textContent: target.textContent,
      href: target.href,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      timestamp: new Date()
    });
  }, [isInitialized, currentUser]);

  // Track scroll with throttling
  const trackScrollEvent = useCallback(() => {
    if (!isInitialized || !currentUser) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = Math.round((scrollTop / documentHeight) * 100);

    // Only track if scroll depth increased by 10% or more
    if (scrollDepth > lastScrollDepth.current + 10) {
      lastScrollDepth.current = scrollDepth;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(async () => {
        await trackScroll(scrollDepth);
      }, 1000);
    }
  }, [isInitialized, currentUser]);

  // Track form interactions
  const trackFormInteraction = useCallback(async (event) => {
    if (!isInitialized || !currentUser) return;

    const target = event.target;
    await trackUserActivity('form_interaction', {
      formId: target.form?.id || 'unknown',
      fieldName: target.name || target.id || 'unknown',
      fieldType: target.type || 'unknown',
      action: event.type, // focus, blur, change, submit
      timestamp: new Date()
    });
  }, [isInitialized, currentUser]);

  // Track video interactions
  const trackVideoInteraction = useCallback(async (event, videoData = {}) => {
    if (!isInitialized || !currentUser) return;

    await trackUserActivity('video_interaction', {
      action: event.type, // play, pause, ended, etc.
      currentTime: event.target.currentTime || 0,
      duration: event.target.duration || 0,
      videoSrc: event.target.src || '',
      ...videoData,
      timestamp: new Date()
    });
  }, [isInitialized, currentUser]);

  // Get aggregated analytics data
  const getAnalyticsData = useCallback(async (timeRange = '24h') => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case '24h':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1);
      }

      // Get sessions in time range
      const sessionsQuery = query(
        collection(db, 'user_sessions'),
        where('startTime', '>=', startDate),
        where('startTime', '<=', endDate),
        orderBy('startTime', 'desc')
      );

      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
        lastActivity: doc.data().lastActivity?.toDate()
      }));

      // Aggregate data
      const analytics = {
        totalSessions: sessions.length,
        uniqueUsers: new Set(sessions.map(s => s.userId)).size,
        totalPageViews: sessions.reduce((sum, s) => sum + (s.pageViews || 0), 0),
        averageSessionDuration: sessions.reduce((sum, s) => sum + (s.totalTimeSpent || 0), 0) / sessions.length,
        bounceRate: (sessions.filter(s => s.bounced).length / sessions.length) * 100,
        topCountries: getTopItems(sessions, 'country'),
        topCities: getTopItems(sessions, 'city'),
        deviceBreakdown: getDeviceBreakdown(sessions),
        browserBreakdown: getBrowserBreakdown(sessions),
        hourlyActivity: getHourlyActivity(sessions),
        engagementMetrics: getEngagementMetrics(sessions)
      };

      return analytics;
    } catch (err) {
      console.error('Error getting analytics data:', err);
      throw err;
    }
  }, []);

  // Helper functions for analytics aggregation
  const getTopItems = (sessions, field) => {
    const counts = sessions.reduce((acc, session) => {
      const value = session[field];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };

  const getDeviceBreakdown = (sessions) => {
    const devices = sessions.reduce((acc, session) => {
      const device = session.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(devices).map(([name, value]) => ({ name, value }));
  };

  const getBrowserBreakdown = (sessions) => {
    const browsers = sessions.reduce((acc, session) => {
      const browser = session.browser || 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(browsers).map(([name, value]) => ({ name, value }));
  };

  const getHourlyActivity = (sessions) => {
    const hourly = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sessions: 0,
      users: new Set()
    }));

    sessions.forEach(session => {
      if (session.startTime) {
        const hour = session.startTime.getHours();
        hourly[hour].sessions++;
        hourly[hour].users.add(session.userId);
      }
    });

    return hourly.map(h => ({
      ...h,
      users: h.users.size
    }));
  };

  const getEngagementMetrics = (sessions) => {
    const engaged = sessions.filter(s => (s.totalTimeSpent || 0) > 30 && !s.bounced);
    const highEngagement = sessions.filter(s => (s.engagementScore || 0) > 100);

    return {
      engagementRate: (engaged.length / sessions.length) * 100,
      highEngagementRate: (highEngagement.length / sessions.length) * 100,
      averageEngagementScore: sessions.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / sessions.length
    };
  };

  // Initialize auth listener and event handlers
  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isInitialized) {
        initializeUserSession(user);
      } else if (!user && isInitialized) {
        endUserSession();
        setIsInitialized(false);
        setCurrentUser(null);
        setSessionId(null);
      }
    });

    return () => authUnsubscribe();
  }, [isInitialized, initializeUserSession]);

  // Set up real-time listeners when initialized
  useEffect(() => {
    if (isInitialized) {
      const unsubscribes = setupRealtimeListeners();
      unsubscribesRef.current = unsubscribes;

      return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe());
      };
    }
  }, [isInitialized, setupRealtimeListeners]);

  // Set up event listeners for user interactions
  useEffect(() => {
    if (isInitialized) {
      // Click tracking
      document.addEventListener('click', trackClickEvent);
      
      // Scroll tracking
      window.addEventListener('scroll', trackScrollEvent, { passive: true });
      
      // Form interaction tracking
      document.addEventListener('focus', trackFormInteraction, true);
      document.addEventListener('blur', trackFormInteraction, true);
      document.addEventListener('change', trackFormInteraction, true);
      document.addEventListener('submit', trackFormInteraction, true);

      // Video interaction tracking
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        ['play', 'pause', 'ended', 'seeked'].forEach(event => {
          video.addEventListener(event, trackVideoInteraction);
        });
      });

      return () => {
        document.removeEventListener('click', trackClickEvent);
        window.removeEventListener('scroll', trackScrollEvent);
        document.removeEventListener('focus', trackFormInteraction, true);
        document.removeEventListener('blur', trackFormInteraction, true);
        document.removeEventListener('change', trackFormInteraction, true);
        document.removeEventListener('submit', trackFormInteraction, true);

        videos.forEach(video => {
          ['play', 'pause', 'ended', 'seeked'].forEach(event => {
            video.removeEventListener(event, trackVideoInteraction);
          });
        });
      };
    }
  }, [isInitialized, trackClickEvent, trackScrollEvent, trackFormInteraction, trackVideoInteraction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
      if (isInitialized) {
        endUserSession();
      }
    };
  }, [isInitialized]);

  return {
    // State
    isInitialized,
    currentUser,
    sessionId,
    realTimeData,
    loading,
    error,
    
    // Methods
    trackPageChange,
    trackClickEvent,
    trackScrollEvent,
    trackFormInteraction,
    trackVideoInteraction,
    getAnalyticsData,
    
    // Manual tracking methods
    trackCustomEvent: (eventType, data) => trackUserActivity(eventType, data),
    trackConversion: (conversionType, value) => trackUserActivity('conversion', { type: conversionType, value }),
    trackError: (error, context) => trackUserActivity('error', { message: error.message, context })
  };
};

export default useRealTimeUserActivity;