import { Link } from "wouter";
import { Recommendation } from "@shared/schema";

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
  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Personalized Recommendations</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onFilterChange && onFilterChange("all")}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              activeFilter === "all"
                ? "bg-indigo-50 text-primary"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange && onFilterChange("health")}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              activeFilter === "health"
                ? "bg-indigo-50 text-primary"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Health
          </button>
          <button
            onClick={() => onFilterChange && onFilterChange("finance")}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              activeFilter === "finance"
                ? "bg-indigo-50 text-primary"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Finance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <div
                  className="w-full h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${rec.imageUrl})`,
                  }}
                ></div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div
                    className={`rounded-full p-1 ${
                      rec.type === "health"
                        ? "bg-indigo-100"
                        : rec.type === "finance"
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        rec.type === "health"
                          ? "text-primary"
                          : rec.type === "finance"
                          ? "text-accent"
                          : "text-blue-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {rec.type === "health" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      ) : rec.type === "finance" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      )}
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-medium ml-1 ${
                      rec.type === "health"
                        ? "text-primary"
                        : rec.type === "finance"
                        ? "text-accent"
                        : "text-blue-500"
                    }`}
                  >
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1">{rec.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{rec.description}</p>
                <Link href={rec.actionUrl || "#"}>
                  <a className="text-xs font-medium text-primary hover:text-indigo-700">
                    {rec.actionLabel || "View Details"} →
                  </a>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-6 text-center text-gray-500">
            No recommendations found
          </div>
        )}
      </div>
    </div>
  );
}
