import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Event, InsertEvent } from "@shared/schema";

export function useEvents(userId: number) {
  const eventsQuery = useQuery<Event[]>({
    queryKey: [`/api/events/${userId}`],
    enabled: !!userId,
  });

  const todayEventsQuery = useQuery<Event[]>({
    queryKey: [`/api/events/${userId}/today`],
    enabled: !!userId,
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent: InsertEvent) => 
      apiRequest("POST", "/api/events", newEvent),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}/today`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, event }: { id: number; event: Partial<Event> }) =>
      apiRequest("PUT", `/api/events/${id}`, event),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}/today`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/events/${userId}/today`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  return {
    events: eventsQuery.data || [],
    todayEvents: todayEventsQuery.data || [],
    isLoading: eventsQuery.isLoading || todayEventsQuery.isLoading,
    isError: eventsQuery.isError || todayEventsQuery.isError,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}
