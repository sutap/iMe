import { useState } from "react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Recommendations from "@/components/dashboard/recommendations";

interface DiscoveryProps {
  userId: number;
}

export default function Discovery({ userId }: DiscoveryProps) {
  const [recommendationFilter, setRecommendationFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { 
    recommendations, 
    newRecommendations, 
    isLoading, 
    markViewed 
  } = useRecommendations(userId);
  
  const handleViewRecommendation = (id: number) => {
    markViewed(id);
  };

  // Filter recommendations based on selected category
  const filteredRecommendations = selectedCategory 
    ? recommendations.filter(rec => rec.type === selectedCategory)
    : recommendationFilter === "all" 
      ? recommendations 
      : recommendations.filter(rec => rec.type === recommendationFilter);

  // Get unique recommendation types for filter
  const getUniqueTypes = () => {
    const types = recommendations.map(rec => rec.type);
    return Array.from(new Set(types));
  };

  const uniqueTypes = getUniqueTypes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discovery</h1>
          <p className="text-gray-600">Find personalized recommendations based on your activities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {uniqueTypes.map(type => (
            <Button
              key={type}
              variant={selectedCategory === type ? "default" : "outline"}
              onClick={() => setSelectedCategory(type)}
              className={
                type === "health" ? "bg-primary/10 text-primary border-primary/20" :
                type === "finance" ? "bg-amber-100 text-amber-700 border-amber-200" :
                "bg-blue-100 text-blue-700 border-blue-200"
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList className="mb-4">
          <TabsTrigger value="recommendations">All Recommendations</TabsTrigger>
          <TabsTrigger value="new">
            New
            {newRecommendations.length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {newRecommendations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-2">No recommendations available</p>
                <p className="text-sm text-gray-400">
                  As you use the app more, we'll provide personalized recommendations based on your activities
                </p>
              </CardContent>
            </Card>
          ) : (
            <Recommendations
              recommendations={filteredRecommendations}
              onFilterChange={setRecommendationFilter}
              activeFilter={recommendationFilter}
            />
          )}
        </TabsContent>
        
        <TabsContent value="new">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : newRecommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">You're all caught up!</p>
                <p className="text-sm text-gray-400 mt-2">
                  Check back later for new recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newRecommendations.map((rec) => (
                <Card key={rec.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <div
                      className="w-full h-36 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${rec.imageUrl})`,
                      }}
                    ></div>
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </div>
                  </div>
                  <CardContent className="p-4">
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
                    <div className="flex justify-between items-center">
                      <a 
                        href={rec.actionUrl || "#"} 
                        className="text-xs font-medium text-primary hover:text-indigo-700"
                        onClick={() => handleViewRecommendation(rec.id)}
                      >
                        {rec.actionLabel || "View Details"} →
                      </a>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleViewRecommendation(rec.id)}
                      >
                        Mark as seen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-medium">Health Patterns</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                We've noticed you're most active on weekdays between 5-7 PM. 
                This consistency helps maintain your fitness routine.
              </p>
              <Button variant="outline" size="sm" className="text-primary border-primary/20">
                View Health Details
              </Button>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium">Spending Insights</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Your dining expenses have increased by 25% this month compared to last month.
                Consider setting a budget alert.
              </p>
              <Button variant="outline" size="sm" className="text-amber-600 border-amber-200">
                Review Finances
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
