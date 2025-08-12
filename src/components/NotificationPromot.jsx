import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);

  // This effect runs once to check if we should show the prompt
  useEffect(() => {
    // We only want to show this prompt if:
    // 1. The browser supports notifications.
    // 2. The permission is 'default' (the user hasn't already granted or denied it).
    // 3. The user hasn't already dismissed our custom prompt.
    const permissionStatus = Notification.permission;
    const dismissed = localStorage.getItem('notification_prompt_dismissed');

    if (permissionStatus === 'default' && !dismissed) {
      // Wait a few seconds before showing the prompt
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    // Remember that the user dismissed the prompt so we don't ask again
    localStorage.setItem('notification_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  const handleAllow = async () => {
    try {
      // Now we trigger the REAL browser permission prompt
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast.success('Great! Notifications are now enabled.');
        new Notification('Welcome!', { body: 'You will now receive updates from us.' });
      } else {
        toast.error('Notifications have been blocked. You can enable them in browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('There was an issue enabling notifications.');
    } finally {
        // Hide our custom prompt regardless of the outcome
        handleDismiss();
    }
  };
  
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-white rounded-lg shadow-2xl p-4 border border-gray-200 animate-fade-in-down">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <Bell className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">Get Notified!</h4>
          <p className="text-sm text-gray-600 mt-1">
            Allow notifications to receive important updates and alerts directly.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAllow}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Allow
            </button>
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
            >
              No, thanks
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Add some basic CSS animations if you want a smoother entry
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in-down {
    0% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  .animate-fade-in-down {
    animation: fade-in-down 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default NotificationPrompt;