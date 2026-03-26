import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Goal, InsertGoal } from "@shared/schema";

export function useGoals(userId: number) {
  const goalsQuery = useQuery<Goal>({
    queryKey: [`/api/goals/${userId}`],
    enabled: !!userId,
    retry: false,
  });

  const createGoalsMutation = useMutation({
    mutationFn: (newGoal: InsertGoal) => apiRequest("POST", "/api/goals", newGoal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/goals/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const updateGoalsMutation = useMutation({
    mutationFn: (goalData: Partial<Goal>) => apiRequest("PUT", `/api/goals/${userId}`, goalData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/goals/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  return {
    goals: goalsQuery.data,
    isLoading: goalsQuery.isLoading,
    createGoals: createGoalsMutation.mutate,
    updateGoals: updateGoalsMutation.mutate,
    isSaving: createGoalsMutation.isPending || updateGoalsMutation.isPending,
  };
}
