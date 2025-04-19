import { Link } from "wouter";
import { HealthMetric } from "@shared/schema";

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
  // Calculate percentages for progress bars
  const waterPercentage = (metric.waterIntake / metric.waterGoal) * 100;
  const sleepPercentage = (metric.sleepHours / metric.sleepGoal) * 100;
  const stepsPercentage = (metric.steps / metric.stepsGoal) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Health Tracking</h3>
        <Link href="/health">
          <a className="text-sm text-primary hover:text-indigo-700">Add Entry</a>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Water Intake</span>
            <span className="text-sm font-medium text-gray-700">
              {metric.waterIntake} / {metric.waterGoal} glasses
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(waterPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Sleep</span>
            <span className="text-sm font-medium text-gray-700">
              {metric.sleepHours} hours
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${Math.min(sleepPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Steps</span>
            <span className="text-sm font-medium text-gray-700">
              {metric.steps.toLocaleString()} / {metric.stepsGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full"
              style={{ width: `${Math.min(stepsPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={onLogActivity}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-green-600 transition-colors duration-200"
      >
        Log Health Activity
      </button>
    </div>
  );
}
