import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isWeekend } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useEvents } from "@/hooks/use-events";
import EventForm from "@/components/schedule/event-form";
import CalendarView from "@/components/schedule/calendar-view";
import ScheduleList from "@/components/dashboard/schedule-list";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@shared/schema";

interface ScheduleProps {
  userId: number;
}

export default function Schedule({ userId }: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const { events, todayEvents, isLoading, createEvent, updateEvent, deleteEvent } = useEvents(userId);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditEventOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = (id: number) => {
    deleteEvent(id);
    setIsEditEventOpen(false);
  };

  const handleUpdateEvent = (id: number, eventData: Partial<Event>) => {
    updateEvent({ id, event: eventData });
    setIsEditEventOpen(false);
  };

  // Filter events for selected date
  const selectedDateEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600">Manage your events and appointments</p>
        </div>
        <Button onClick={handleAddEvent} className="bg-primary hover:bg-primary/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full" onValueChange={(v) => setView(v as "calendar" | "list")}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid md:grid-cols-7 gap-6">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <CalendarView 
                    events={events} 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onEventClick={handleEventClick}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "MMMM d, yyyy")}
                  {isToday(selectedDate) && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Today
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : selectedDateEvents.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No events scheduled for this date</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleAddEvent}
                    >
                      Add Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{event.title}</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            event.type === "work" ? "bg-primary" :
                            event.type === "health" ? "bg-secondary" :
                            "bg-blue-500"
                          )}></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                        </div>
                        {event.location && (
                          <div className="text-xs text-gray-500 mt-1">
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <ScheduleList events={todayEvents} showViewAll={false} />
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No upcoming events</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 10).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(event.startTime), "MMM d")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-500 mt-1">
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            userId={userId}
            defaultDate={selectedDate}
            onSubmit={(eventData) => {
              createEvent({
                ...eventData,
                userId,
              });
              setIsAddEventOpen(false);
            }}
            onCancel={() => setIsAddEventOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              userId={userId}
              event={selectedEvent}
              onSubmit={(eventData) => {
                if (selectedEvent) {
                  handleUpdateEvent(selectedEvent.id, eventData);
                }
              }}
              onCancel={() => setIsEditEventOpen(false)}
              onDelete={() => {
                if (selectedEvent) {
                  handleDeleteEvent(selectedEvent.id);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
