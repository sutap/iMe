import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { HealthMetric, InsertHealthMetric } from "@shared/schema";
import { format, subDays } from "date-fns";

export function useHealth(userId: number) {
  const healthMetricsQuery = useQuery<HealthMetric[]>({
    queryKey: [`/api/health/${userId}`],
    enabled: !!userId,
  });

  const todayMetricQuery = useQuery<HealthMetric>({
    queryKey: [`/api/health/${userId}/today`],
    enabled: !!userId,
  });

  const getHealthByDateRange = (startDate: Date, endDate: Date) => {
    return useQuery<HealthMetric[]>({
      queryKey: [`/api/health/${userId}/range`, { start: format(startDate, 'yyyy-MM-dd'), end: format(endDate, 'yyyy-MM-dd') }],
      enabled: !!userId,
    });
  };

  const getWeeklyHealth = () => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    return getHealthByDateRange(sevenDaysAgo, today);
  };

  const createHealthMetricMutation = useMutation({
    mutationFn: (newMetric: InsertHealthMetric) => 
      apiRequest("POST", "/api/health", newMetric),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/health/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/health/${userId}/today`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const updateHealthMetricMutation = useMutation({
    mutationFn: ({ id, metric }: { id: number; metric: Partial<HealthMetric> }) =>
      apiRequest("PUT", `/api/health/${id}`, metric),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/health/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/health/${userId}/today`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  return {
    healthMetrics: healthMetricsQuery.data || [],
    todayMetric: todayMetricQuery.data,
    isLoading: healthMetricsQuery.isLoading || todayMetricQuery.isLoading,
    isError: healthMetricsQuery.isError || todayMetricQuery.isError,
    createHealthMetric: createHealthMetricMutation.mutate,
    updateHealthMetric: updateHealthMetricMutation.mutate,
    isCreating: createHealthMetricMutation.isPending,
    isUpdating: updateHealthMetricMutation.isPending,
    getWeeklyHealth,
    getHealthByDateRange,
  };
}
