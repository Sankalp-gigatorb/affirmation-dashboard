import { getToken } from "firebase/messaging";
import { messaging } from "../config/firebase";
import api from "../services/api.config";

export const setupFCM = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);

    if (permission === "granted" && messaging) {
      console.log("Getting FCM token...");
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log("FCM token obtained:", token);
        // Send FCM token to backend
        console.log("Sending FCM token to backend...");
        await api.post("/notifications/token", { token });
        console.log("FCM token saved successfully");
        return token;
      } else {
        console.log("No FCM token received");
      }
    } else {
      console.log(
        "Notification permission not granted or messaging not initialized"
      );
    }
    return null;
  } catch (error) {
    console.error("Error setting up FCM:", error);
    return null;
  }
};
