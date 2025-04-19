import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { HealthMetric } from "@shared/schema";
import { Label } from "@/components/ui/label";

interface HealthFormProps {
  defaultValues: {
    steps: number;
    waterIntake: number;
    sleepHours: number;
    notes: string;
  };
  onSubmit: (data: Partial<HealthMetric>) => void;
  onCancel: () => void;
}

export default function HealthForm({ defaultValues, onSubmit, onCancel }: HealthFormProps) {
  const [steps, setSteps] = useState(defaultValues.steps);
  const [waterIntake, setWaterIntake] = useState(defaultValues.waterIntake);
  const [sleepHours, setSleepHours] = useState(defaultValues.sleepHours);
  const [notes, setNotes] = useState(defaultValues.notes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      steps,
      waterIntake,
      sleepHours,
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Steps</Label>
          <div className="flex gap-4 items-center">
            <Input
              type="number"
              value={steps}
              min={0}
              max={50000}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-24"
            />
            <Slider
              value={[steps]}
              min={0}
              max={20000}
              step={100}
              onValueChange={(value) => setSteps(value[0])}
              className="flex-1"
            />
          </div>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>0</span>
            <span>Daily Goal: 10,000</span>
            <span>20,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Water Intake (glasses)</Label>
          <div className="flex gap-4 items-center">
            <Input
              type="number"
              value={waterIntake}
              min={0}
              max={20}
              onChange={(e) => setWaterIntake(parseInt(e.target.value))}
              className="w-24"
            />
            <Slider
              value={[waterIntake]}
              min={0}
              max={12}
              step={1}
              onValueChange={(value) => setWaterIntake(value[0])}
              className="flex-1"
            />
          </div>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>0</span>
            <span>Daily Goal: 8</span>
            <span>12</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sleep (hours)</Label>
          <div className="flex gap-4 items-center">
            <Input
              type="number"
              value={sleepHours}
              min={0}
              max={24}
              step={0.5}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-24"
            />
            <Slider
              value={[sleepHours * 10]} // Multiplied by 10 to work with half-hour steps
              min={0}
              max={120}
              step={5} // 0.5 hour steps
              onValueChange={(value) => setSleepHours(value[0] / 10)}
              className="flex-1"
            />
          </div>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>0</span>
            <span>Daily Goal: 8</span>
            <span>12</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about your health today..."
            className="h-24"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-secondary hover:bg-secondary/90">Save</Button>
      </div>
    </form>
  );
}
