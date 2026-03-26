import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useVoiceCommands } from "@/hooks/use-voice-commands";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Upload, Mic, Eye, Type, Home, Calendar, Heart, DollarSign, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AccessibilitySettings() {
  const { 
    voiceEnabled, 
    toggleVoiceEnabled, 
    highContrastMode, 
    toggleHighContrastMode,
    fontSize,
    setFontSize,
    startListening,
    stopListening,
    isListening
  } = useVoiceCommands();

  return (
    <div className="mt-4 px-3 py-3 rounded-xl" style={{ backgroundColor: 'rgba(125, 155, 111, 0.08)' }}>
      <h3 className="text-sm font-medium mb-3" style={{ color: '#5a5a48' }}>Accessibility</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4" style={{ color: '#8a8a72' }} />
            <Label htmlFor="voice-commands" className="text-sm">Voice</Label>
          </div>
          <Switch 
            id="voice-commands" 
            checked={voiceEnabled}
            onCheckedChange={toggleVoiceEnabled}
          />
        </div>
        
        {voiceEnabled && (
          <Button 
            size="sm" 
            variant={isListening ? "destructive" : "outline"} 
            className="w-full text-xs rounded-lg" 
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? "Stop Listening" : "Start Listening"}
          </Button>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4" style={{ color: '#8a8a72' }} />
            <Label htmlFor="high-contrast" className="text-sm">Contrast</Label>
          </div>
          <Switch 
            id="high-contrast" 
            checked={highContrastMode}
            onCheckedChange={toggleHighContrastMode}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4" style={{ color: '#8a8a72' }} />
            <Label htmlFor="font-size" className="text-sm">Font Size</Label>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['normal', 'large', 'extra-large'] as const).map((size) => (
              <Button 
                key={size}
                size="sm" 
                variant={fontSize === size ? "default" : "outline"} 
                className="text-xs py-1 rounded-lg" 
                onClick={() => setFontSize(size)}
              >
                {size === 'normal' ? 'Sm' : size === 'large' ? 'Md' : 'Lg'}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
};

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a className={cn("nav-item group", active ? "active" : "")}>
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
      updateProfilePictureMutation.mutate({ profilePicture: base64String }, {
        onSettled: () => setIsUploading(false)
      });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="relative flex items-center">
      <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
      <label htmlFor="profile-upload" className="cursor-pointer flex items-center gap-2 w-full px-2 py-1 text-sm rounded-lg hover:opacity-80">
        <Upload className="h-4 w-4" style={{ color: '#8a8a72' }} />
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
        <div className="h-4 w-24 rounded" style={{ backgroundColor: '#d8d5c8' }}></div>
        <div className="h-3 w-20 rounded mt-1" style={{ backgroundColor: '#d8d5c8' }}></div>
      </div>
    );
  }
  
  const handleLogout = () => { logoutMutation.mutate(); };
  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.username?.[0]?.toUpperCase() || 'U';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center ml-2 cursor-pointer">
          <Avatar className="h-8 w-8 border-2" style={{ borderColor: '#d4cfc2' }}>
            <AvatarImage src={user?.profilePicture || ''} alt={user?.displayName || user?.username} />
            <AvatarFallback style={{ backgroundColor: '#e6e8d4', color: '#5a7a50' }}>{initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium" style={{ color: '#3d3d2e' }}>{user?.displayName || "User"}</p>
            <p className="text-xs" style={{ color: '#8a8a72' }}>{user?.email || user?.username || ""}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-0 shadow-lg" style={{ backgroundColor: '#f0ede4' }}>
        <DropdownMenuLabel style={{ color: '#3d3d2e' }}>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: '#d4cfc2' }} />
        <ProfilePictureUploader />
        <DropdownMenuSeparator style={{ backgroundColor: '#d4cfc2' }} />
        <DropdownMenuItem className="cursor-pointer" style={{ color: '#c47a5a' }} onClick={handleLogout} disabled={logoutMutation.isPending}>
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

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home, path: "/" },
    { href: "/schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { href: "/health", label: "Health", icon: Heart, path: "/health" },
    { href: "/finance", label: "Finance", icon: DollarSign, path: "/finance" },
    { href: "/discovery", label: "Discovery", icon: Search, path: "/discovery" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 p-4" style={{ backgroundColor: '#f0ede4' }}>
      <div className="flex items-center mb-8 px-2">
        <div className="rounded-xl p-2" style={{ backgroundColor: '#7d9b6f' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold ml-3" style={{ color: '#3d3d2e' }}>iMe</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            active={currentPath === item.path}
            icon={<item.icon className="sidebar-icon" />}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>

      <div className="mt-auto pt-4" style={{ borderTop: '1px solid #d4cfc2' }}>
        <NavItem
          href="/settings"
          active={currentPath === "/settings"}
          icon={<Settings className="sidebar-icon" />}
        >
          Settings
        </NavItem>
        
        <AccessibilitySettings />

        <div className="flex items-center mt-4 px-3 py-2">
          <UserInfo />
        </div>
      </div>
    </aside>
  );
}
