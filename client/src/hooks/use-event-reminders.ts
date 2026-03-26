import { useEffect, useRef } from "react";
import { useEvents } from "@/hooks/use-events";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useEventReminders(userId: number) {
  const { events } = useEvents(userId);
  const { sendNotification } = useNotifications();
  const { toast } = useToast();
  const { user } = useAuth();

  // Track which reminder keys we've already scheduled across re-renders
  const scheduledKeys = useRef<Set<string>>(new Set());
  // Store active timeouts so we can cancel them on unmount
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (!events || events.length === 0) return;
    const now = Date.now();

    events.forEach(event => {
      if (!event.reminder || event.reminder <= 0) return;

      const startTime = new Date(event.startTime).getTime();
      const reminderTime = startTime - event.reminder * 60 * 1000;
      const delay = reminderTime - now;

      // Skip reminders that are in the past
      if (delay <= 0) return;

      // Skip if we already scheduled this exact reminder
      const key = `${event.id}-${event.reminder}`;
      if (scheduledKeys.current.has(key)) return;

      scheduledKeys.current.add(key);

      const timeout = setTimeout(() => {
        const mins = event.reminder!;
        const label = mins === 1 ? "1 minute" : `${mins} minutes`;

        // Browser push notification (requires permission)
        sendNotification(
          `Reminder: ${event.title}`,
          `Starting in ${label}${event.location ? ` at ${event.location}` : ""}`,
        );

        // In-app toast — always shows regardless of notification permission
        toast({
          title: `Upcoming: ${event.title}`,
          description: `Starting in ${label}${event.location ? ` · ${event.location}` : ""}`,
          duration: 10000,
        });

        // Allow re-scheduling if the event data changes later
        scheduledKeys.current.delete(key);
        timeouts.current.delete(key);
      }, delay);

      timeouts.current.set(key, timeout);
    });
  }, [events, sendNotification, toast]);

  // Cancel all pending timeouts when this hook unmounts (user logs out etc.)
  useEffect(() => {
    return () => {
      timeouts.current.forEach(t => clearTimeout(t));
      timeouts.current.clear();
      scheduledKeys.current.clear();
    };
  }, []);
}
