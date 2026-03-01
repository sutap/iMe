import { Link } from "wouter";
import { Recommendation } from "@shared/schema";
import { Heart, DollarSign, Search } from "lucide-react";

interface RecommendationsProps {
  recommendations: Recommendation[];
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

export default function Recommendations({
  recommendations,
  onFilterChange,
  activeFilter = "all",
}: RecommendationsProps) {
  const filters = [
    { key: "all", label: "All" },
    { key: "health", label: "Health" },
    { key: "finance", label: "Finance" },
  ];

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold" style={{ color: '#3d3d2e' }}>Recommendations</h3>
        <div className="flex space-x-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange && onFilterChange(filter.key)}
              className="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: activeFilter === filter.key ? 'rgba(125, 155, 111, 0.15)' : 'transparent',
                color: activeFilter === filter.key ? '#5a7a50' : '#8a8a72'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
              style={{ backgroundColor: '#e6e8d4' }}
            >
              <div className="aspect-w-16 aspect-h-9">
                <div
                  className="w-full h-32 bg-cover bg-center rounded-t-xl"
                  style={{ backgroundImage: `url(${rec.imageUrl})` }}
                ></div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div
                    className="rounded-lg p-1"
                    style={{
                      backgroundColor: rec.type === "health" ? 'rgba(125, 155, 111, 0.15)' : rec.type === "finance" ? 'rgba(196, 168, 130, 0.2)' : 'rgba(138, 138, 114, 0.15)'
                    }}
                  >
                    {rec.type === "health" ? (
                      <Heart className="h-3.5 w-3.5" style={{ color: '#5a7a50' }} />
                    ) : rec.type === "finance" ? (
                      <DollarSign className="h-3.5 w-3.5" style={{ color: '#c4a882' }} />
                    ) : (
                      <Search className="h-3.5 w-3.5" style={{ color: '#8a8a72' }} />
                    )}
                  </div>
                  <span className="text-xs font-medium ml-1.5"
                    style={{
                      color: rec.type === "health" ? '#5a7a50' : rec.type === "finance" ? '#c4a882' : '#8a8a72'
                    }}
                  >
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: '#3d3d2e' }}>{rec.title}</h4>
                <p className="text-xs mb-3" style={{ color: '#8a8a72' }}>{rec.description}</p>
                <Link href={rec.actionUrl || "#"}>
                  <a className="text-xs font-medium" style={{ color: '#7d9b6f' }}>
                    {rec.actionLabel || "View Details"} →
                  </a>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-6 text-center" style={{ color: '#8a8a72' }}>
            No recommendations found
          </div>
        )}
      </div>
    </div>
  );
}
