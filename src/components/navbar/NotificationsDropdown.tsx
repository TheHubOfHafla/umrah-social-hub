import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Clock, Calendar, User, Info, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Mock notification data - in a real app, this would come from your backend
const mockNotifications = [
  {
    id: "1",
    type: "event",
    title: "Event Reminder",
    message: "Tech Conference starts in 3 hours",
    read: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    eventId: "event-1",
    clickCount: 0
  },
  {
    id: "2",
    type: "system",
    title: "Welcome!",
    message: "Welcome to Events Hub! Discover and join amazing events.",
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clickCount: 0
  },
  {
    id: "3",
    type: "chat",
    title: "New Message",
    message: "You have a new message in the Tech Conference chat",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    eventId: "event-1",
    clickCount: 0
  }
];

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => {
        if (n.id === id) {
          // Increment click count when marking as read
          const updatedClickCount = n.clickCount + 1;
          
          // If clicked more than once and already read, remove the notification
          if (updatedClickCount > 1 && n.read) {
            return null;
          }
          
          return { ...n, read: true, clickCount: updatedClickCount };
        }
        return n;
      }).filter(Boolean) // Remove null entries (deleted notifications)
    );
  };

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    handleMarkAsRead(notification.id);
    
    if (notification.type === "event" && notification.eventId) {
      navigate(`/events/${notification.eventId}`);
    } else if (notification.type === "chat" && notification.eventId) {
      navigate(`/events/${notification.eventId}?tab=chat`);
    }
    
    setIsOpen(false);
  };

  const handleRemoveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      
      if (notification) {
        const updatedClickCount = notification.clickCount + 1;
        
        // Remove notification if clicked more than once
        if (updatedClickCount > 1) {
          toast({
            description: "Notification removed",
            duration: 3000,
          });
          
          return prev.filter(n => n.id !== id);
        }
        
        // Otherwise just increment the click count
        return prev.map(n => 
          n.id === id ? { ...n, clickCount: updatedClickCount } : n
        );
      }
      
      return prev;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-primary" />;
      case "chat":
        return <Bell className="h-4 w-4 text-indigo-500" />;
      case "user":
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7" 
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 flex gap-3 hover:bg-muted/50 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <button 
                    className="self-start p-1 hover:bg-muted rounded-full"
                    onClick={(e) => handleRemoveNotification(notification.id, e)}
                    title={notification.clickCount === 0 ? "Click again to remove" : "Remove notification"}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
