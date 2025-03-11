
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotificationsButton = () => {
  return (
    <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200 relative">
      <Bell className="h-4 w-4" />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1"
      >
        <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
          3
        </Badge>
      </motion.div>
    </Button>
  );
};

export default NotificationsButton;
