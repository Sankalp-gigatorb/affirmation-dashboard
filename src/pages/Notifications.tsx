import React, { useState } from "react";
import NotificationService from "../services/notification.service";

const Notifications = () => {
  // Affirmation Reminder State
  const [affirmationTimes, setAffirmationTimes] = useState([""]);
  const [affirmationCount, setAffirmationCount] = useState(1);
  const [affirmationLoading, setAffirmationLoading] = useState(false);
  const [affirmationSuccess, setAffirmationSuccess] = useState("");
  const [affirmationError, setAffirmationError] = useState("");

  // Community Update State
  const [communityTitle, setCommunityTitle] = useState("");
  const [communityBody, setCommunityBody] = useState("");
  const [communityTime, setCommunityTime] = useState("");
  const [communityTarget, setCommunityTarget] = useState("all");
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communitySuccess, setCommunitySuccess] = useState("");
  const [communityError, setCommunityError] = useState("");

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementTime, setAnnouncementTime] = useState("");
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState("");
  const [announcementError, setAnnouncementError] = useState("");

  // Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState("");
  const [broadcastError, setBroadcastError] = useState("");

  // Handlers for Affirmation Reminders
  const handleAffirmationTimeChange = (idx: number, value: string) => {
    setAffirmationTimes((prev) => prev.map((t, i) => (i === idx ? value : t)));
  };
  const addAffirmationTime = () => setAffirmationTimes((prev) => [...prev, ""]);
  const removeAffirmationTime = (idx: number) =>
    setAffirmationTimes((prev) => prev.filter((_, i) => i !== idx));

  const handleAffirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAffirmationLoading(true);
    setAffirmationSuccess("");
    setAffirmationError("");
    try {
      await NotificationService.scheduleAffirmation({
        times: affirmationTimes.filter(Boolean),
        count: affirmationCount,
      });
      setAffirmationSuccess("Affirmation reminders scheduled!");
      setAffirmationTimes([""]);
      setAffirmationCount(1);
    } catch (err) {
      setAffirmationError("Failed to schedule affirmation reminders.");
    } finally {
      setAffirmationLoading(false);
    }
  };

  // Handlers for Community Update
  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommunityLoading(true);
    setCommunitySuccess("");
    setCommunityError("");
    try {
      await NotificationService.scheduleCommunityUpdate({
        title: communityTitle,
        body: communityBody,
        time: communityTime,
        target: communityTarget,
      });
      setCommunitySuccess("Community update scheduled!");
      setCommunityTitle("");
      setCommunityBody("");
      setCommunityTime("");
      setCommunityTarget("all");
    } catch (err) {
      setCommunityError("Failed to schedule community update.");
    } finally {
      setCommunityLoading(false);
    }
  };

  // Handlers for Announcement
  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncementLoading(true);
    setAnnouncementSuccess("");
    setAnnouncementError("");
    try {
      await NotificationService.scheduleAnnouncement({
        title: announcementTitle,
        body: announcementBody,
        time: announcementTime,
      });
      setAnnouncementSuccess("Announcement scheduled!");
      setAnnouncementTitle("");
      setAnnouncementBody("");
      setAnnouncementTime("");
    } catch (err) {
      setAnnouncementError("Failed to schedule announcement.");
    } finally {
      setAnnouncementLoading(false);
    }
  };

  // Handlers for Broadcast
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastLoading(true);
    setBroadcastSuccess("");
    setBroadcastError("");
    try {
      await NotificationService.broadcast({
        title: broadcastTitle,
        body: broadcastBody,
        target: broadcastTarget,
      });
      setBroadcastSuccess("Broadcast sent!");
      setBroadcastTitle("");
      setBroadcastBody("");
      setBroadcastTarget("all");
    } catch (err) {
      setBroadcastError("Failed to send broadcast.");
    } finally {
      setBroadcastLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Notifications
      </h1>

      {/* Affirmation Reminders */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🔔 Affirmation Reminders</h2>
        <p className="text-gray-600 mb-4">
          Push affirmation reminders at specific times each day.
        </p>
        <form
          onSubmit={handleAffirmationSubmit}
          className="space-y-3 bg-white p-4 rounded shadow"
        >
          <div>
            <label className="block mb-1 font-medium">
              Times (24h format, IST)
            </label>
            {affirmationTimes.map((time, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="time"
                  className="border p-2 rounded w-40"
                  value={time}
                  onChange={(e) =>
                    handleAffirmationTimeChange(idx, e.target.value)
                  }
                  required
                />
                {affirmationTimes.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeAffirmationTime(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 mt-1"
              onClick={addAffirmationTime}
            >
              + Add Time
            </button>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Affirmations per day
            </label>
            <input
              type="number"
              min={1}
              className="border p-2 rounded w-24"
              value={affirmationCount}
              onChange={(e) => setAffirmationCount(Number(e.target.value))}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={affirmationLoading}
          >
            {affirmationLoading ? "Scheduling..." : "Schedule Affirmations"}
          </button>
          {affirmationSuccess && (
            <div className="text-green-600">{affirmationSuccess}</div>
          )}
          {affirmationError && (
            <div className="text-red-600">{affirmationError}</div>
          )}
        </form>
      </div>

      {/* Community Update */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🔔 Community Update</h2>
        <p className="text-gray-600 mb-4">
          Schedule a community update for all or premium users.
        </p>
        <form
          onSubmit={handleCommunitySubmit}
          className="space-y-3 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={communityTitle}
            onChange={(e) => setCommunityTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Message body"
            value={communityBody}
            onChange={(e) => setCommunityBody(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={communityTime}
            onChange={(e) => setCommunityTime(e.target.value)}
            required
          />
          <select
            className="w-full border p-2 rounded"
            value={communityTarget}
            onChange={(e) => setCommunityTarget(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="premium">Premium Users</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={communityLoading}
          >
            {communityLoading ? "Scheduling..." : "Schedule Update"}
          </button>
          {communitySuccess && (
            <div className="text-green-600">{communitySuccess}</div>
          )}
          {communityError && (
            <div className="text-red-600">{communityError}</div>
          )}
        </form>
      </div>

      {/* Announcement */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🔔 System Announcement</h2>
        <p className="text-gray-600 mb-4">
          Schedule a system-wide announcement.
        </p>
        <form
          onSubmit={handleAnnouncementSubmit}
          className="space-y-3 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Message body"
            value={announcementBody}
            onChange={(e) => setAnnouncementBody(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={announcementTime}
            onChange={(e) => setAnnouncementTime(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={announcementLoading}
          >
            {announcementLoading ? "Scheduling..." : "Schedule Announcement"}
          </button>
          {announcementSuccess && (
            <div className="text-green-600">{announcementSuccess}</div>
          )}
          {announcementError && (
            <div className="text-red-600">{announcementError}</div>
          )}
        </form>
      </div>

      {/* Manual Broadcast */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📨 Manual Broadcast</h2>
        <p className="text-gray-600 mb-4">
          Send message to all/premium users (e.g., festival wishes, new feature
          alert)
        </p>
        <form
          onSubmit={handleBroadcastSubmit}
          className="space-y-3 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Message body"
            value={broadcastBody}
            onChange={(e) => setBroadcastBody(e.target.value)}
            required
          />
          <select
            className="w-full border p-2 rounded"
            value={broadcastTarget}
            onChange={(e) => setBroadcastTarget(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="premium">Premium Users</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={broadcastLoading}
          >
            {broadcastLoading ? "Sending..." : "Send Broadcast"}
          </button>
          {broadcastSuccess && (
            <div className="text-green-600">{broadcastSuccess}</div>
          )}
          {broadcastError && (
            <div className="text-red-600">{broadcastError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Notifications;
