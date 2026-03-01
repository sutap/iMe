import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/stat-card";
import ScheduleList from "@/components/dashboard/schedule-list";
import HealthTracker from "@/components/dashboard/health-tracker";
import TransactionsList from "@/components/dashboard/transactions-list";
import Recommendations from "@/components/dashboard/recommendations";
import HealthChart from "@/components/charts/health-chart";
import FinanceChart from "@/components/charts/finance-chart";
import { useEvents } from "@/hooks/use-events";
import { useHealth } from "@/hooks/use-health";
import { useFinance } from "@/hooks/use-finance";
import { useRecommendations } from "@/hooks/use-recommendations";
import { DashboardStats } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Footprints, DollarSign, Search, Plus, Droplets } from "lucide-react";

interface DashboardProps {
  userId: number;
}

export default function Dashboard({ userId }: DashboardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [healthTimeframe, setHealthTimeframe] = useState<"week" | "month" | "year">("week");
  const [financeTimeframe, setFinanceTimeframe] = useState<"week" | "month" | "year">("week");
  const [recommendationFilter, setRecommendationFilter] = useState<string>("all");
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: [`/api/dashboard/${userId}`],
    enabled: !!userId,
  });

  const { todayEvents } = useEvents(userId);
  const { healthMetrics, createHealthMetric } = useHealth(userId);
  const { transactions } = useFinance(userId);
  const { recommendations } = useRecommendations(userId);
  const { data: weeklyHealthData, isLoading: isLoadingHealthData } = useHealth(userId).getWeeklyHealth();
  const { data: weeklyFinanceData, isLoading: isLoadingFinanceData } = useFinance(userId).getWeeklyTransactions();

  const filteredRecommendations = recommendationFilter === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.type === recommendationFilter);

  const handleHealthLogSubmit = (data: { steps: number, water: number, sleep: number }) => {
    createHealthMetric({
      userId,
      date: new Date(),
      steps: data.steps,
      waterIntake: data.water,
      sleepHours: data.sleep,
      notes: ""
    });
    setHealthDialogOpen(false);
    toast({
      title: "Health data logged",
      description: "Your health metrics have been updated successfully.",
      variant: "default"
    });
  };

  const displayName = user?.displayName?.split(' ')[0] || user?.username || 'Alex';

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>
              Good morning, {displayName}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8a8a72' }}>
              {format(new Date(), "EEEE, MMMM d")}
            </p>
          </div>
          <button className="p-2 rounded-xl" style={{ backgroundColor: '#f0ede4', color: '#7d9b6f' }}>
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {isLoadingStats ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card">
              <Skeleton className="h-4 w-20 mb-2" style={{ backgroundColor: '#d8d5c8' }} />
              <Skeleton className="h-6 w-14" style={{ backgroundColor: '#d8d5c8' }} />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Events"
              value={`${dashboardStats?.todayEventsCount || 0}`}
              icon={<Calendar className="h-5 w-5" style={{ color: '#7d9b6f' }} />}
              iconBg=""
              trend={dashboardStats?.nextEvent ? {
                direction: "up",
                label: `Next: ${format(new Date(dashboardStats.nextEvent.startTime), "h:mm a")}`,
              } : undefined}
            />
            <StatCard
              title="Steps"
              value={dashboardStats?.stepsToday.toLocaleString() || "0"}
              icon={<Footprints className="h-5 w-5" style={{ color: '#5a7a50' }} />}
              iconBg=""
              trend={{
                direction: "neutral",
                label: `${Math.round((dashboardStats?.stepsToday || 0) / (dashboardStats?.stepsGoal || 1) * 100)}% goal`,
              }}
            />
            <StatCard
              title="Expenses"
              value={`$${dashboardStats?.expenseThisMonth.toFixed(0) || "0"}`}
              icon={<DollarSign className="h-5 w-5" style={{ color: '#c4a882' }} />}
              iconBg=""
              trend={{
                direction: "up",
                label: `${Math.round(100 - ((dashboardStats?.expenseThisMonth || 0) / (dashboardStats?.budgetThisMonth || 1) * 100))}% under`,
              }}
            />
            <StatCard
              title="Tips"
              value={`${dashboardStats?.recommendationsCount || 0}`}
              icon={<Search className="h-5 w-5" style={{ color: '#8a8a72' }} />}
              iconBg=""
              trend={{ direction: "up", label: "New for you" }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {isLoadingHealthData ? (
          <div className="card">
            <Skeleton className="h-5 w-24 mb-4" style={{ backgroundColor: '#d8d5c8' }} />
            <Skeleton className="h-[180px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
          </div>
        ) : (
          <HealthChart data={weeklyHealthData || []} timeframe={healthTimeframe} onTimeframeChange={setHealthTimeframe} />
        )}
        {isLoadingFinanceData ? (
          <div className="card">
            <Skeleton className="h-5 w-24 mb-4" style={{ backgroundColor: '#d8d5c8' }} />
            <Skeleton className="h-[180px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
          </div>
        ) : (
          <FinanceChart data={weeklyFinanceData || []} timeframe={financeTimeframe} onTimeframeChange={setFinanceTimeframe} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ScheduleList events={todayEvents} />
        <HealthTracker
          metric={{
            steps: dashboardStats?.stepsToday || 0,
            stepsGoal: dashboardStats?.stepsGoal || 10000,
            waterIntake: dashboardStats?.waterIntake || 0,
            waterGoal: dashboardStats?.waterGoal || 8,
            sleepHours: dashboardStats?.sleepHours || 0,
            sleepGoal: dashboardStats?.sleepGoal || 8,
          }}
          onLogActivity={() => setHealthDialogOpen(true)}
        />
        <TransactionsList transactions={transactions.slice(0, 3)} />
      </div>

      <Recommendations
        recommendations={filteredRecommendations}
        onFilterChange={setRecommendationFilter}
        activeFilter={recommendationFilter}
      />

      <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3d3d2e' }}>Log Health Activity</DialogTitle>
            <DialogDescription style={{ color: '#8a8a72' }}>
              Update your health metrics for today
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium" style={{ color: '#5a5a48' }}>Steps</label>
              <input
                type="number"
                className="col-span-3 flex h-10 w-full rounded-xl border-0 px-3 py-2 text-sm"
                style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }}
                defaultValue={dashboardStats?.stepsToday || 0}
                id="steps"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium" style={{ color: '#5a5a48' }}>Water</label>
              <input
                type="number"
                className="col-span-3 flex h-10 w-full rounded-xl border-0 px-3 py-2 text-sm"
                style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }}
                defaultValue={dashboardStats?.waterIntake || 0}
                id="water"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium" style={{ color: '#5a5a48' }}>Sleep</label>
              <input
                type="number"
                step="0.1"
                className="col-span-3 flex h-10 w-full rounded-xl border-0 px-3 py-2 text-sm"
                style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }}
                defaultValue={dashboardStats?.sleepHours || 0}
                id="sleep"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200"
              style={{ backgroundColor: '#e6e8d4', color: '#5a5a48' }}
              onClick={() => setHealthDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#7d9b6f' }}
              onClick={() => {
                const stepsEl = document.getElementById('steps') as HTMLInputElement;
                const waterEl = document.getElementById('water') as HTMLInputElement;
                const sleepEl = document.getElementById('sleep') as HTMLInputElement;
                handleHealthLogSubmit({
                  steps: parseInt(stepsEl.value),
                  water: parseInt(waterEl.value),
                  sleep: parseFloat(sleepEl.value)
                });
              }}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
