import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Calendar, Heart, DollarSign, Compass, Settings } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const currentPath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  const navItems = [
    { href: "/", icon: Home, label: "Home", path: "/" },
    { href: "/schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { href: "/health", icon: Heart, label: "Health", path: "/health" },
    { href: "/finance", icon: DollarSign, label: "Finance", path: "/finance" },
    { href: "/discovery", icon: Compass, label: "Discover", path: "/discovery" },
    { href: "/settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10" style={{ backgroundColor: '#f0ede4', borderTop: '1px solid #d8d5c8' }}>
      <div className="flex justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a className="flex flex-col items-center justify-center px-2 py-1 min-w-0">
                <div className="relative">
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl -m-1" style={{ backgroundColor: '#7d9b6f20' }} />
                  )}
                  <Icon className="h-5 w-5 relative" style={{ color: isActive ? '#5a7a50' : '#8a8a72' }} />
                </div>
                <span className="text-[9px] mt-0.5 font-medium" style={{ color: isActive ? '#5a7a50' : '#8a8a72' }}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
