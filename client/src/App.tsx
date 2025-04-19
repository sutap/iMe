import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Health from "@/pages/health";
import Finance from "@/pages/finance";
import Discovery from "@/pages/discovery";
import { useState, useEffect } from "react";

function Router() {
  // In a real app, this would be handled with authentication
  // For demo purposes, we'll use a simple userId
  const [userId, setUserId] = useState<number>(1);

  return (
    <Switch>
      <Route path="/">
        <Layout>
          <Dashboard userId={userId} />
        </Layout>
      </Route>
      <Route path="/schedule">
        <Layout>
          <Schedule userId={userId} />
        </Layout>
      </Route>
      <Route path="/health">
        <Layout>
          <Health userId={userId} />
        </Layout>
      </Route>
      <Route path="/finance">
        <Layout>
          <Finance userId={userId} />
        </Layout>
      </Route>
      <Route path="/discovery">
        <Layout>
          <Discovery userId={userId} />
        </Layout>
      </Route>
      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
