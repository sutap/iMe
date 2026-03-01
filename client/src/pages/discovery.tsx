import { useState } from "react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Recommendations from "@/components/dashboard/recommendations";
import { Heart, DollarSign, Lightbulb } from "lucide-react";

interface DiscoveryProps {
  userId: number;
}

export default function Discovery({ userId }: DiscoveryProps) {
  const [recommendationFilter, setRecommendationFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { recommendations, newRecommendations, isLoading, markViewed } = useRecommendations(userId);
  
  const handleViewRecommendation = (id: number) => { markViewed(id); };

  const filteredRecommendations = selectedCategory 
    ? recommendations.filter(rec => rec.type === selectedCategory)
    : recommendationFilter === "all" ? recommendations : recommendations.filter(rec => rec.type === recommendationFilter);

  const uniqueTypes = Array.from(new Set(recommendations.map(rec => rec.type)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>Discover</h1>
          <p style={{ color: '#8a8a72' }}>Personalized recommendations based on your activities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={selectedCategory === null ? "default" : "outline"} className="rounded-xl" onClick={() => setSelectedCategory(null)}>All</Button>
          {uniqueTypes.map(type => (
            <Button key={type} variant={selectedCategory === type ? "default" : "outline"} className="rounded-xl" onClick={() => setSelectedCategory(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList className="mb-4 rounded-xl" style={{ backgroundColor: '#f0ede4' }}>
          <TabsTrigger value="recommendations" className="rounded-lg">All</TabsTrigger>
          <TabsTrigger value="new" className="rounded-lg">
            New
            {newRecommendations.length > 0 && (
              <span className="ml-2 text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#7d9b6f' }}>
                {newRecommendations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (<Skeleton key={i} className="h-64 w-full rounded-2xl" style={{ backgroundColor: '#d8d5c8' }} />))}
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardContent className="text-center py-12">
                <p style={{ color: '#8a8a72' }}>No recommendations available yet</p>
                <p className="text-sm mt-1" style={{ color: '#a8a892' }}>Keep using the app for personalized suggestions</p>
              </CardContent>
            </Card>
          ) : (
            <Recommendations recommendations={filteredRecommendations} onFilterChange={setRecommendationFilter} activeFilter={recommendationFilter} />
          )}
        </TabsContent>
        
        <TabsContent value="new">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (<Skeleton key={i} className="h-64 w-full rounded-2xl" style={{ backgroundColor: '#d8d5c8' }} />))}
            </div>
          ) : newRecommendations.length === 0 ? (
            <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
              <CardContent className="text-center py-12">
                <p style={{ color: '#8a8a72' }}>You're all caught up!</p>
                <p className="text-sm mt-2" style={{ color: '#a8a892' }}>Check back later for new recommendations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newRecommendations.map((rec) => (
                <Card key={rec.id} className="overflow-hidden border-0 rounded-2xl hover:shadow-md transition-shadow" style={{ backgroundColor: '#f0ede4' }}>
                  <div className="relative">
                    <div className="w-full h-32 bg-cover bg-center rounded-t-2xl" style={{ backgroundImage: `url(${rec.imageUrl})` }}></div>
                    <div className="absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#7d9b6f' }}>New</div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="rounded-lg p-1" style={{ backgroundColor: rec.type === "health" ? 'rgba(125, 155, 111, 0.15)' : 'rgba(196, 168, 130, 0.2)' }}>
                        {rec.type === "health" ? <Heart className="h-3.5 w-3.5" style={{ color: '#5a7a50' }} /> : <DollarSign className="h-3.5 w-3.5" style={{ color: '#c4a882' }} />}
                      </div>
                      <span className="text-xs font-medium ml-1.5" style={{ color: rec.type === "health" ? '#5a7a50' : '#c4a882' }}>
                        {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: '#3d3d2e' }}>{rec.title}</h4>
                    <p className="text-xs mb-3" style={{ color: '#8a8a72' }}>{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <a href={rec.actionUrl || "#"} className="text-xs font-medium" style={{ color: '#7d9b6f' }} onClick={() => handleViewRecommendation(rec.id)}>
                        {rec.actionLabel || "View Details"} →
                      </a>
                      <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg" onClick={() => handleViewRecommendation(rec.id)}>Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#3d3d2e' }}>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(125, 155, 111, 0.08)' }}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-xl mr-3" style={{ backgroundColor: 'rgba(125, 155, 111, 0.15)' }}>
                  <Heart className="h-5 w-5" style={{ color: '#5a7a50' }} />
                </div>
                <h3 className="font-medium" style={{ color: '#3d3d2e' }}>Health Patterns</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#8a8a72' }}>
                You're most active on weekdays between 5-7 PM. Great consistency!
              </p>
              <Button variant="outline" size="sm" className="rounded-lg" style={{ color: '#5a7a50', borderColor: 'rgba(125, 155, 111, 0.3)' }}>View Health</Button>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(196, 168, 130, 0.1)' }}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-xl mr-3" style={{ backgroundColor: 'rgba(196, 168, 130, 0.2)' }}>
                  <DollarSign className="h-5 w-5" style={{ color: '#c4a882' }} />
                </div>
                <h3 className="font-medium" style={{ color: '#3d3d2e' }}>Spending Insights</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#8a8a72' }}>
                Dining expenses increased 25% this month. Consider a budget alert.
              </p>
              <Button variant="outline" size="sm" className="rounded-lg" style={{ color: '#c4a882', borderColor: 'rgba(196, 168, 130, 0.3)' }}>Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
