import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";

interface LayoutProps {
  children: React.ReactNode;
}

function MobileUserInfo() {
  const { currentUser, isLoading } = useUser();
  
  if (isLoading) {
    return null; // Don't show anything while loading on mobile
  }
  
  return (
    <span className="text-sm font-medium text-gray-900">
      {currentUser?.displayName?.split(' ')[0] || "User"}
    </span>
  );
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // Set page title based on current route
    const path = location.split("/")[1] || "dashboard";
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-400 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">iMe</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <MobileUserInfo />
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
}
