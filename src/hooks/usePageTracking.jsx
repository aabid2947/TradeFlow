// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { analytics } from '@/firebase/firebaseConfig';
// import { logEvent } from 'firebase/analytics';
// const usePageTracking = () => {
// const location = useLocation();
// useEffect(() => {
// // Log the page view event to Firebase Analytics
// logEvent(analytics, 'page_view', {
// page_path: location.pathname,
// });
// }, [location]);
// };
// export default usePageTracking;