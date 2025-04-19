import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Event } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export default function CalendarView({ events, selectedDate, onDateSelect, onEventClick }: CalendarViewProps) {
  // Group events by date for the calendar display
  const eventsByDate: Record<string, Event[]> = {};
  
  events.forEach(event => {
    const dateKey = format(new Date(event.startTime), "yyyy-MM-dd");
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  return (
    <div className="p-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md"
        classNames={{
          day_today: "bg-primary/10 text-primary font-bold",
          day_selected: "bg-primary text-primary-foreground font-bold",
        }}
        components={{
          Day: ({ day, ...props }) => {
            // Add a safety check for undefined day
            if (!day || !day.date) {
              return <div {...props} />;
            }
            
            const date = day.date;
            const dateKey = format(date, "yyyy-MM-dd");
            const dayEvents = eventsByDate[dateKey] || [];
            const hasEvents = dayEvents.length > 0;
            
            return (
              <div 
                {...props}
                className={cn(
                  props.className,
                  "relative p-2 text-center",
                  hasEvents && !isSameDay(date, selectedDate) && "font-medium"
                )}
              >
                {format(date, "d")}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex justify-center space-x-0.5">
                    {/* Display up to 3 dots for events, color coded by type */}
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <span 
                        key={i} 
                        className={cn(
                          "h-1 w-1 rounded-full",
                          event.type === "work" ? "bg-primary" :
                          event.type === "health" ? "bg-secondary" :
                          event.type === "family" ? "bg-purple-500" :
                          "bg-blue-500"
                        )}
                      />
                    ))}
                    {/* Add a + indicator if there are more than 3 events */}
                    {dayEvents.length > 3 && (
                      <span className="text-xs leading-none text-gray-400">+</span>
                    )}
                  </div>
                )}
              </div>
            );
          }
        }}
      />
      
      {/* Events Preview for Selected Date */}
      <div className="mt-4 hidden md:block">
        <h3 className="font-medium text-gray-700 mb-2">
          Events for {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(() => {
            const dateKey = format(selectedDate, "yyyy-MM-dd");
            const selectedDateEvents = eventsByDate[dateKey] || [];
            
            if (selectedDateEvents.length === 0) {
              return (
                <p className="text-sm text-gray-500">No events scheduled</p>
              );
            }
            
            return selectedDateEvents
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map(event => (
                <div 
                  key={event.id}
                  className="flex px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <div className="w-16 text-xs text-gray-500">
                    {format(new Date(event.startTime), "h:mm a")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.title}</div>
                    {event.location && (
                      <div className="text-xs text-gray-500">{event.location}</div>
                    )}
                  </div>
                </div>
              ));
          })()}
        </div>
      </div>
    </div>
  );
}
