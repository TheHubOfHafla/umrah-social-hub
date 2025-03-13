
import React from "react";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";
import DashboardNav from "./DashboardNav";

interface SidebarProps {
  user: UserType;
  type: "user" | "organizer";
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ 
  user, 
  type, 
  sidebarOpen, 
  sidebarCollapsed, 
  setSidebarCollapsed 
}: SidebarProps) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 bg-card border-r border-border transition-all duration-300 pt-16 shadow-sm",
        sidebarCollapsed ? "w-20" : "w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <DashboardNav 
        user={user} 
        type={type} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
    </div>
  );
};

export default Sidebar;
