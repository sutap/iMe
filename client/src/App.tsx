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
import { UserProvider, useUser } from "@/hooks/use-user";

function Router() {
  const { currentUser, isLoading } = useUser();
  // Fall back to userId 1 if not loaded yet
  const userId = currentUser?.id || 1;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
        <UserProvider>
          <Router />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
