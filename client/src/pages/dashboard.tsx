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

interface DashboardProps {
  userId: number;
}

export default function Dashboard({ userId }: DashboardProps) {
  const { toast } = useToast();
  const [healthTimeframe, setHealthTimeframe] = useState<"week" | "month" | "year">("week");
  const [financeTimeframe, setFinanceTimeframe] = useState<"week" | "month" | "year">("week");
  const [recommendationFilter, setRecommendationFilter] = useState<string>("all");
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: [`/api/dashboard/${userId}`],
    enabled: !!userId,
  });

  // Fetch module data
  const { todayEvents } = useEvents(userId);
  const { healthMetrics, createHealthMetric } = useHealth(userId);
  const { transactions } = useFinance(userId);
  const { recommendations } = useRecommendations(userId);
  
  // Health chart data
  const { data: weeklyHealthData, isLoading: isLoadingHealthData } = useHealth(userId).getWeeklyHealth();
  
  // Finance chart data
  const { data: weeklyFinanceData, isLoading: isLoadingFinanceData } = useFinance(userId).getWeeklyTransactions();

  // Filter recommendations
  const filteredRecommendations = recommendationFilter === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.type === recommendationFilter);

  // Handle health log submission
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

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hello, Alex!</h1>
        <p className="text-gray-600">Here's your daily summary - {format(new Date(), "EEEE, MMMM d")}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          // Loading skeletons
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))
        ) : (
          // Stats cards
          <>
            <StatCard
              title="Today's Events"
              value={`${dashboardStats?.todayEventsCount || 0} events`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              iconBg="bg-indigo-100"
              trend={
                dashboardStats?.nextEvent
                  ? {
                      direction: "up",
                      label: `Next: ${format(
                        new Date(dashboardStats.nextEvent.startTime),
                        "h:mm a"
                      )} ${dashboardStats.nextEvent.title}`,
                    }
                  : undefined
              }
            />

            <StatCard
              title="Steps Today"
              value={dashboardStats?.stepsToday.toLocaleString() || "0"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
              iconBg="bg-green-100"
              trend={{
                direction: "neutral",
                label: `${Math.round((dashboardStats?.stepsToday || 0) / (dashboardStats?.stepsGoal || 1) * 100)}% of daily goal`,
              }}
            />

            <StatCard
              title="July Expenses"
              value={`$${dashboardStats?.expenseThisMonth.toFixed(2) || "0.00"}`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              iconBg="bg-amber-100"
              trend={{
                direction: "up",
                label: `${Math.round(100 - ((dashboardStats?.expenseThisMonth || 0) / (dashboardStats?.budgetThisMonth || 1) * 100))}% under budget`,
              }}
            />

            <StatCard
              title="New Recommendations"
              value={`${dashboardStats?.recommendationsCount || 0} items`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              iconBg="bg-blue-100"
              trend={{
                direction: "up",
                label: "Based on recent activity",
              }}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Health Trends Chart */}
        {isLoadingHealthData ? (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
            <Skeleton className="h-[220px] w-full" />
          </div>
        ) : (
          <HealthChart
            data={weeklyHealthData || []}
            timeframe={healthTimeframe}
            onTimeframeChange={setHealthTimeframe}
          />
        )}

        {/* Finance Chart */}
        {isLoadingFinanceData ? (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
            <Skeleton className="h-[220px] w-full" />
          </div>
        ) : (
          <FinanceChart
            data={weeklyFinanceData || []}
            timeframe={financeTimeframe}
            onTimeframeChange={setFinanceTimeframe}
          />
        )}
      </div>

      {/* Upcoming Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Schedule Section */}
        <ScheduleList events={todayEvents} />

        {/* Health Section */}
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

        {/* Finance Section */}
        <TransactionsList transactions={transactions.slice(0, 3)} />
      </div>

      {/* Recommendations Section */}
      <Recommendations
        recommendations={filteredRecommendations}
        onFilterChange={setRecommendationFilter}
        activeFilter={recommendationFilter}
      />

      {/* Health Log Dialog */}
      <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Health Activity</DialogTitle>
            <DialogDescription>
              Update your health metrics for today
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Steps
              </label>
              <input
                type="number"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue={dashboardStats?.stepsToday || 0}
                id="steps"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Water (glasses)
              </label>
              <input
                type="number"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue={dashboardStats?.waterIntake || 0}
                id="water"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Sleep (hours)
              </label>
              <input
                type="number"
                step="0.1"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue={dashboardStats?.sleepHours || 0}
                id="sleep"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setHealthDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-green-600 transition-colors duration-200"
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
