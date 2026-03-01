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
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface FinanceProps {
  userId: number;
}

export default function Finance({ userId }: FinanceProps) {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [financeTimeframe, setFinanceTimeframe] = useState<"week" | "month" | "year">("week");
  const [tabView, setTabView] = useState("overview");

  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction } = useFinance(userId);
  const { data: weeklyTransactionsData, isLoading: isLoadingWeekly } = useFinance(userId).getWeeklyTransactions();
  const { data: monthlyTransactionsData, isLoading: isLoadingMonthly } = useFinance(userId).getMonthlyTransactions();

  const currentTimeframeData = financeTimeframe === "week" ? weeklyTransactionsData : monthlyTransactionsData;

  const handleAddTransaction = () => { setSelectedTransaction(null); setIsAddTransactionOpen(true); };
  const handleTransactionClick = (transaction: Transaction) => { setSelectedTransaction(transaction); setIsEditTransactionOpen(true); };
  const handleDeleteTransaction = (id: number) => { deleteTransaction(id); setIsEditTransactionOpen(false); };

  const calculateSummary = () => {
    if (!transactions || transactions.length === 0) return { income: 0, expenses: 0, balance: 0 };
    const income = transactions.filter(t => t.isIncome).reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => !t.isIncome).reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const summary = calculateSummary();

  const getExpensesByCategory = () => {
    if (!transactions) return {};
    const categories: Record<string, number> = {};
    transactions.filter(t => !t.isIncome).forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });
    return categories;
  };

  const expensesByCategory = getExpensesByCategory();

  const summaryCards = [
    { title: "Income", value: summary.income, icon: TrendingUp, color: '#5a7a50' },
    { title: "Expenses", value: summary.expenses, icon: TrendingDown, color: '#c47a5a' },
    { title: "Balance", value: summary.balance, icon: Wallet, color: summary.balance >= 0 ? '#5a7a50' : '#c47a5a' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>Finance</h1>
          <p style={{ color: '#8a8a72' }}>Monitor your income and expenses</p>
        </div>
        <Button onClick={handleAddTransaction} className="rounded-xl text-white border-0 hover:opacity-90" style={{ backgroundColor: '#c4a882' }}>
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <card.icon className="h-6 w-6 mb-2" style={{ color: card.color }} />
                <div className="text-3xl font-bold" style={{ color: card.color }}>
                  {isLoading ? <Skeleton className="h-10 w-24" style={{ backgroundColor: '#d8d5c8' }} /> : `$${card.value.toFixed(2)}`}
                </div>
                <div className="text-sm mt-1" style={{ color: '#8a8a72' }}>{card.title.toLowerCase()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" onValueChange={setTabView}>
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: '#f0ede4' }}>
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg">Transactions</TabsTrigger>
          <TabsTrigger value="budget" className="rounded-lg">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ color: '#3d3d2e' }}>Overview</CardTitle>
                  <div className="flex space-x-2">
                    {(["week", "month"] as const).map((tf) => (
                      <Button key={tf} variant={financeTimeframe === tf ? "default" : "outline"} size="sm" className="rounded-lg" onClick={() => setFinanceTimeframe(tf)}>
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly || isLoadingMonthly ? (
                  <Skeleton className="h-[300px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
                ) : (
                  <FinanceChart data={currentTimeframeData || []} timeframe={financeTimeframe} onTimeframeChange={setFinanceTimeframe} />
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#3d3d2e' }}>Recent</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array(5).fill(0).map((_, i) => (<Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />))}
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      <TransactionsList transactions={transactions.slice(0, 5)} showViewAll={false} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#3d3d2e' }}>By Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" style={{ backgroundColor: '#d8d5c8' }} />
                  ) : Object.keys(expensesByCategory).length === 0 ? (
                    <div className="text-center py-12" style={{ color: '#8a8a72' }}>No expense data</div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(expensesByCategory).map(([category, amount]) => (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            <span className="text-sm font-medium" style={{ color: '#5a5a48' }}>${amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#d8d5c8' }}>
                            <div className="h-2 rounded-full" style={{ width: `${Math.min((amount / summary.expenses) * 100, 100)}%`, backgroundColor: '#c4a882' }}></div>
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
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: '#3d3d2e' }}>All Transactions</CardTitle>
                <Button onClick={handleAddTransaction} size="sm" className="rounded-lg text-white" style={{ backgroundColor: '#c4a882' }}>Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">{Array(10).fill(0).map((_, i) => (<Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: '#d8d5c8' }} />))}</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#8a8a72' }}>
                  <p>No transactions</p>
                  <Button variant="outline" className="mt-2 rounded-xl" onClick={handleAddTransaction}>Add First Transaction</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center p-3 rounded-xl cursor-pointer transition-colors" style={{ backgroundColor: 'rgba(125, 155, 111, 0.06)' }} onClick={() => handleTransactionClick(transaction)}>
                      <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: transaction.isIncome ? 'rgba(125, 155, 111, 0.15)' : 'rgba(196, 122, 90, 0.12)' }}>
                        {transaction.isIncome ? <ArrowUpRight className="h-4 w-4" style={{ color: '#5a7a50' }} /> : <ArrowDownLeft className="h-4 w-4" style={{ color: '#c47a5a' }} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium" style={{ color: '#3d3d2e' }}>{transaction.description}</h4>
                        <div className="flex justify-between">
                          <p className="text-xs" style={{ color: '#8a8a72' }}>{format(new Date(transaction.date), "PPp")}</p>
                          <p className="text-xs" style={{ color: '#8a8a72' }}>{transaction.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: transaction.isIncome ? '#5a7a50' : '#c47a5a' }}>
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
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#3d3d2e' }}>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (<Skeleton className="h-[400px] w-full" style={{ backgroundColor: '#d8d5c8' }} />) : (
                <BudgetSummary income={summary.income} expenses={summary.expenses} expensesByCategory={expensesByCategory} budget={1500} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader><DialogTitle style={{ color: '#3d3d2e' }}>Add Transaction</DialogTitle></DialogHeader>
          <TransactionForm userId={userId} onSubmit={(data) => { createTransaction({ ...data, userId, date: new Date(data.date) }); setIsAddTransactionOpen(false); }} onCancel={() => setIsAddTransactionOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-0" style={{ backgroundColor: '#f0ede4' }}>
          <DialogHeader><DialogTitle style={{ color: '#3d3d2e' }}>Edit Transaction</DialogTitle></DialogHeader>
          {selectedTransaction && (
            <TransactionForm userId={userId} transaction={selectedTransaction}
              onSubmit={(data) => { if (selectedTransaction) { updateTransaction({ id: selectedTransaction.id, transaction: { ...data, date: new Date(data.date) } }); } setIsEditTransactionOpen(false); }}
              onCancel={() => setIsEditTransactionOpen(false)}
              onDelete={() => { if (selectedTransaction) handleDeleteTransaction(selectedTransaction.id); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
