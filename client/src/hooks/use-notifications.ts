import { useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useNotifications() {
  const { user } = useAuth();

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  const sendNotification = useCallback((title: string, body: string, icon?: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (!user?.notificationsEnabled) return;
    new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
    });
  }, [user?.notificationsEnabled]);

  const scheduleEventReminder = useCallback((eventTitle: string, startTime: Date, reminderMinutes: number) => {
    const now = new Date();
    const reminderTime = new Date(startTime.getTime() - reminderMinutes * 60 * 1000);
    const delay = reminderTime.getTime() - now.getTime();
    if (delay <= 0) return;
    const timeout = setTimeout(() => {
      sendNotification(
        `Reminder: ${eventTitle}`,
        `Starting in ${reminderMinutes} minute${reminderMinutes !== 1 ? 's' : ''}`,
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, [sendNotification]);

  return {
    permission: typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
    requestPermission,
    sendNotification,
    scheduleEventReminder,
  };
}
