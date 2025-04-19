import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Transaction, InsertTransaction } from "@shared/schema";
import { format, subDays, subMonths } from "date-fns";

export function useFinance(userId: number) {
  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: [`/api/transactions/${userId}`],
    enabled: !!userId,
  });

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return useQuery<Transaction[]>({
      queryKey: [`/api/transactions/${userId}/range`, { start: format(startDate, 'yyyy-MM-dd'), end: format(endDate, 'yyyy-MM-dd') }],
      enabled: !!userId,
    });
  };

  const getWeeklyTransactions = () => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    return getTransactionsByDateRange(sevenDaysAgo, today);
  };

  const getMonthlyTransactions = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    return getTransactionsByDateRange(thirtyDaysAgo, today);
  };

  const createTransactionMutation = useMutation({
    mutationFn: (newTransaction: InsertTransaction) => 
      apiRequest("POST", "/api/transactions", newTransaction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, transaction }: { id: number; transaction: Partial<Transaction> }) =>
      apiRequest("PUT", `/api/transactions/${id}`, transaction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/transactions/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${userId}`] });
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
    getWeeklyTransactions,
    getMonthlyTransactions,
    getTransactionsByDateRange,
  };
}
