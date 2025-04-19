import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";

interface FinanceChartProps {
  data: Transaction[];
  timeframe: "week" | "month" | "year";
  onTimeframeChange: (timeframe: "week" | "month" | "year") => void;
}

export default function FinanceChart({ data, timeframe, onTimeframeChange }: FinanceChartProps) {
  // Process data to group by day and separate income/expenses
  const chartData = processTransactions(data);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Financial Overview</CardTitle>
          <div className="flex space-x-2">
            <button
              onClick={() => onTimeframeChange("week")}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                timeframe === "week"
                  ? "bg-indigo-50 text-primary"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onTimeframeChange("month")}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                timeframe === "month"
                  ? "bg-indigo-50 text-primary"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onTimeframeChange("year")}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                timeframe === "year"
                  ? "bg-indigo-50 text-primary"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #e2e8f0" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to process transactions data for the chart
function processTransactions(transactions: Transaction[]) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by day
  const groupedByDay: Record<string, { income: number; expenses: number }> = {};

  sortedTransactions.forEach((transaction) => {
    const dateString = format(new Date(transaction.date), "EEE");

    if (!groupedByDay[dateString]) {
      groupedByDay[dateString] = { income: 0, expenses: 0 };
    }

    if (transaction.isIncome) {
      groupedByDay[dateString].income += transaction.amount;
    } else {
      groupedByDay[dateString].expenses += transaction.amount;
    }
  });

  // Convert to array format needed for chart
  return Object.keys(groupedByDay).map((date) => ({
    date,
    income: groupedByDay[date].income,
    expenses: groupedByDay[date].expenses,
  }));
}
