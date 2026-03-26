import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Transaction, InsertTransaction, BudgetCategory, InsertBudgetCategory } from "@shared/schema";
import { format, subDays } from "date-fns";

export function useFinance(userId: number) {
  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: [`/api/transactions/${userId}`],
    enabled: !!userId,
  });

  const budgetCategoriesQuery = useQuery<BudgetCategory[]>({
    queryKey: [`/api/budget-categories/${userId}`],
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
    mutationFn: (newTransaction: InsertTransaction) => apiRequest("POST", "/api/transactions", newTransaction),
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

  const createBudgetCategoryMutation = useMutation({
    mutationFn: (category: InsertBudgetCategory) => apiRequest("POST", "/api/budget-categories", category),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/budget-categories/${userId}`] });
    },
  });

  const updateBudgetCategoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: Partial<BudgetCategory> }) =>
      apiRequest("PUT", `/api/budget-categories/${id}`, category),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/budget-categories/${userId}`] });
    },
  });

  const deleteBudgetCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/budget-categories/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/budget-categories/${userId}`] });
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    budgetCategories: budgetCategoriesQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    createBudgetCategory: createBudgetCategoryMutation.mutate,
    updateBudgetCategory: updateBudgetCategoryMutation.mutate,
    deleteBudgetCategory: deleteBudgetCategoryMutation.mutate,
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
    getWeeklyTransactions,
    getMonthlyTransactions,
    getTransactionsByDateRange,
  };
}
