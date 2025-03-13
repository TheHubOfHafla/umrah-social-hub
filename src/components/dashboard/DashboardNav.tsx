
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  Home, 
  Settings, 
  User, 
  Users, 
  ChevronRight,
  LogOut
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { User as UserType } from "@/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

interface DashboardNavProps {
  user: UserType;
  type: "user" | "organizer";
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const DashboardNav = ({ 
  user, 
  type, 
  sidebarCollapsed, 
  setSidebarCollapsed 
}: DashboardNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const baseRoute = type === "user" ? "/dashboard" : "/organizer";
  
  const navItems: NavItem[] = [
    {
      label: "Overview",
      href: baseRoute,
      icon: Home,
    },
    {
      label: "Events",
      href: `${baseRoute}/events`,
      icon: Calendar,
    },
    {
      label: "Profile",
      href: `${baseRoute}/profile`,
      icon: User,
    },
  ];

  // Add organizer-specific items
  if (type === "organizer") {
    navItems.push({
      label: "Attendees",
      href: `${baseRoute}/attendees`,
      icon: Users,
    });
    navItems.push({
      label: "Settings",
      href: `${baseRoute}/settings`,
      icon: Settings,
    });
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out."
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error in sign out:", error);
    }
  };

  return (
    <>
      {/* Collapse toggle button (desktop only) */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-20 hidden md:flex" 
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <ScrollArea className="h-[calc(100%-8rem)] py-6">
        <div className={cn("px-3 py-2", sidebarCollapsed ? "items-center" : "")}>
          <div className={cn(
            "mb-6 flex items-center px-2 py-1.5 rounded-md", 
            !sidebarCollapsed && "space-x-3",
            sidebarCollapsed && "flex-col justify-center"
          )}>
            <UserAvatar user={user} size={sidebarCollapsed ? "md" : "sm"} />
            
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {type === "user" ? "User Dashboard" : "Organizer Dashboard"}
                </p>
              </div>
            )}
          </div>

          <nav className="space-y-1 px-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    sidebarCollapsed && "justify-center p-2"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "opacity-70")} />
                  {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 border-t p-3",
        sidebarCollapsed ? "flex flex-col items-center space-y-2" : "space-y-2"
      )}>
        <Button 
          variant="destructive" 
          className={cn(
            "justify-start", 
            sidebarCollapsed && "w-10 h-10 p-0 justify-center"
          )} 
          size="sm"
          onClick={handleSignOut}
          title={sidebarCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-2")} />
          {!sidebarCollapsed && "Sign Out"}
        </Button>
        
        <Link to="/" className={sidebarCollapsed ? "flex justify-center" : ""}>
          <Button 
            variant="outline" 
            className={cn(
              "justify-start w-full", 
              sidebarCollapsed && "w-10 h-10 p-0 justify-center"
            )} 
            size="sm"
            title={sidebarCollapsed ? "Back to Home" : undefined}
          >
            <ChevronLeft className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-2")} />
            {!sidebarCollapsed && "Back to Home"}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default DashboardNav;
