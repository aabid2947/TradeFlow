import { useEffect } from 'react';

const NotificationPermissionHandler = () => {
  useEffect(() => {
    // Only proceed if the browser supports notifications
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification.");
      return;
    }

    // Check the current permission status. 
    // We only want to ask if the user has NOT already made a choice.
    if (Notification.permission === 'default') {
      const askForPermission = async () => {
        // This line triggers the NATIVE BROWSER PROMPT from your image
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Optional: Show a welcome notification
          new Notification('Welcome!', { body: 'Notifications are enabled.' });
        } else {
          console.log('Notification permission denied.');
        }
      };

      // Ask for permission after a short delay
      const timer = setTimeout(askForPermission, 2000);
      return () => clearTimeout(timer);
    }

  }, []); // Empty array means this runs only once when the app loads.

  // This component does not render any visible UI
  return null;
};

export default NotificationPermissionHandler;