import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Calendar, Heart, DollarSign, Search } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const currentPath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  const navItems = [
    { href: "/", icon: Home, label: "Home", path: "/" },
    { href: "/schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { href: "/health", icon: Heart, label: "Health", path: "/health" },
    { href: "/finance", icon: DollarSign, label: "Finance", path: "/finance" },
    { href: "/discovery", icon: Search, label: "Search", path: "/discovery" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10" style={{ backgroundColor: '#f0ede4' }}>
      <div className="flex justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a className="flex flex-col items-center justify-center px-3 py-1">
                <Icon
                  className={cn("h-5 w-5 transition-colors", isActive ? "" : "")}
                  style={{ color: isActive ? '#5a7a50' : '#8a8a72' }}
                />
                <span
                  className="text-[10px] mt-1 font-medium"
                  style={{ color: isActive ? '#5a7a50' : '#8a8a72' }}
                >
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
