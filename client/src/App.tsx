import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Health from "@/pages/health";
import Finance from "@/pages/finance";
import Discovery from "@/pages/discovery";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AccessibilityProvider } from "@/hooks/use-voice-commands";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";

// Lazy-loaded components
const AppStorePage = React.lazy(() => import('@/pages/app-store-page'));
const ThemeSettings = React.lazy(() => import('@/pages/theme-settings'));

function Router() {
  const { user, isLoading } = useAuth();
  const userId = user?.id || 1;

  return (
    <Switch>
      {/* Protected Routes */}
      <ProtectedRoute path="/" component={() => (
        <Layout>
          <Dashboard userId={userId} />
        </Layout>
      )} />
      <ProtectedRoute path="/schedule" component={() => (
        <Layout>
          <Schedule userId={userId} />
        </Layout>
      )} />
      <ProtectedRoute path="/health" component={() => (
        <Layout>
          <Health userId={userId} />
        </Layout>
      )} />
      <ProtectedRoute path="/finance" component={() => (
        <Layout>
          <Finance userId={userId} />
        </Layout>
      )} />
      <ProtectedRoute path="/discovery" component={() => (
        <Layout>
          <Discovery userId={userId} />
        </Layout>
      )} />
      
      <ProtectedRoute path="/theme-settings" component={() => (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <ThemeSettings />
        </Suspense>
      )} />
      
      {/* Public Routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/app-store">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AppStorePage />
        </Suspense>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AccessibilityProvider>
            <Router />
            <AccessibilityToolbar />
            <Toaster />
          </AccessibilityProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
