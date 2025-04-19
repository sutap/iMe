import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthMetric } from "@shared/schema";
import { format } from "date-fns";

interface HealthChartProps {
  data: HealthMetric[];
  timeframe: "week" | "month" | "year";
  onTimeframeChange: (timeframe: "week" | "month" | "year") => void;
}

export default function HealthChart({ data, timeframe, onTimeframeChange }: HealthChartProps) {
  // Transform data for chart
  const chartData = data.map((metric) => ({
    date: format(new Date(metric.date), "EEE"),
    steps: metric.steps,
    sleep: metric.sleepHours,
    water: metric.waterIntake,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Health Trends</CardTitle>
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
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 12]}
                label={{ value: "Hours", angle: 90, position: "insideRight" }}
              />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #e2e8f0" }}
              />
              <Legend iconType="circle" iconSize={8} />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="#4F46E5"
                activeDot={{ r: 6 }}
                strokeWidth={2}
                yAxisId="left"
                name="Steps"
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#10B981"
                yAxisId="right"
                name="Sleep (hrs)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
