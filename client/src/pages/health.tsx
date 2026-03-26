import { useState } from "react";
import { useHealth } from "@/hooks/use-health";
import { useGoals } from "@/hooks/use-goals";
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
import { Plus, Footprints, Droplets, Moon, Flame, Target, TrendingUp, TrendingDown, Minus, Settings } from "lucide-react";
import { Link } from "wouter";

interface HealthProps {
  userId: number;
}

const C = { bg: '#e6e8d4', card: '#f0ede4', primary: '#7d9b6f', clay: '#c4a882', text: '#3d3d2e', muted: '#8a8a72', border: '#d8d5c8' };

export default function Health({ userId }: HealthProps) {
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [healthTimeframe, setHealthTimeframe] = useState<"week" | "month">("week");

  const { healthMetrics, todayMetric, isLoading, createHealthMetric, updateHealthMetric } = useHealth(userId);
  const { goals } = useGoals(userId);
  const { data: weeklyHealthData, isLoading: isLoadingWeekly } = useHealth(userId).getWeeklyHealth();
  
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const monthAgo = subMonths(today, 1);
  
  const { data: selectedTimeframeData, isLoading: isLoadingTimeframeData } = healthTimeframe === "week" 
    ? useHealth(userId).getHealthByDateRange(weekAgo, today)
    : useHealth(userId).getHealthByDateRange(monthAgo, today);

  const stepsGoal = goals?.stepsGoal || 10000;
  const waterGoal = goals?.waterGoal || 8;
  const sleepGoal = goals?.sleepGoal || 8;
  const caloriesGoal = goals?.caloriesGoal || 2000;

  const handleLogHealth = (data: Partial<HealthMetric>) => {
    if (todayMetric) {
      updateHealthMetric({ id: todayMetric.id, metric: { ...data, date: new Date() } });
    } else {
      createHealthMetric({
        userId, date: new Date(),
        steps: data.steps || 0, waterIntake: data.waterIntake || 0,
        sleepHours: data.sleepHours || 0, calories: data.calories || 0, notes: data.notes || ""
      });
    }
    setIsAddMetricOpen(false);
  };

  const calculateWeeklyAverages = () => {
    if (!weeklyHealthData || weeklyHealthData.length === 0) return { steps: 0, sleep: 0, water: 0, calories: 0 };
    return {
      steps: Math.round(weeklyHealthData.reduce((s, d) => s + (d.steps || 0), 0) / weeklyHealthData.length),
      sleep: +(weeklyHealthData.reduce((s, d) => s + (d.sleepHours || 0), 0) / weeklyHealthData.length).toFixed(1),
      water: +(weeklyHealthData.reduce((s, d) => s + (d.waterIntake || 0), 0) / weeklyHealthData.length).toFixed(1),
      calories: Math.round(weeklyHealthData.reduce((s, d) => s + (d.calories || 0), 0) / weeklyHealthData.length),
    };
  };

  const weeklyAverages = calculateWeeklyAverages();

  const getTrend = (current: number, average: number) => {
    if (average === 0) return null;
    const pct = ((current - average) / average) * 100;
    if (pct > 5) return { icon: TrendingUp, color: '#5a7a50', label: `+${pct.toFixed(0)}%` };
    if (pct < -5) return { icon: TrendingDown, color: '#c47a5a', label: `${pct.toFixed(0)}%` };
    return { icon: Minus, color: C.muted, label: 'On track' };
  };

  const metricCards = [
    { title: "Steps", value: todayMetric?.steps || 0, unit: "steps", goal: stepsGoal, icon: Footprints, color: '#5a7a50', avg: weeklyAverages.steps },
    { title: "Water", value: todayMetric?.waterIntake || 0, unit: "glasses", goal: waterGoal, icon: Droplets, color: '#7d9b6f', avg: weeklyAverages.water },
    { title: "Sleep", value: todayMetric?.sleepHours || 0, unit: "hours", goal: sleepGoal, icon: Moon, color: '#c4a882', avg: weeklyAverages.sleep },
    { title: "Calories", value: todayMetric?.calories || 0, unit: "kcal", goal: caloriesGoal, icon: Flame, color: '#c47a5a', avg: weeklyAverages.calories },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.text }}>Health</h1>
          <p className="text-sm" style={{ color: C.muted }}>Track your daily health metrics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="sm" className="rounded-xl border-0" style={{ backgroundColor: C.card, color: C.muted }}>
              <Target className="h-4 w-4 mr-1" /> Goals
            </Button>
          </Link>
          <Button onClick={() => setIsAddMetricOpen(true)} className="rounded-xl text-white border-0" style={{ backgroundColor: C.primary }}>
            <Plus className="h-4 w-4 mr-2" /> Log Activity
          </Button>
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metricCards.map((card) => {
          const pct = Math.min((card.value / card.goal) * 100, 100);
          const trend = getTrend(card.value, card.avg);
          return (
            <Card key={card.title} className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                    <card.icon className="h-4 w-4" style={{ color: card.color }} />
                  </div>
                  {trend && (
                    <div className="flex items-center gap-0.5">
                      <trend.icon className="h-3 w-3" style={{ color: trend.color }} />
                      <span className="text-xs" style={{ color: trend.color }}>{trend.label}</span>
                    </div>
                  )}
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mb-1" style={{ backgroundColor: C.border }} />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: C.text }}>{card.value.toLocaleString()}</div>
                )}
                <div className="text-xs mb-2" style={{ color: C.muted }}>{card.unit} · goal: {card.goal.toLocaleString()}</div>
                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: C.border }}>
                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: card.color }} />
                </div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>{pct.toFixed(0)}%</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: C.card }}>
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-lg">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: C.text }}>Health Trends</CardTitle>
                  <div className="flex gap-2">
                    {(["week", "month"] as const).map(tf => (
                      <button key={tf} onClick={() => setHealthTimeframe(tf)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{ backgroundColor: healthTimeframe === tf ? C.primary : C.bg, color: healthTimeframe === tf ? 'white' : C.muted }}>
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly ? (
                  <Skeleton className="h-[300px] w-full" style={{ backgroundColor: C.border }} />
                ) : (
                  <HealthChart data={weeklyHealthData || []} timeframe={healthTimeframe} onTimeframeChange={setHealthTimeframe} />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader><CardTitle style={{ color: C.text }}>Weekly Averages vs Goals</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Steps", avg: weeklyAverages.steps, goal: stepsGoal, color: '#5a7a50' },
                    { label: "Water (glasses)", avg: weeklyAverages.water, goal: waterGoal, color: '#7d9b6f' },
                    { label: "Sleep (hours)", avg: weeklyAverages.sleep, goal: sleepGoal, color: '#c4a882' },
                    { label: "Calories", avg: weeklyAverages.calories, goal: caloriesGoal, color: '#c47a5a' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: C.text }}>{item.label}</span>
                        <span style={{ color: C.muted }}>{item.avg.toLocaleString()} / {item.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: C.border }}>
                        <div className="h-2 rounded-full" style={{ width: `${Math.min((item.avg / item.goal) * 100, 100)}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: C.text }}>Health History</CardTitle>
                <div className="flex gap-2">
                  {(["week", "month"] as const).map(tf => (
                    <button key={tf} onClick={() => setHealthTimeframe(tf)}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                      style={{ backgroundColor: healthTimeframe === tf ? C.primary : C.bg, color: healthTimeframe === tf ? 'white' : C.muted }}>
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTimeframeData ? (
                <div className="space-y-3">{Array(7).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: C.border }} />)}</div>
              ) : selectedTimeframeData && selectedTimeframeData.length > 0 ? (
                <div className="space-y-3">
                  {selectedTimeframeData.map(metric => (
                    <div key={metric.id} className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: C.text }}>{format(new Date(metric.date), "EEEE, MMM d")}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Steps", value: metric.steps?.toLocaleString() },
                          { label: "Water", value: `${metric.waterIntake}g` },
                          { label: "Sleep", value: `${metric.sleepHours}h` },
                          { label: "Cal", value: metric.calories?.toLocaleString() || '—' },
                        ].map(f => (
                          <div key={f.label} className="text-center">
                            <div className="text-xs" style={{ color: C.muted }}>{f.label}</div>
                            <div className="text-sm font-medium" style={{ color: C.text }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      {metric.notes && <div className="text-xs mt-2" style={{ color: C.muted }}>{metric.notes}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: C.muted }}>
                  <p>No health data for this period</p>
                  <Button variant="outline" className="mt-2 rounded-xl" onClick={() => setIsAddMetricOpen(true)}>Log Activity</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-4">
            {[
              {
                title: "Step Performance",
                value: weeklyAverages.steps >= stepsGoal ? "Goal met! 🎉" : `${(stepsGoal - weeklyAverages.steps).toLocaleString()} steps short`,
                detail: `You average ${weeklyAverages.steps.toLocaleString()} steps/day vs your ${stepsGoal.toLocaleString()} goal.`,
                color: weeklyAverages.steps >= stepsGoal ? '#5a7a50' : '#c47a5a',
              },
              {
                title: "Hydration",
                value: weeklyAverages.water >= waterGoal ? "Well hydrated! 💧" : `Drink ${(waterGoal - weeklyAverages.water).toFixed(1)} more glasses`,
                detail: `Averaging ${weeklyAverages.water} glasses/day. Target: ${waterGoal} glasses.`,
                color: weeklyAverages.water >= waterGoal ? '#5a7a50' : '#c47a5a',
              },
              {
                title: "Sleep Quality",
                value: weeklyAverages.sleep >= sleepGoal ? "Great sleep! 😴" : `Sleep ${(sleepGoal - weeklyAverages.sleep).toFixed(1)}h more`,
                detail: `Averaging ${weeklyAverages.sleep}h/night. Target: ${sleepGoal}h.`,
                color: weeklyAverages.sleep >= sleepGoal ? '#5a7a50' : '#c47a5a',
              },
            ].map(insight => (
              <Card key={insight.title} className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: insight.color }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{insight.title}</p>
                      <p className="font-medium" style={{ color: insight.color }}>{insight.value}</p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{insight.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-0" style={{ backgroundColor: C.card }}>
          <DialogHeader>
            <DialogTitle style={{ color: C.text }}>Log Health Activity</DialogTitle>
          </DialogHeader>
          <HealthForm
            defaultValues={{ steps: todayMetric?.steps || 0, waterIntake: todayMetric?.waterIntake || 0, sleepHours: todayMetric?.sleepHours || 0, notes: todayMetric?.notes || "" }}
            onSubmit={handleLogHealth}
            onCancel={() => setIsAddMetricOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
