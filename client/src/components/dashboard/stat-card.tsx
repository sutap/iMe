import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    label: string;
  };
}

export default function StatCard({ title, value, icon, iconBg, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#8a8a72' }}>{title}</p>
          <p className="text-xl font-bold mt-1" style={{ color: '#3d3d2e' }}>{value}</p>
        </div>
        <div className={cn("rounded-xl p-3", iconBg)}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3">
          <span className={cn(
            "inline-flex items-center text-xs font-medium",
            trend.direction === "up" ? "text-green-600" : 
            trend.direction === "down" ? "text-red-500" : 
            "text-amber-600"
          )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {trend.direction === "up" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : trend.direction === "down" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              )}
            </svg>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
