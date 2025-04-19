import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Recommendation } from "@shared/schema";

export function useRecommendations(userId: number) {
  const recommendationsQuery = useQuery<Recommendation[]>({
    queryKey: [`/api/recommendations/${userId}`],
    enabled: !!userId,
  });

  const getRecommendationsByType = (type: string) => {
    return useQuery<Recommendation[]>({
      queryKey: [`/api/recommendations/${userId}/type/${type}`],
      enabled: !!userId && !!type,
    });
  };

  const newRecommendationsQuery = useQuery<Recommendation[]>({
    queryKey: [`/api/recommendations/${userId}/new`],
    enabled: !!userId,
  });

  const markViewedMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest("POST", `/api/recommendations/view/${id}`, {}),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/recommendations/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/recommendations/${userId}/new`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  return {
    recommendations: recommendationsQuery.data || [],
    newRecommendations: newRecommendationsQuery.data || [],
    isLoading: recommendationsQuery.isLoading || newRecommendationsQuery.isLoading,
    isError: recommendationsQuery.isError || newRecommendationsQuery.isError,
    markViewed: markViewedMutation.mutate,
    isMarkingViewed: markViewedMutation.isPending,
    getRecommendationsByType,
  };
}
