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
import { Plus, Footprints, Droplets, Moon } from "lucide-react";

interface HealthProps {
  userId: number;
}

export default function Health({ userId }: HealthProps) {
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [healthTimeframe, setHealthTimeframe] = useState<"week" | "month" | "year">("week");
  const [selectedTabPanel, setSelectedTabPanel] = useState("overview");

  const { healthMetrics, todayMetric, isLoading, createHealthMetric, updateHealthMetric } = useHealth(userId);
  const { data: weeklyHealthData, isLoading: isLoadingWeekly } = useHealth(userId).getWeeklyHealth();
  
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const monthAgo = subMonths(today, 1);
  
  const { data: selectedTimeframeData, isLoading: isLoadingTimeframeData } = healthTimeframe === "week" 
    ? useHealth(userId).getHealthByDateRange(weekAgo, today)
    : useHealth(userId).getHealthByDateRange(monthAgo, today);

  const handleAddMetric = () => { setIsAddMetricOpen(true); };

  const handleLogHealth = (data: Partial<HealthMetric>) => {
    if (todayMetric) {
      updateHealthMetric({ id: todayMetric.id, metric: { ...data, date: new Date() } });
    } else {
      createHealthMetric({
        userId, date: new Date(),
        steps: data.steps || 0, waterIntake: data.waterIntake || 0,
        sleepHours: data.sleepHours || 0, notes: data.notes || ""
      });
    }
    setIsAddMetricOpen(false);
  };

  const calculateWeeklyAverages = () => {
    if (!weeklyHealthData || weeklyHealthData.length === 0) return { steps: 0, sleep: 0, water: 0 };
    return {
      steps: Math.round(weeklyHealthData.reduce((s, d) => s + d.steps, 0) / weeklyHealthData.length),
      sleep: +(weeklyHealthData.reduce((s, d) => s + d.sleepHours, 0) / weeklyHealthData.length).toFixed(1),
      water: +(weeklyHealthData.reduce((s, d) => s + d.waterIntake, 0) / weeklyHealthData.length).toFixed(1)
    };
  };

  const weeklyAverages = calculateWeeklyAverages();

  const metricCards = [
    { title: "Steps", value: todayMetric?.steps || 0, unit: "steps today", goal: 10000, icon: Footprints, color: '#5a7a50' },
    { title: "Water", value: todayMetric?.waterIntake || 0, unit: "glasses today", goal: 8, icon: Droplets, color: '#7d9b6f' },
    { title: "Sleep", value: todayMetric?.sleepHours || 0, unit: "hours last night", goal: 8, icon: Moon, color: '#c4a882' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>Health</h1>
          <p style={{ color: '#8a8a72' }}>Monitor your daily health metrics</p>
        </div>
        <Button onClick={handleAddMetric} className="rounded-xl text-white border-0 hover:opacity-90" style={{ backgroundColor: '#7d9b6f' }}>
          <Plus className="h-5 w-5 mr-2" />
          Log Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((card) => (
          <Card key={card.title} className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <card.icon className="h-6 w-6 mb-2" style={{ color: card.color }} />
                <div className="text-3xl font-bold" style={{ color: card.color }}>
                  {isLoading ? <Skeleton className="h-10 w-24" style={{ backgroundColor: '#d8d5c8' }} /> : card.value}
                </div>
                <div className="text-sm mt-1" style={{ color: '#8a8a72' }}>{card.unit}</div>
                <div className="w-full rounded-full h-2 mt-4" style={{ backgroundColor: '#d8d5c8' }}>
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((card.value / card.goal) * 100, 100)}%`, backgroundColor: card.color }}></div>
                </div>
                <div className="text-xs mt-1" style={{ color: '#8a8a72' }}>
                  {Math.round((card.value / card.goal) * 100)}% of goal ({card.goal.toLocaleString()})
                </div>
                <div className="text-sm font-medium mt-3" style={{ color: '#5a5a48' }}>
                  Avg: {card.title === "Steps" ? weeklyAverages.steps : card.title === "Water" ? weeklyAverages.water : weeklyAverages.sleep}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" onValueChange={setSelectedTabPanel}>
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: '#f0ede4' }}>
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardHeader>
                <CardTitle style={{ color: '#3d3d2e' }}>Health Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly ? (
                  <Skeleton className="h-[300px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
                ) : (
                  <HealthChart data={weeklyHealthData || []} timeframe={healthTimeframe} onTimeframeChange={setHealthTimeframe} />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardHeader>
                <CardTitle style={{ color: '#3d3d2e' }}>Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
                ) : (
                  <HealthSummary
                    health={{
                      steps: todayMetric?.steps || 0, stepsGoal: 10000,
                      waterIntake: todayMetric?.waterIntake || 0, waterGoal: 8,
                      sleepHours: todayMetric?.sleepHours || 0, sleepGoal: 8,
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
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: '#3d3d2e' }}>Health History</CardTitle>
                <div className="flex space-x-2">
                  {(["week", "month"] as const).map((tf) => (
                    <Button key={tf} variant={healthTimeframe === tf ? "default" : "outline"} size="sm" className="rounded-lg" onClick={() => setHealthTimeframe(tf)}>
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTimeframeData ? (
                <div className="space-y-3">
                  {Array(7).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />
                  ))}
                </div>
              ) : selectedTimeframeData && selectedTimeframeData.length > 0 ? (
                <div className="space-y-3">
                  {selectedTimeframeData.map((metric) => (
                    <div key={metric.id} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(125, 155, 111, 0.08)' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: '#3d3d2e' }}>{format(new Date(metric.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-sm"><span style={{ color: '#8a8a72' }}>Steps: </span><span className="font-medium" style={{ color: '#3d3d2e' }}>{metric.steps}</span></div>
                        <div className="text-sm"><span style={{ color: '#8a8a72' }}>Water: </span><span className="font-medium" style={{ color: '#3d3d2e' }}>{metric.waterIntake}</span></div>
                        <div className="text-sm"><span style={{ color: '#8a8a72' }}>Sleep: </span><span className="font-medium" style={{ color: '#3d3d2e' }}>{metric.sleepHours}h</span></div>
                      </div>
                      {metric.notes && (<div className="text-xs mt-2" style={{ color: '#8a8a72' }}>{metric.notes}</div>)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: '#8a8a72' }}>
                  <p>No health data for this period</p>
                  <Button variant="outline" className="mt-2 rounded-xl" onClick={handleAddMetric}>Log Activity</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3d3d2e' }}>Log Health Activity</DialogTitle>
          </DialogHeader>
          <HealthForm
            defaultValues={{
              steps: todayMetric?.steps || 0, waterIntake: todayMetric?.waterIntake || 0,
              sleepHours: todayMetric?.sleepHours || 0, notes: todayMetric?.notes || ""
            }}
            onSubmit={handleLogHealth}
            onCancel={() => setIsAddMetricOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
