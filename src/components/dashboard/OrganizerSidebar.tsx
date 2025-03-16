
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  CreditCard,
  Settings,
  Ticket,
  Users,
  Clock,
  MessageSquare,
  Mail,
  ShieldCheck,
  BarChart2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OrganizerSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/organizer/dashboard",
    },
    {
      title: "Events",
      icon: Calendar,
      path: "/organizer/events",
      badge: "3"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/organizer/analytics",
    },
    {
      title: "Financials",
      icon: DollarSign,
      path: "/organizer/financials",
    },
    {
      title: "Tickets",
      icon: Ticket,
      path: "/organizer/tickets",
    },
    {
      title: "Attendees",
      icon: Users,
      path: "/organizer/attendees",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/organizer/messages",
      badge: "5"
    },
    {
      title: "Email Marketing",
      icon: Mail,
      path: "/organizer/email",
      premium: true
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/organizer/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="/placeholder.svg" alt="Organizer" />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">Masjid Al-Noor</h3>
            <p className="text-xs text-muted-foreground">Event Organizer</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="justify-between"
                  >
                    <Link to={item.path}>
                      <div className="flex items-center">
                        <item.icon className="mr-2" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                      {item.premium && (
                        <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20">
                          PRO
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Analytics Shortcuts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/organizer/analytics/sales">
                    <BarChart2 className="mr-2" />
                    <span>Sales Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/organizer/analytics/engagement">
                    <TrendingUp className="mr-2" />
                    <span>User Engagement</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/organizer/analytics/attendance">
                    <Clock className="mr-2" />
                    <span>Attendance Tracking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t p-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-sm">Premium Features</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Upgrade to access AI recommendations and advanced analytics.
          </p>
          <Button size="sm" className="w-full">Upgrade Now</Button>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          <p>© 2023 EventHub • v1.0.2</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default OrganizerSidebar;
