import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";
import api from "./api.config";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  time?: string;
  audience?: string;
}

const NotificationService = {
  requestPermission: async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted" && messaging) {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        // Send FCM token to backend
        await api.post("/notifications/token", { token });
        return token;
      }
      throw new Error("Notification permission denied");
    } catch (error) {
      console.error("Error getting notification permission:", error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      if (!messaging) {
        throw new Error("Messaging is not initialized");
      }
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        // Send new token to backend
        await api.post("/notifications/token", { token: currentToken });
        return currentToken;
      }
      throw new Error("Failed to get new token");
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },

  onMessageListener: () =>
    new Promise((resolve) => {
      if (!messaging) {
        console.error("Messaging is not initialized");
        return;
      }
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }),

  // Function to display notification
  showNotification: ({ title, body, data }: NotificationPayload) => {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/vite.svg",
        data,
      });
    }
  },

  scheduleAffirmation: async (payload: NotificationPayload) => {
    return api.post("/admin/notifications/schedule/affirmations", payload);
  },

  scheduleCommunityUpdate: async (payload: NotificationPayload) => {
    return api.post(
      "/admin/notifications/schedule/community-update",
      payload
    );
  },

  scheduleAnnouncement: async (payload: NotificationPayload) => {
    return api.post("/admin/notifications/schedule/announcement", payload);
  },

  broadcast: async (payload: NotificationPayload) => {
    return api.post("/admin/notifications/broadcast", payload);
  },
};

export default NotificationService;
