import { useState } from "react";
import { useHealth } from "@/hooks/use-health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HealthChart from "@/components/charts/health-chart";
import HealthForm from "@/components/health/health-form";
import HealthSummary from "@/components/health/health-summary";
import { format, subDays, subMonths } from "date-fns";
import { HealthMetric } from "@shared/schema";

interface HealthProps {
  userId: number;
}

export default function Health({ userId }: HealthProps) {
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [healthTimeframe, setHealthTimeframe] = useState<"week" | "month" | "year">("week");
  const [selectedTabPanel, setSelectedTabPanel] = useState("overview");

  const { 
    healthMetrics, 
    todayMetric, 
    isLoading, 
    createHealthMetric, 
    updateHealthMetric 
  } = useHealth(userId);

  const { data: weeklyHealthData, isLoading: isLoadingWeekly } = useHealth(userId).getWeeklyHealth();
  
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const monthAgo = subMonths(today, 1);
  
  const { 
    data: selectedTimeframeData,
    isLoading: isLoadingTimeframeData
  } = healthTimeframe === "week" 
    ? useHealth(userId).getHealthByDateRange(weekAgo, today)
    : useHealth(userId).getHealthByDateRange(monthAgo, today);

  const handleAddMetric = () => {
    setIsAddMetricOpen(true);
  };

  const handleLogHealth = (data: Partial<HealthMetric>) => {
    if (todayMetric) {
      updateHealthMetric({ 
        id: todayMetric.id, 
        metric: { 
          ...data, 
          date: new Date()
        } 
      });
    } else {
      createHealthMetric({
        userId,
        date: new Date(),
        steps: data.steps || 0,
        waterIntake: data.waterIntake || 0,
        sleepHours: data.sleepHours || 0,
        notes: data.notes || ""
      });
    }
    setIsAddMetricOpen(false);
  };

  // Calculate weekly averages
  const calculateWeeklyAverages = () => {
    if (!weeklyHealthData || weeklyHealthData.length === 0) {
      return { steps: 0, sleep: 0, water: 0 };
    }

    const totalSteps = weeklyHealthData.reduce((sum, day) => sum + day.steps, 0);
    const totalSleep = weeklyHealthData.reduce((sum, day) => sum + day.sleepHours, 0);
    const totalWater = weeklyHealthData.reduce((sum, day) => sum + day.waterIntake, 0);
    
    return {
      steps: Math.round(totalSteps / weeklyHealthData.length),
      sleep: +(totalSleep / weeklyHealthData.length).toFixed(1),
      water: +(totalWater / weeklyHealthData.length).toFixed(1)
    };
  };

  const weeklyAverages = calculateWeeklyAverages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Tracking</h1>
          <p className="text-gray-600">Monitor your daily health metrics</p>
        </div>
        <Button onClick={handleAddMetric} className="bg-secondary hover:bg-secondary/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Log Health Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-10 w-24" /> : todayMetric?.steps || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">steps today</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${Math.min(((todayMetric?.steps || 0) / 10000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((todayMetric?.steps || 0) / 10000) * 100)}% of daily goal (10,000)
              </div>
              <div className="text-sm font-medium mt-4">
                Weekly Average: {weeklyAverages.steps}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-500">
                {isLoading ? <Skeleton className="h-10 w-24" /> : todayMetric?.waterIntake || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">glasses today</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(((todayMetric?.waterIntake || 0) / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((todayMetric?.waterIntake || 0) / 8) * 100)}% of daily goal (8 glasses)
              </div>
              <div className="text-sm font-medium mt-4">
                Weekly Average: {weeklyAverages.water}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-500">
                {isLoading ? <Skeleton className="h-10 w-24" /> : todayMetric?.sleepHours || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">hours last night</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${Math.min(((todayMetric?.sleepHours || 0) / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((todayMetric?.sleepHours || 0) / 8) * 100)}% of daily goal (8 hours)
              </div>
              <div className="text-sm font-medium mt-4">
                Weekly Average: {weeklyAverages.sleep}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={setSelectedTabPanel}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <HealthChart
                    data={weeklyHealthData || []}
                    timeframe={healthTimeframe}
                    onTimeframeChange={setHealthTimeframe}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <HealthSummary
                    health={{
                      steps: todayMetric?.steps || 0,
                      stepsGoal: 10000,
                      waterIntake: todayMetric?.waterIntake || 0,
                      waterGoal: 8,
                      sleepHours: todayMetric?.sleepHours || 0,
                      sleepGoal: 8,
                      notes: todayMetric?.notes || ""
                    }}
                    weeklyAverages={weeklyAverages}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Health History</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={healthTimeframe === "week" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setHealthTimeframe("week")}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={healthTimeframe === "month" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setHealthTimeframe("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTimeframeData ? (
                <div className="space-y-3">
                  {Array(7).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : selectedTimeframeData && selectedTimeframeData.length > 0 ? (
                <div className="space-y-3">
                  {selectedTimeframeData.map((metric) => (
                    <div key={metric.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{format(new Date(metric.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Steps: </span>
                          <span className="font-medium">{metric.steps}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Water: </span>
                          <span className="font-medium">{metric.waterIntake} glasses</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Sleep: </span>
                          <span className="font-medium">{metric.sleepHours} hours</span>
                        </div>
                      </div>
                      {metric.notes && (
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Notes: </span>
                          {metric.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No health data available for this timeframe</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleAddMetric}
                  >
                    Log Health Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Health Metric Dialog */}
      <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Log Health Activity</DialogTitle>
          </DialogHeader>
          <HealthForm
            defaultValues={{
              steps: todayMetric?.steps || 0,
              waterIntake: todayMetric?.waterIntake || 0,
              sleepHours: todayMetric?.sleepHours || 0,
              notes: todayMetric?.notes || ""
            }}
            onSubmit={handleLogHealth}
            onCancel={() => setIsAddMetricOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
