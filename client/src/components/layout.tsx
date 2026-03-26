import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useLocation, Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useQuery } from "@tanstack/react-query";
import { useEvents } from "@/hooks/use-events";
import { useEventReminders } from "@/hooks/use-event-reminders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Bell, Search, X, Calendar, DollarSign, Lightbulb } from "lucide-react";
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

const C = { bg: '#e6e8d4', card: '#f0ede4', primary: '#7d9b6f', text: '#3d3d2e', muted: '#8a8a72', border: '#d8d5c8' };

function GlobalSearch({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const { data: results, isLoading } = useQuery<{ events: any[]; transactions: any[]; recommendations: any[] }>({
    queryKey: [`/api/search/${userId}`, { q: query }],
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleClose = () => { setIsOpen(false); setQuery(""); };
  const totalResults = (results?.events.length || 0) + (results?.transactions.length || 0) + (results?.recommendations.length || 0);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl transition-colors" style={{ color: C.muted }}>
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={handleClose}>
      <div className="m-4 mt-16 rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: C.card }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: C.border }}>
          <Search className="h-4 w-4 flex-shrink-0" style={{ color: C.muted }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, transactions, tips..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: C.text }}
          />
          <button onClick={handleClose} className="p-1 rounded-lg" style={{ color: C.muted }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading && <p className="text-center text-sm p-4" style={{ color: C.muted }}>Searching...</p>}
            {!isLoading && totalResults === 0 && (
              <p className="text-center text-sm p-4" style={{ color: C.muted }}>No results for "{query}"</p>
            )}
            {(results?.events.length || 0) > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold px-2 py-1" style={{ color: C.muted }}>Events</p>
                {results!.events.slice(0, 3).map((e: any) => (
                  <button key={e.id} onClick={() => { navigate('/schedule'); handleClose(); }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:opacity-80 text-left">
                    <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: C.primary }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: C.text }}>{e.title}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{e.location || e.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {(results?.transactions.length || 0) > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold px-2 py-1" style={{ color: C.muted }}>Transactions</p>
                {results!.transactions.slice(0, 3).map((t: any) => (
                  <button key={t.id} onClick={() => { navigate('/finance'); handleClose(); }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:opacity-80 text-left">
                    <DollarSign className="h-4 w-4 flex-shrink-0" style={{ color: t.isIncome ? C.primary : '#c47a5a' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: C.text }}>{t.description}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{t.category} · ${t.amount}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {(results?.recommendations.length || 0) > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold px-2 py-1" style={{ color: C.muted }}>Tips</p>
                {results!.recommendations.slice(0, 3).map((r: any) => (
                  <button key={r.id} onClick={() => { navigate('/discovery'); handleClose(); }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:opacity-80 text-left">
                    <Lightbulb className="h-4 w-4 flex-shrink-0" style={{ color: '#c4a882' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: C.text }}>{r.title}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{r.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {query.length < 2 && (
          <div className="p-4 text-center">
            <p className="text-sm" style={{ color: C.muted }}>Type at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationBell({ userId }: { userId: number }) {
  const { events } = useEvents(userId);
  const [, navigate] = useLocation();

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Upcoming events in the next 24 hours that have reminders set
  const upcoming = (events || []).filter(e => {
    const start = new Date(e.startTime);
    return start > now && start <= next24h && e.reminder && e.reminder > 0;
  });

  return (
    <button
      onClick={() => navigate('/schedule')}
      className="relative p-2 rounded-xl transition-colors"
      style={{ color: C.muted }}
      title={upcoming.length > 0 ? `${upcoming.length} upcoming event${upcoming.length !== 1 ? 's' : ''} with reminders` : 'Schedule'}
    >
      <Bell className="h-5 w-5" />
      {upcoming.length > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: '#c47a5a' }}>
          {upcoming.length > 9 ? '9+' : upcoming.length}
        </span>
      )}
    </button>
  );
}

function MobileUserInfo({ userId }: { userId: number }) {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  if (isLoading) return null;
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Avatar className="h-8 w-8 border-2" style={{ borderColor: C.border }}>
            <AvatarImage src={user?.profilePicture || ''} alt={user?.displayName || user?.username} />
            <AvatarFallback className="text-sm font-medium" style={{ backgroundColor: '#e8e4d9', color: C.primary }}>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-0 shadow-lg" style={{ backgroundColor: C.card }}>
        <DropdownMenuLabel className="text-sm" style={{ color: C.text }}>{user?.displayName || user?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: C.border }} />
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" style={{ color: C.muted }} />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ backgroundColor: C.border }} />
        <DropdownMenuItem className="cursor-pointer" style={{ color: '#c47a5a' }} onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isDark } = useDarkMode();
  const userId = user?.id || 1;

  // Activate event reminders globally — schedules browser + in-app notifications
  useEventReminders(userId);

  return (
    <div className="flex h-screen" style={{ backgroundColor: isDark ? '#1a1f1a' : C.bg }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {isMobile && (
          <header className="p-4 sticky top-0 z-10" style={{ backgroundColor: isDark ? '#1a1f1a' : C.bg }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="rounded-xl p-2 mr-2" style={{ backgroundColor: C.primary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold" style={{ color: isDark ? '#e8e8d0' : C.text }}>iMe</h1>
              </div>
              <div className="flex items-center space-x-1">
                <NotificationBell userId={userId} />
                <GlobalSearch userId={userId} />
                <MobileUserInfo userId={userId} />
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
