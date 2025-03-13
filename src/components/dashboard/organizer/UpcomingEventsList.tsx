
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { Calendar, Users, Clock, Share2, PenSquare, ExternalLink } from "lucide-react";

interface UpcomingEventsListProps {
  events: Event[];
}

const UpcomingEventsList = ({ events }: UpcomingEventsListProps) => {
  // Use the uploaded image
  const imageSrc = "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-[#8B5CF6]" /> Upcoming Events
        </h3>
        <Link to="/events/create">
          <Button variant="outline" size="sm" className="text-xs">Create Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
            <h3 className="font-medium text-muted-foreground">No upcoming events</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Start by creating your first event
            </p>
            <Link to="/events/create">
              <Button size="sm">Create Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="transition-all duration-300"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-24 h-24 sm:h-auto overflow-hidden bg-muted">
                      <img 
                        src={imageSrc} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="mb-3">
                        <h3 className="font-medium mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(event.date.start).toLocaleDateString("en-GB", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.attendees?.length || 0} / {event.capacity || "∞"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/events/${event.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" /> View
                          </Button>
                        </Link>
                        <Link to={`/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <PenSquare className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Share2 className="h-3 w-3 mr-1" /> Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingEventsList;

