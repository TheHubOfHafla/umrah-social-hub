
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SidebarToggleProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarToggle = ({ sidebarOpen, setSidebarOpen }: SidebarToggleProps) => {
  return (
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
  );
};

export default SidebarToggle;
