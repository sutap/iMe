import { Link } from "wouter";
import { Droplets, Moon, Footprints } from "lucide-react";

interface HealthTrackerProps {
  metric: {
    steps: number;
    stepsGoal: number;
    waterIntake: number;
    waterGoal: number;
    sleepHours: number;
    sleepGoal: number;
  };
  onLogActivity?: () => void;
}

export default function HealthTracker({ metric, onLogActivity }: HealthTrackerProps) {
  const waterPercentage = (metric.waterIntake / metric.waterGoal) * 100;
  const sleepPercentage = (metric.sleepHours / metric.sleepGoal) * 100;
  const stepsPercentage = (metric.steps / metric.stepsGoal) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold" style={{ color: '#3d3d2e' }}>Health Tracking</h3>
        <Link href="/health">
          <a className="text-sm font-medium" style={{ color: '#7d9b6f' }}>Add Entry</a>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4" style={{ color: '#7d9b6f' }} />
              <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>Water Intake</span>
            </div>
            <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>
              {metric.waterIntake} / {metric.waterGoal} glasses
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#d8d5c8' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(waterPercentage, 100)}%`, backgroundColor: '#7d9b6f' }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" style={{ color: '#c4a882' }} />
              <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>Sleep</span>
            </div>
            <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>
              {metric.sleepHours} hours
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#d8d5c8' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(sleepPercentage, 100)}%`, backgroundColor: '#c4a882' }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4" style={{ color: '#5a7a50' }} />
              <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>Steps</span>
            </div>
            <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>
              {metric.steps.toLocaleString()} / {metric.stepsGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#d8d5c8' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stepsPercentage, 100)}%`, backgroundColor: '#5a7a50' }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={onLogActivity}
        className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:opacity-90"
        style={{ backgroundColor: '#7d9b6f' }}
      >
        Log Health Activity
      </button>
    </div>
  );
}
