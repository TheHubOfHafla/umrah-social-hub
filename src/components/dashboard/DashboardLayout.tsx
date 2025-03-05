
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
  Menu, 
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserAvatar from "@/components/UserAvatar";
import { User as UserType } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserType;
  type: "user" | "organizer";
}

interface NavItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const DashboardLayout = ({ children, user, type }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Mobile sidebar toggle */}
        <div className="fixed bottom-4 right-4 z-40 md:hidden">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-sidebar transition-transform duration-300 md:translate-x-0 pt-16",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <ScrollArea className="h-full py-6">
            <div className="px-4 py-4">
              <div className="mb-6 flex items-center space-x-3 px-2">
                <UserAvatar user={user} size="md" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {type === "user" ? "User Dashboard" : "Organizer Dashboard"}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </ScrollArea>

          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <Link to="/">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className={cn(
          "flex-1 transition-all duration-300 transform md:pl-64",
          sidebarOpen ? "md:pl-64" : "md:pl-64"
        )}>
          <main className="container py-8">
            {children}
          </main>
        </div>
      </div>

      <div className="mt-auto md:pl-64">
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
