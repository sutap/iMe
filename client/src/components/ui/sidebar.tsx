import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function ProfilePictureUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const { updateProfilePictureMutation } = useAuth();
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateProfilePictureMutation.mutate({ 
        profilePicture: base64String 
      }, {
        onSettled: () => setIsUploading(false)
      });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="relative flex items-center">
      <input
        type="file"
        id="profile-upload"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <label 
        htmlFor="profile-upload" 
        className="cursor-pointer flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md hover:bg-gray-100"
      >
        <Upload className="h-4 w-4" />
        <span>Update Picture</span>
      </label>
    </div>
  );
}

function UserInfo() {
  const { user, isLoading, logoutMutation } = useAuth();
  
  if (isLoading) {
    return (
      <div className="ml-3 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
      </div>
    );
  }
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.username?.[0]?.toUpperCase() || 'U';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center ml-2 cursor-pointer">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={user?.profilePicture || ''} alt={user?.displayName || user?.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.displayName || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email || user?.username || ""}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ProfilePictureUploader />
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer"
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

export default function Sidebar() {
  const [location] = useLocation();
  const currentPath = location === "/" ? "/" : `/${location.split("/")[1]}`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <div className="flex items-center mb-8 px-2">
        <div className="bg-blue-400 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
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
        <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">iMe</h1>
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
          <UserInfo />
        </div>
      </div>
    </aside>
  );
}
