import { Link } from "wouter";
import { Event } from "@shared/schema";
import { format } from "date-fns";

interface ScheduleListProps {
  events: Event[];
  showViewAll?: boolean;
}

export default function ScheduleList({ events, showViewAll = true }: ScheduleListProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
        {showViewAll && (
          <Link href="/schedule">
            <a className="text-sm text-primary hover:text-indigo-700">View all</a>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              <div className="flex flex-col items-center mr-4">
                <span className="text-xs font-medium text-gray-500">
                  {format(new Date(event.startTime), "h:mm")}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(event.startTime), "a")}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                <p className="text-xs text-gray-500">{event.description}</p>
              </div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-1",
                  event.type === "work" ? "bg-primary" :
                  event.type === "health" ? "bg-secondary" :
                  "bg-blue-500"
                )}
              ></div>
            </div>
          ))
        ) : (
          <div className="p-3 text-sm text-gray-500 text-center">
            No events scheduled for today
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for class merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
