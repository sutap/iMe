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
    calories?: number;
    notes: string;
  };
  onSubmit: (data: Partial<HealthMetric>) => void;
  onCancel: () => void;
}

export default function HealthForm({ defaultValues, onSubmit, onCancel }: HealthFormProps) {
  const [steps, setSteps] = useState(defaultValues.steps);
  const [waterIntake, setWaterIntake] = useState(defaultValues.waterIntake);
  const [sleepHours, setSleepHours] = useState(defaultValues.sleepHours);
  const [calories, setCalories] = useState(defaultValues.calories || 0);
  const [notes, setNotes] = useState(defaultValues.notes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ steps, waterIntake, sleepHours, calories, notes });
  };

  const fieldStyle = { backgroundColor: '#e6e8d4', border: '1px solid #d8d5c8', borderRadius: '10px', color: '#3d3d2e' };
  const labelStyle = { color: '#5a5a48', fontSize: '0.875rem', fontWeight: 500 };
  const hintStyle = { color: '#8a8a72', fontSize: '0.75rem' };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <Label style={labelStyle}>Steps</Label>
        <div className="flex gap-3 items-center">
          <Input type="number" value={steps} min={0} max={50000}
            onChange={e => setSteps(parseInt(e.target.value) || 0)}
            className="w-24 border-0" style={fieldStyle} />
          <Slider value={[steps]} min={0} max={20000} step={100}
            onValueChange={v => setSteps(v[0])} className="flex-1" />
        </div>
        <div className="flex justify-between" style={hintStyle}><span>0</span><span>Goal: 10,000</span><span>20,000</span></div>
      </div>

      <div className="space-y-1">
        <Label style={labelStyle}>Water Intake (glasses)</Label>
        <div className="flex gap-3 items-center">
          <Input type="number" value={waterIntake} min={0} max={20}
            onChange={e => setWaterIntake(parseInt(e.target.value) || 0)}
            className="w-24 border-0" style={fieldStyle} />
          <Slider value={[waterIntake]} min={0} max={12} step={1}
            onValueChange={v => setWaterIntake(v[0])} className="flex-1" />
        </div>
        <div className="flex justify-between" style={hintStyle}><span>0</span><span>Goal: 8</span><span>12</span></div>
      </div>

      <div className="space-y-1">
        <Label style={labelStyle}>Sleep (hours)</Label>
        <div className="flex gap-3 items-center">
          <Input type="number" value={sleepHours} min={0} max={24} step={0.5}
            onChange={e => setSleepHours(parseFloat(e.target.value) || 0)}
            className="w-24 border-0" style={fieldStyle} />
          <Slider value={[sleepHours * 10]} min={0} max={120} step={5}
            onValueChange={v => setSleepHours(v[0] / 10)} className="flex-1" />
        </div>
        <div className="flex justify-between" style={hintStyle}><span>0</span><span>Goal: 8h</span><span>12h</span></div>
      </div>

      <div className="space-y-1">
        <Label style={labelStyle}>Calories (kcal)</Label>
        <div className="flex gap-3 items-center">
          <Input type="number" value={calories} min={0} max={5000}
            onChange={e => setCalories(parseInt(e.target.value) || 0)}
            className="w-24 border-0" style={fieldStyle} />
          <Slider value={[calories]} min={0} max={4000} step={50}
            onValueChange={v => setCalories(v[0])} className="flex-1" />
        </div>
        <div className="flex justify-between" style={hintStyle}><span>0</span><span>Goal: 2,000</span><span>4,000</span></div>
      </div>

      <div className="space-y-1">
        <Label style={labelStyle}>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Any notes about your health today..."
          className="h-20 border-0 resize-none" style={fieldStyle} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#8a8a72' }}>Cancel</Button>
        <Button type="submit" className="rounded-xl text-white border-0" style={{ backgroundColor: '#7d9b6f' }}>Save</Button>
      </div>
    </form>
  );
}
