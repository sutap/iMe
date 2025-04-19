import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Event } from "@shared/schema";

interface EventFormProps {
  userId: number;
  event?: Event;
  defaultDate?: Date;
  onSubmit: (eventData: Partial<Event>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function EventForm({ userId, event, defaultDate = new Date(), onSubmit, onCancel, onDelete }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [type, setType] = useState(event?.type || "personal");
  const [date, setDate] = useState<Date>(event ? new Date(event.startTime) : defaultDate);
  const [startTime, setStartTime] = useState(event ? format(new Date(event.startTime), "HH:mm") : "09:00");
  const [endTime, setEndTime] = useState(event ? format(new Date(event.endTime), "HH:mm") : "10:00");
  const [isCompleted, setIsCompleted] = useState(event?.isCompleted || false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create date objects from selected date and times
    const startDateTime = new Date(date);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(date);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes);

    onSubmit({
      title,
      description,
      location,
      type,
      startTime: startDateTime,
      endTime: endDateTime,
      isCompleted
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Title
          </label>
          <Input
            type="text"
            className="col-span-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Description
          </label>
          <Textarea
            className="col-span-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Location
          </label>
          <Input
            type="text"
            className="col-span-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Type
          </label>
          <Select
            value={type}
            onValueChange={setType}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Date
          </label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="col-span-3 text-left justify-start font-normal"
              >
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) {
                    setDate(date);
                    setIsDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            Start Time
          </label>
          <Input
            type="time"
            className="col-span-3"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium">
            End Time
          </label>
          <Input
            type="time"
            className="col-span-3"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {event && (
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">
              Status
            </label>
            <Select
              value={isCompleted ? "completed" : "pending"}
              onValueChange={(value) => setIsCompleted(value === "completed")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <div className="flex-1"></div>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
