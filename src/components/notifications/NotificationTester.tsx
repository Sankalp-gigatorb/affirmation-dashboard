import { Button } from "@/components/ui/button";
import api from "@/services/api.config";
import { toast } from "sonner";

export const NotificationTester = () => {
  const testPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      toast.success(`Notification permission: ${permission}`);
    } catch (error) {
      toast.error("Failed to request permission");
    }
  };

  const testLocalNotification = () => {
    try {
      new Notification("Test Local Notification", {
        body: "This is a test local notification",
        icon: "/vite.svg",
      });
      toast.success("Local notification sent");
    } catch (error) {
      toast.error("Failed to send local notification");
    }
  };

  const testBackendNotification = async () => {
    try {
      await api.post("/notifications/test", {
        title: "Test Backend Notification",
        body: "This is a test notification from the backend",
      });
      toast.success("Backend notification request sent");
    } catch (error) {
      toast.error("Failed to send backend notification");
    }
  };

  const testScheduledNotification = async () => {
    try {
      await api.post("/notifications/test-scheduled", {
        delay: 10, // seconds
        title: "Scheduled Notification",
        body: "This notification was scheduled 10 seconds ago",
      });
      toast.success("Scheduled notification request sent");
    } catch (error) {
      toast.error("Failed to schedule notification");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Notification Tester</h2>

      <div className="grid gap-4">
        <Button onClick={testPermission} variant="outline">
          Test Permission
        </Button>

        <Button onClick={testLocalNotification} variant="outline">
          Test Local Notification
        </Button>

        <Button onClick={testBackendNotification} variant="outline">
          Test Backend Notification
        </Button>

        <Button onClick={testScheduledNotification} variant="outline">
          Test Scheduled Notification (10s)
        </Button>
      </div>
    </div>
  );
};
