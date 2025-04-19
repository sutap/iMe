import { useState } from "react";
import { useFinance } from "@/hooks/use-finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FinanceChart from "@/components/charts/finance-chart";
import TransactionForm from "@/components/finance/transaction-form";
import BudgetSummary from "@/components/finance/budget-summary";
import TransactionsList from "@/components/dashboard/transactions-list";
import { format } from "date-fns";
import { Transaction } from "@shared/schema";

interface FinanceProps {
  userId: number;
}

export default function Finance({ userId }: FinanceProps) {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [financeTimeframe, setFinanceTimeframe] = useState<"week" | "month" | "year">("week");
  const [tabView, setTabView] = useState("overview");

  const { 
    transactions, 
    isLoading, 
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useFinance(userId);

  const { data: weeklyTransactionsData, isLoading: isLoadingWeekly } = useFinance(userId).getWeeklyTransactions();
  const { data: monthlyTransactionsData, isLoading: isLoadingMonthly } = useFinance(userId).getMonthlyTransactions();

  // Selected timeframe data based on current timeframe selection
  const currentTimeframeData = financeTimeframe === "week" ? weeklyTransactionsData : monthlyTransactionsData;

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsAddTransactionOpen(true);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    deleteTransaction(id);
    setIsEditTransactionOpen(false);
  };

  // Calculate summary stats
  const calculateSummary = () => {
    if (!transactions || transactions.length === 0) {
      return { income: 0, expenses: 0, balance: 0 };
    }

    const income = transactions
      .filter(t => t.isIncome)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const expenses = transactions
      .filter(t => !t.isIncome)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const summary = calculateSummary();

  // Get transactions by category
  const getExpensesByCategory = () => {
    if (!transactions) return {};

    const categories: Record<string, number> = {};
    
    transactions
      .filter(t => !t.isIncome)
      .forEach(transaction => {
        const category = transaction.category;
        categories[category] = (categories[category] || 0) + transaction.amount;
      });

    return categories;
  };

  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Tracking</h1>
          <p className="text-gray-600">Monitor your income and expenses</p>
        </div>
        <Button onClick={handleAddTransaction} className="bg-accent hover:bg-accent/90">
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
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-500">
                {isLoading ? <Skeleton className="h-10 w-24" /> : `$${summary.income.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-500 mt-1">total income</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-red-500">
                {isLoading ? <Skeleton className="h-10 w-24" /> : `$${summary.expenses.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-500 mt-1">total expenses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {isLoading ? <Skeleton className="h-10 w-24" /> : `$${summary.balance.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-500 mt-1">current balance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={setTabView}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Financial Overview</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant={financeTimeframe === "week" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFinanceTimeframe("week")}
                    >
                      Week
                    </Button>
                    <Button 
                      variant={financeTimeframe === "month" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFinanceTimeframe("month")}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly || isLoadingMonthly ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <FinanceChart
                    data={currentTimeframeData || []}
                    timeframe={financeTimeframe}
                    onTimeframeChange={setFinanceTimeframe}
                  />
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      <TransactionsList 
                        transactions={transactions.slice(0, 5)} 
                        showViewAll={false} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : Object.keys(expensesByCategory).length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No expense data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(expensesByCategory).map(([category, amount]) => (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              ${amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${Math.min((amount / summary.expenses) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((amount / summary.expenses) * 100)}% of total expenses
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Transactions</CardTitle>
                <Button onClick={handleAddTransaction} size="sm">
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(10).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No transactions recorded</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleAddTransaction}
                  >
                    Add First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div
                        className={`${
                          transaction.isIncome ? "bg-green-100" : "bg-red-100"
                        } p-2 rounded mr-3`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
                            transaction.isIncome ? "text-green-500" : "text-red-500"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                              transaction.isIncome
                                ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                : "M19 14l-7 7m0 0l-7-7m7 7V3"
                            }
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </h4>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">
                            {format(new Date(transaction.date), "PPp")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Category: {transaction.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          transaction.isIncome ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <BudgetSummary
                  income={summary.income}
                  expenses={summary.expenses}
                  expensesByCategory={expensesByCategory}
                  budget={1500} // Fixed budget amount from storage
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            userId={userId}
            onSubmit={(transactionData) => {
              createTransaction({
                ...transactionData,
                userId,
                date: new Date(transactionData.date)
              });
              setIsAddTransactionOpen(false);
            }}
            onCancel={() => setIsAddTransactionOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionForm
              userId={userId}
              transaction={selectedTransaction}
              onSubmit={(transactionData) => {
                if (selectedTransaction) {
                  updateTransaction({
                    id: selectedTransaction.id,
                    transaction: {
                      ...transactionData,
                      date: new Date(transactionData.date)
                    }
                  });
                }
                setIsEditTransactionOpen(false);
              }}
              onCancel={() => setIsEditTransactionOpen(false)}
              onDelete={() => {
                if (selectedTransaction) {
                  handleDeleteTransaction(selectedTransaction.id);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
