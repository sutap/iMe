import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

function MobileUserInfo() {
  const { user, isLoading, logoutMutation } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.username?.[0]?.toUpperCase() || 'U';
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Avatar className="h-8 w-8 border-2" style={{ borderColor: '#d4cfc2' }}>
            <AvatarImage src={user?.profilePicture || ''} alt={user?.displayName || user?.username} />
            <AvatarFallback className="text-sm font-medium" style={{ backgroundColor: '#e8e4d9', color: '#5a7a50' }}>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-0 shadow-lg" style={{ backgroundColor: '#f0ede4' }}>
        <DropdownMenuLabel className="text-sm" style={{ color: '#3d3d2e' }}>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: '#d4cfc2' }} />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" style={{ color: '#8a8a72' }} />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ backgroundColor: '#d4cfc2' }} />
        <DropdownMenuItem 
          className="cursor-pointer"
          style={{ color: '#c47a5a' }}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const path = location.split("/")[1] || "dashboard";
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#e6e8d4' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {isMobile && (
          <header className="p-4 sticky top-0 z-10" style={{ backgroundColor: '#e6e8d4' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="rounded-xl p-2 mr-2" style={{ backgroundColor: '#7d9b6f' }}>
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
                <h1 className="text-xl font-bold" style={{ color: '#3d3d2e' }}>iMe</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: '#8a8a72' }}
                >
                  <Bell className="h-5 w-5" />
                </button>
                <MobileUserInfo />
              </div>
            </div>
          </header>
        )}

        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {isMobile && <MobileNav />}
    </div>
  );
}
