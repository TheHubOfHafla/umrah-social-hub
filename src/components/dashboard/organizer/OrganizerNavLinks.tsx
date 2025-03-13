
import { Link } from "react-router-dom";
import { Calendar, LayoutDashboard, Settings, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrganizerNavLinksProps {
  className?: string;
}

const OrganizerNavLinks = ({ className }: OrganizerNavLinksProps) => {
  const navItems = [
    {
      label: "Dashboard",
      href: "/organizer",
      icon: LayoutDashboard,
    },
    {
      label: "Events",
      href: "/organizer/events",
      icon: Calendar,
    },
    {
      label: "Attendees",
      href: "/organizer/attendees",
      icon: Users,
    },
    {
      label: "Profile",
      href: "/organizer/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/organizer/settings",
      icon: Settings,
    },
  ];

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {navItems.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default OrganizerNavLinks;
