import { useEffect, useState } from "react";
import NotificationService from "../../services/notification.service";
import { toast } from "sonner";
import type { NotificationPayload } from "../../services/notification.service";

export const NotificationManager = () => {
  const [isTokenFound, setTokenFound] = useState(false);

  const setupNotifications = async () => {
    try {
      // Request permission and get token
      const token = await NotificationService.requestPermission();
      if (token) {
        setTokenFound(true);
        // Set up periodic token refresh
        setInterval(async () => {
          try {
            await NotificationService.refreshToken();
          } catch (error) {
            console.error("Failed to refresh token:", error);
          }
        }, 60 * 60 * 1000); // Check token every hour
      }

      // Set up message listener
      NotificationService.onMessageListener()
        .then((payload) => {
          const notificationPayload = payload as NotificationPayload;
          toast(notificationPayload.title, {
            description: notificationPayload.body,
          });
        })
        .catch((err: Error) => {
          console.log("Failed to receive foreground message: ", err);
          // If token is invalid, try to get a new one
          if (err.message.includes("token")) {
            setTokenFound(false);
          }
        });
    } catch (error) {
      console.error("Error setting up notifications:", error);
      setTokenFound(false);

      // If it's a permission error, show a toast
      if (error instanceof Error && error.message.includes("permission")) {
        toast.error("Please enable notifications to receive updates");
      }
    }
  };

  useEffect(() => {
    setupNotifications();
  }, []);

  // If token is not found, try to get it again
  useEffect(() => {
    if (!isTokenFound) {
      const retrySetup = setTimeout(() => {
        setupNotifications();
      }, 5000); // Retry after 5 seconds

      return () => clearTimeout(retrySetup);
    }
  }, [isTokenFound]);

  return null; // Component doesn't need to render anything
};
