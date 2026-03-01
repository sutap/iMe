import { useState } from "react";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/use-events";
import EventForm from "@/components/schedule/event-form";
import CalendarView from "@/components/schedule/calendar-view";
import ScheduleList from "@/components/dashboard/schedule-list";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@shared/schema";
import { Plus, ChevronRight } from "lucide-react";

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
          <h1 className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>Schedule</h1>
          <p style={{ color: '#8a8a72' }}>Manage your events and appointments</p>
        </div>
        <Button onClick={handleAddEvent} className="rounded-xl text-white border-0 hover:opacity-90" style={{ backgroundColor: '#7d9b6f' }}>
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full" onValueChange={(v) => setView(v as "calendar" | "list")}>
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: '#f0ede4' }}>
          <TabsTrigger value="calendar" className="rounded-lg">Calendar</TabsTrigger>
          <TabsTrigger value="list" className="rounded-lg">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid md:grid-cols-7 gap-6">
            <Card className="md:col-span-5 border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardHeader>
                <CardTitle style={{ color: '#3d3d2e' }}>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
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

            <Card className="md:col-span-2 border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardHeader>
                <CardTitle style={{ color: '#3d3d2e' }}>
                  {format(selectedDate, "MMMM d, yyyy")}
                  {isToday(selectedDate) && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(125, 155, 111, 0.15)', color: '#5a7a50' }}>
                      Today
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />
                    ))}
                  </div>
                ) : selectedDateEvents.length === 0 ? (
                  <div className="text-center py-6" style={{ color: '#8a8a72' }}>
                    <p>No events scheduled</p>
                    <Button variant="outline" className="mt-2 rounded-xl" onClick={handleAddEvent}>
                      Add Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-xl cursor-pointer transition-colors"
                        style={{ backgroundColor: 'rgba(125, 155, 111, 0.08)' }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium" style={{ color: '#3d3d2e' }}>{event.title}</span>
                          <div className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                            style={{
                              backgroundColor: event.type === "work" ? 'rgba(125, 155, 111, 0.15)' : 'rgba(196, 168, 130, 0.2)',
                              color: event.type === "work" ? '#5a7a50' : '#a08050'
                            }}
                          >
                            {event.type || 'Event'}
                          </div>
                        </div>
                        <div className="text-sm mt-1" style={{ color: '#8a8a72' }}>
                          {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                        </div>
                        {event.location && (
                          <div className="text-xs mt-1" style={{ color: '#8a8a72' }}>{event.location}</div>
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
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#3d3d2e' }}>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />
                  ))}
                </div>
              ) : (
                <ScheduleList events={todayEvents} showViewAll={false} />
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6 border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#3d3d2e' }}>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-6" style={{ color: '#8a8a72' }}>
                  <p>No upcoming events</p>
                  <Button variant="outline" className="mt-2 rounded-xl" onClick={handleAddEvent}>Add Event</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 10).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl cursor-pointer transition-colors"
                      style={{ backgroundColor: 'rgba(125, 155, 111, 0.08)' }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: '#3d3d2e' }}>{event.title}</span>
                        <span className="text-xs" style={{ color: '#8a8a72' }}>
                          {format(new Date(event.startTime), "MMM d")}
                        </span>
                      </div>
                      <div className="text-sm mt-1" style={{ color: '#8a8a72' }}>
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3d3d2e' }}>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            userId={userId}
            defaultDate={selectedDate}
            onSubmit={(eventData) => {
              createEvent({ ...eventData, userId });
              setIsAddEventOpen(false);
            }}
            onCancel={() => setIsAddEventOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3d3d2e' }}>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              userId={userId}
              event={selectedEvent}
              onSubmit={(eventData) => {
                if (selectedEvent) handleUpdateEvent(selectedEvent.id, eventData);
              }}
              onCancel={() => setIsEditEventOpen(false)}
              onDelete={() => { if (selectedEvent) handleDeleteEvent(selectedEvent.id); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
