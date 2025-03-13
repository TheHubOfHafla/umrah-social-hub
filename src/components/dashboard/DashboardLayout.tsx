
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User as UserType } from "@/types";
import Sidebar from "./Sidebar";
import SidebarToggle from "./SidebarToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserType;
  type: "user" | "organizer";
}

const DashboardLayout = ({ children, user, type }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Mobile sidebar toggle */}
        <SidebarToggle 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Sidebar */}
        <Sidebar 
          user={user}
          type={type}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main content */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        )}>
          <main className="container py-8">
            {children}
          </main>
        </div>
      </div>

      <div className={cn(
        "mt-auto",
        sidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
