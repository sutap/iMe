import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
};

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a className={cn(
        "nav-item group", 
        active ? "active" : ""
      )}>
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const currentPath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <div className="flex items-center mb-8 px-2">
        <div className="bg-indigo-100 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold ml-2 text-gray-900">LifeAssist</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem
          href="/"
          active={currentPath === "/"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          }
        >
          Dashboard
        </NavItem>

        <NavItem
          href="/schedule"
          active={currentPath === "/schedule"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        >
          Schedule
        </NavItem>

        <NavItem
          href="/health"
          active={currentPath === "/health"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
        >
          Health
        </NavItem>

        <NavItem
          href="/finance"
          active={currentPath === "/finance"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        >
          Finance
        </NavItem>

        <NavItem
          href="/discovery"
          active={currentPath === "/discovery"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        >
          Discovery
        </NavItem>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="nav-item group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Settings</span>
        </div>

        <div className="flex items-center mt-4 px-3 py-2">
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
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
            <p className="text-xs text-gray-500">alex@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
