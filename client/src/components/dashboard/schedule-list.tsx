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
        <h3 className="font-semibold" style={{ color: '#3d3d2e' }}>Today's Schedule</h3>
        {showViewAll && (
          <Link href="/schedule">
            <a className="text-sm font-medium" style={{ color: '#7d9b6f' }}>View all</a>
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start p-3 rounded-xl transition-colors duration-150"
              style={{ backgroundColor: 'rgba(125, 155, 111, 0.06)' }}
            >
              <div className="flex flex-col items-center mr-4 min-w-[48px]">
                <span className="text-xs font-semibold" style={{ color: '#5a7a50' }}>
                  {format(new Date(event.startTime), "h:mm")}
                </span>
                <span className="text-[10px]" style={{ color: '#8a8a72' }}>
                  {format(new Date(event.startTime), "a")}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium" style={{ color: '#3d3d2e' }}>{event.title}</h4>
                <p className="text-xs" style={{ color: '#8a8a72' }}>{event.description}</p>
              </div>
              <div
                className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{
                  backgroundColor: event.type === "work" ? 'rgba(125, 155, 111, 0.15)' : event.type === "health" ? 'rgba(196, 168, 130, 0.2)' : 'rgba(138, 138, 114, 0.15)',
                  color: event.type === "work" ? '#5a7a50' : event.type === "health" ? '#a08050' : '#6a6a58'
                }}
              >
                {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-center rounded-xl" style={{ color: '#8a8a72', backgroundColor: 'rgba(125, 155, 111, 0.06)' }}>
            No events scheduled for today
          </div>
        )}
      </div>
    </div>
  );
}
