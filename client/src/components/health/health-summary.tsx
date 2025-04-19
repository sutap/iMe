import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface HealthSummaryProps {
  health: {
    steps: number;
    stepsGoal: number;
    waterIntake: number;
    waterGoal: number;
    sleepHours: number;
    sleepGoal: number;
    notes: string;
  };
  weeklyAverages: {
    steps: number;
    water: number;
    sleep: number;
  };
}

export default function HealthSummary({ health, weeklyAverages }: HealthSummaryProps) {
  // Calculate percentages for progress bars
  const stepsPercentage = Math.min((health.steps / health.stepsGoal) * 100, 100);
  const waterPercentage = Math.min((health.waterIntake / health.waterGoal) * 100, 100);
  const sleepPercentage = Math.min((health.sleepHours / health.sleepGoal) * 100, 100);

  // Calculate comparison with weekly averages
  const stepsComparison = health.steps - weeklyAverages.steps;
  const waterComparison = health.waterIntake - weeklyAverages.water;
  const sleepComparison = health.sleepHours - weeklyAverages.sleep;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Steps</span>
            <span className="text-sm font-medium text-gray-700">
              {health.steps.toLocaleString()} / {health.stepsGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={stepsPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Daily Goal: {health.stepsGoal.toLocaleString()}</span>
            <span className={stepsComparison >= 0 ? "text-green-500" : "text-red-500"}>
              {stepsComparison > 0 ? "+" : ""}{stepsComparison.toLocaleString()} from avg
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Water Intake</span>
            <span className="text-sm font-medium text-gray-700">
              {health.waterIntake} / {health.waterGoal} glasses
            </span>
          </div>
          <Progress value={waterPercentage} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Daily Goal: {health.waterGoal} glasses</span>
            <span className={waterComparison >= 0 ? "text-green-500" : "text-red-500"}>
              {waterComparison > 0 ? "+" : ""}{waterComparison.toFixed(1)} from avg
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Sleep</span>
            <span className="text-sm font-medium text-gray-700">
              {health.sleepHours} / {health.sleepGoal} hours
            </span>
          </div>
          <Progress value={sleepPercentage} className="h-2 bg-indigo-100" indicatorClassName="bg-indigo-500" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Daily Goal: {health.sleepGoal} hours</span>
            <span className={sleepComparison >= 0 ? "text-green-500" : "text-red-500"}>
              {sleepComparison > 0 ? "+" : ""}{sleepComparison.toFixed(1)} from avg
            </span>
          </div>
        </div>
      </div>

      {health.notes && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <h3 className="text-sm font-medium mb-2">Today's Notes</h3>
            <p className="text-sm text-gray-600">{health.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-xl font-bold text-primary">{weeklyAverages.steps.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Avg. Daily Steps</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-xl font-bold text-blue-500">{weeklyAverages.water.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Avg. Water Glasses</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-xl font-bold text-indigo-500">{weeklyAverages.sleep.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Avg. Sleep Hours</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Health Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium">Sleep Recommendation</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Your sleep patterns show irregular hours. Try to maintain a consistent sleep schedule, even on weekends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium">Activity Achievement</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    You've been consistent with your step goals this week. Keep up the good work to maintain this healthy habit!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
