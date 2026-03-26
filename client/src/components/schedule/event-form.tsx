import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Event } from "@shared/schema";
import { CalendarIcon, Bell, MapPin, AlignLeft, Clock, Tag, Trash2 } from "lucide-react";

interface EventFormProps {
  userId: number;
  event?: Event;
  defaultDate?: Date;
  onSubmit: (eventData: Partial<Event>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const C = { bg: '#e6e8d4', card: '#f0ede4', primary: '#7d9b6f', clay: '#c4a882', text: '#3d3d2e', muted: '#8a8a72', border: '#d8d5c8' };
const fieldStyle = { backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text };
const labelStyle = { color: C.muted, fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' };

const REMINDER_OPTIONS = [
  { label: "No reminder", value: "0" },
  { label: "5 minutes before", value: "5" },
  { label: "10 minutes before", value: "10" },
  { label: "15 minutes before", value: "15" },
  { label: "30 minutes before", value: "30" },
  { label: "1 hour before", value: "60" },
  { label: "2 hours before", value: "120" },
  { label: "1 day before", value: "1440" },
];

const EVENT_TYPES = ["personal", "work", "health", "family", "other"];

export default function EventForm({ userId, event, defaultDate = new Date(), onSubmit, onCancel, onDelete }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [type, setType] = useState(event?.type || "personal");
  const [date, setDate] = useState<Date>(event ? new Date(event.startTime) : defaultDate);
  const [startTime, setStartTime] = useState(event ? format(new Date(event.startTime), "HH:mm") : "09:00");
  const [endTime, setEndTime] = useState(event ? format(new Date(event.endTime), "HH:mm") : "10:00");
  const [isCompleted, setIsCompleted] = useState(event?.isCompleted || false);
  const [reminder, setReminder] = useState(String(event?.reminder || 0));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(date);
    const [sh, sm] = startTime.split(":").map(Number);
    startDateTime.setHours(sh, sm, 0, 0);

    const endDateTime = new Date(date);
    const [eh, em] = endTime.split(":").map(Number);
    endDateTime.setHours(eh, em, 0, 0);

    onSubmit({ title, description, location, type, startTime: startDateTime, endTime: endDateTime, isCompleted, reminder: parseInt(reminder) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Event title"
          className="border-0 w-full" style={fieldStyle} />
      </div>

      {/* Type + Status row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}><Tag className="h-3 w-3" /> Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="border-0 w-full" style={fieldStyle}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: C.card }}>
              {EVENT_TYPES.map(t => (
                <SelectItem key={t} value={t} style={{ color: C.text }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {event && (
          <div>
            <label style={labelStyle}>Status</label>
            <Select value={isCompleted ? "completed" : "pending"} onValueChange={v => setIsCompleted(v === "completed")}>
              <SelectTrigger className="border-0 w-full" style={fieldStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: C.card }}>
                <SelectItem value="pending" style={{ color: C.text }}>Pending</SelectItem>
                <SelectItem value="completed" style={{ color: C.text }}>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}><CalendarIcon className="h-3 w-3" /> Date</label>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal border-0" style={fieldStyle}>
              <CalendarIcon className="mr-2 h-4 w-4" style={{ color: C.muted }} />
              {format(date, "EEEE, MMMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <Calendar mode="single" selected={date} onSelect={d => { if (d) { setDate(d); setIsDatePickerOpen(false); } }} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Start + End times */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}><Clock className="h-3 w-3" /> Start Time</label>
          <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required
            className="border-0 w-full" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}><Clock className="h-3 w-3" /> End Time</label>
          <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required
            className="border-0 w-full" style={fieldStyle} />
        </div>
      </div>

      {/* Reminder */}
      <div>
        <label style={labelStyle}><Bell className="h-3 w-3" /> Reminder</label>
        <Select value={reminder} onValueChange={setReminder}>
          <SelectTrigger className="border-0 w-full" style={fieldStyle}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ backgroundColor: C.card }}>
            {REMINDER_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value} style={{ color: C.text }}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {reminder !== "0" && (
          <p className="text-xs mt-1" style={{ color: C.primary }}>
            You'll get an in-app notification {REMINDER_OPTIONS.find(o => o.value === reminder)?.label?.replace(' before', '')} before this event.
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label style={labelStyle}><MapPin className="h-3 w-3" /> Location</label>
        <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional location"
          className="border-0 w-full" style={fieldStyle} />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}><AlignLeft className="h-3 w-3" /> Notes</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Optional notes..." className="border-0 h-20 resize-none w-full" style={fieldStyle} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {onDelete && (
            <Button type="button" variant="ghost" onClick={onDelete} className="rounded-xl text-xs"
              style={{ color: '#c47a5a' }}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl border-0"
            style={{ backgroundColor: C.bg, color: C.muted }}>Cancel</Button>
          <Button type="submit" className="rounded-xl text-white border-0" style={{ backgroundColor: C.primary }}>Save Event</Button>
        </div>
      </div>
    </form>
  );
}
