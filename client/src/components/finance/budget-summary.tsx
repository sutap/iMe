import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip
} from "recharts";

interface BudgetSummaryProps {
  income: number;
  expenses: number;
  expensesByCategory: Record<string, number>;
  budget: number;
}

export default function BudgetSummary({ income, expenses, expensesByCategory, budget }: BudgetSummaryProps) {
  // Calculate budget progress
  const budgetUsedPercentage = Math.min((expenses / budget) * 100, 100);
  const budgetRemaining = budget - expenses;
  const isBudgetExceeded = budgetRemaining < 0;

  // Prepare data for pie chart
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Colors for pie chart
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#6B7280'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Budget Used</span>
                  <span className="text-sm font-medium text-gray-700">
                    ${expenses.toFixed(2)} / ${budget.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={budgetUsedPercentage} 
                  className="h-2" 
                  indicatorClassName={isBudgetExceeded ? "bg-red-500" : undefined}
                />
                <div className="flex justify-between text-xs">
                  <span className={isBudgetExceeded ? "text-red-500 font-medium" : "text-gray-500"}>
                    {isBudgetExceeded 
                      ? `Exceeded by $${Math.abs(budgetRemaining).toFixed(2)}` 
                      : `$${budgetRemaining.toFixed(2)} remaining`}
                  </span>
                  <span className="text-gray-500">
                    {Math.round(budgetUsedPercentage)}% used
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-sm font-medium mb-2">Summary</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Income</span>
                    <span className="text-green-500">${income.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expenses</span>
                    <span className="text-red-500">${expenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-100">
                    <span>Net Savings</span>
                    <span className={income - expenses >= 0 ? "text-green-500" : "text-red-500"}>
                      ${(income - expenses).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-60 text-gray-500">
                No expense data available
              </div>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Budget Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Savings Goal</h4>
              <p className="text-sm text-gray-600 mb-3">
                Based on your income and spending patterns, you could aim to save 
                ${Math.max(Math.round(income * 0.2), 0)} per month (20% of income).
              </p>
              <div className="text-xs text-gray-500">
                Current savings rate: {income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}% of income
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Budget Adjustment</h4>
              {expensesByCategory.dining && expensesByCategory.dining > (budget * 0.2) ? (
                <p className="text-sm text-gray-600 mb-3">
                  Your dining expenses (${expensesByCategory.dining.toFixed(2)}) make up 
                  {Math.round((expensesByCategory.dining / expenses) * 100)}% of your total spending.
                  Consider reducing this category.
                </p>
              ) : (
                <p className="text-sm text-gray-600 mb-3">
                  Your budget allocation looks balanced. Continue monitoring your expenses
                  to maintain financial health.
                </p>
              )}
              <div className="text-xs text-gray-500">
                Recommended budget: ${Math.round(income * 0.8).toFixed(2)} (80% of income)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
