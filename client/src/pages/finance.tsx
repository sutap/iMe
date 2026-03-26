import { useState } from "react";
import { useFinance } from "@/hooks/use-finance";
import { useGoals } from "@/hooks/use-goals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FinanceChart from "@/components/charts/finance-chart";
import TransactionForm from "@/components/finance/transaction-form";
import TransactionsList from "@/components/dashboard/transactions-list";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Transaction } from "@shared/schema";
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, PiggyBank, Target } from "lucide-react";
import { Link } from "wouter";

interface FinanceProps {
  userId: number;
}

const C = { bg: '#e6e8d4', card: '#f0ede4', primary: '#7d9b6f', clay: '#c4a882', text: '#3d3d2e', muted: '#8a8a72', border: '#d8d5c8', income: '#5a7a50', expense: '#c47a5a' };

export default function Finance({ userId }: FinanceProps) {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [financeTimeframe, setFinanceTimeframe] = useState<"week" | "month">("week");
  const [tabView, setTabView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const { transactions, budgetCategories, isLoading, createTransaction, updateTransaction, deleteTransaction } = useFinance(userId);
  const { goals } = useGoals(userId);
  const { data: weeklyTransactionsData, isLoading: isLoadingWeekly } = useFinance(userId).getWeeklyTransactions();
  const { data: monthlyTransactionsData, isLoading: isLoadingMonthly } = useFinance(userId).getMonthlyTransactions();

  const currentTimeframeData = financeTimeframe === "week" ? weeklyTransactionsData : monthlyTransactionsData;

  const handleTransactionClick = (transaction: Transaction) => { setSelectedTransaction(transaction); setIsEditTransactionOpen(true); };
  const handleDeleteTransaction = (id: number) => { deleteTransaction(id); setIsEditTransactionOpen(false); };

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= monthStart && d <= monthEnd;
  });

  const summary = {
    income: monthTransactions.filter(t => t.isIncome).reduce((s, t) => s + t.amount, 0),
    expenses: monthTransactions.filter(t => !t.isIncome).reduce((s, t) => s + t.amount, 0),
  };
  const balance = summary.income - summary.expenses;
  const monthlyBudget = goals?.monthlyBudget || 1500;
  const savingsGoal = goals?.savingsGoal || 500;
  const budgetUsedPct = Math.min((summary.expenses / monthlyBudget) * 100, 100);

  const getExpensesByCategory = () => {
    const categories: Record<string, number> = {};
    monthTransactions.filter(t => !t.isIncome).forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });
    return categories;
  };
  const expensesByCategory = getExpensesByCategory();

  const filteredTransactions = searchQuery
    ? transactions.filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : transactions;

  const summaryCards = [
    { title: "Income", value: summary.income, icon: TrendingUp, color: C.income, sub: "this month" },
    { title: "Expenses", value: summary.expenses, icon: TrendingDown, color: C.expense, sub: `of $${monthlyBudget} budget` },
    { title: "Balance", value: balance, icon: Wallet, color: balance >= 0 ? C.income : C.expense, sub: balance >= 0 ? 'surplus' : 'deficit' },
    { title: "Savings", value: Math.max(balance, 0), icon: PiggyBank, color: '#c4a882', sub: `goal: $${savingsGoal}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.text }}>Finance</h1>
          <p className="text-sm" style={{ color: C.muted }}>Track income, expenses & budgets</p>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="sm" className="rounded-xl border-0" style={{ backgroundColor: C.card, color: C.muted }}>
              <Target className="h-4 w-4 mr-1" /> Budget
            </Button>
          </Link>
          <Button onClick={() => { setSelectedTransaction(null); setIsAddTransactionOpen(true); }} className="rounded-xl text-white border-0" style={{ backgroundColor: C.clay }}>
            <Plus className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(card => (
          <Card key={card.title} className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
            <CardContent className="p-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mb-1" style={{ backgroundColor: C.border }} />
              ) : (
                <div className="text-xl font-bold" style={{ color: card.color }}>${Math.abs(card.value).toFixed(0)}</div>
              )}
              <div className="text-xs" style={{ color: C.muted }}>{card.title} · {card.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Budget Bar */}
      <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: C.text }}>Monthly Budget</span>
            <span className="text-sm font-semibold" style={{ color: budgetUsedPct > 90 ? C.expense : C.text }}>
              ${summary.expenses.toFixed(0)} / ${monthlyBudget}
            </span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: C.border }}>
            <div className="h-3 rounded-full transition-all duration-500" style={{ 
              width: `${budgetUsedPct}%`, 
              backgroundColor: budgetUsedPct > 90 ? C.expense : budgetUsedPct > 75 ? '#c4a882' : C.income 
            }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: C.muted }}>{budgetUsedPct.toFixed(0)}% used</span>
            <span className="text-xs" style={{ color: C.muted }}>${Math.max(monthlyBudget - summary.expenses, 0).toFixed(0)} remaining</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tabView} onValueChange={setTabView}>
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: C.card }}>
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg">Transactions</TabsTrigger>
          <TabsTrigger value="budget" className="rounded-lg">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ color: C.text }}>Spending Trends</CardTitle>
                  <div className="flex gap-2">
                    {(["week", "month"] as const).map(tf => (
                      <button key={tf} onClick={() => setFinanceTimeframe(tf)}
                        className="px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: financeTimeframe === tf ? C.clay : C.bg, color: financeTimeframe === tf ? 'white' : C.muted }}>
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeekly || isLoadingMonthly ? (
                  <Skeleton className="h-[250px] w-full" style={{ backgroundColor: C.border }} />
                ) : (
                  <FinanceChart data={currentTimeframeData || []} timeframe={financeTimeframe} onTimeframeChange={setFinanceTimeframe} />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader><CardTitle style={{ color: C.text }}>Recent Transactions</CardTitle></CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <TransactionsList transactions={transactions.slice(0, 5)} showViewAll={false} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
            <CardHeader>
              <div className="flex justify-between items-center gap-3">
                <CardTitle style={{ color: C.text }}>All Transactions</CardTitle>
                <Button onClick={() => { setSelectedTransaction(null); setIsAddTransactionOpen(true); }} size="sm" className="rounded-lg text-white border-0" style={{ backgroundColor: C.clay }}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-xl text-sm border-0 outline-none"
                style={{ backgroundColor: C.bg, color: C.text }}
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" style={{ backgroundColor: C.border }} />)}</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12" style={{ color: C.muted }}>
                  <p>{searchQuery ? `No results for "${searchQuery}"` : 'No transactions'}</p>
                  {!searchQuery && <Button variant="outline" className="mt-2 rounded-xl" onClick={() => { setSelectedTransaction(null); setIsAddTransactionOpen(true); }}>Add First Transaction</Button>}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map(t => (
                    <div key={t.id} className="flex items-center p-3 rounded-xl cursor-pointer transition-opacity hover:opacity-80"
                      style={{ backgroundColor: `${C.primary}08` }} onClick={() => handleTransactionClick(t)}>
                      <div className="p-2 rounded-lg mr-3 flex-shrink-0" style={{ backgroundColor: t.isIncome ? `${C.income}20` : `${C.expense}15` }}>
                        {t.isIncome ? <ArrowUpRight className="h-4 w-4" style={{ color: C.income }} /> : <ArrowDownLeft className="h-4 w-4" style={{ color: C.expense }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate" style={{ color: C.text }}>{t.description}</h4>
                        <div className="flex justify-between">
                          <p className="text-xs" style={{ color: C.muted }}>{format(new Date(t.date), "MMM d, yyyy")}</p>
                          <p className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${C.primary}15`, color: C.muted }}>{t.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold ml-2 flex-shrink-0" style={{ color: t.isIncome ? C.income : C.expense }}>
                        {t.isIncome ? "+" : "-"}${t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <div className="space-y-4">
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ color: C.text }}>Budget by Category</CardTitle>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="rounded-lg border-0 text-xs" style={{ backgroundColor: C.bg, color: C.muted }}>Edit Limits</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetCategories.length === 0 ? (
                    <div className="text-center py-8" style={{ color: C.muted }}>
                      <p>No budget categories set</p>
                      <Link href="/settings"><Button variant="outline" className="mt-2 rounded-xl text-sm" style={{ color: C.primary }}>Set Up Budget Categories</Button></Link>
                    </div>
                  ) : budgetCategories.map(cat => {
                    const spent = expensesByCategory[cat.name] || 0;
                    const pct = Math.min((spent / cat.limit) * 100, 100);
                    const isOver = spent > cat.limit;
                    return (
                      <div key={cat.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium" style={{ color: C.text }}>{cat.name}</span>
                          <span className="text-sm" style={{ color: isOver ? C.expense : C.muted }}>
                            ${spent.toFixed(0)} / ${cat.limit}
                            {isOver && <span className="ml-1 text-xs">⚠️ over</span>}
                          </span>
                        </div>
                        <div className="w-full rounded-full h-2.5" style={{ backgroundColor: C.border }}>
                          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: isOver ? C.expense : cat.color || C.primary }} />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-xs" style={{ color: C.muted }}>{pct.toFixed(0)}% used</span>
                          <span className="text-xs" style={{ color: isOver ? C.expense : C.muted }}>
                            {isOver ? `$${(spent - cat.limit).toFixed(0)} over budget` : `$${(cat.limit - spent).toFixed(0)} left`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Spending by category (all) */}
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: C.card }}>
              <CardHeader><CardTitle style={{ color: C.text }}>All Spending This Month</CardTitle></CardHeader>
              <CardContent>
                {Object.keys(expensesByCategory).length === 0 ? (
                  <div className="text-center py-8" style={{ color: C.muted }}>No expense data this month</div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm" style={{ color: C.text }}>{category}</span>
                          <span className="text-sm font-medium" style={{ color: C.text }}>${amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ backgroundColor: C.border }}>
                          <div className="h-2 rounded-full" style={{ width: `${Math.min((amount / summary.expenses) * 100, 100)}%`, backgroundColor: C.clay }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-0" style={{ backgroundColor: C.card }}>
          <DialogHeader><DialogTitle style={{ color: C.text }}>Add Transaction</DialogTitle></DialogHeader>
          <TransactionForm userId={userId}
            onSubmit={(data) => { createTransaction({ ...data, userId, date: new Date(data.date) }); setIsAddTransactionOpen(false); }}
            onCancel={() => setIsAddTransactionOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-0" style={{ backgroundColor: C.card }}>
          <DialogHeader><DialogTitle style={{ color: C.text }}>Edit Transaction</DialogTitle></DialogHeader>
          {selectedTransaction && (
            <TransactionForm userId={userId} transaction={selectedTransaction}
              onSubmit={(data) => { updateTransaction({ id: selectedTransaction.id, transaction: { ...data, date: new Date(data.date) } }); setIsEditTransactionOpen(false); }}
              onCancel={() => setIsEditTransactionOpen(false)}
              onDelete={() => handleDeleteTransaction(selectedTransaction.id)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
