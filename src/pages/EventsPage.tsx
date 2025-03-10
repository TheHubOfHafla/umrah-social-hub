
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import EventSearch from "@/components/EventSearch";
import EventGrid from "@/components/EventGrid";
import { Event, EventCategory } from "@/types";
import { getEventsByCategory, getEventsByAttendeeType } from "@/lib/data/queries";
import { supabase } from "@/integrations/supabase/client";
import { mockEvents } from "@/lib/data/events";

const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as EventCategory | null;
  const typeParam = searchParams.get("type") || null;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      try {
        // Try to fetch events from Supabase first
        let query = supabase.from('events').select('*');
        
        // Apply filters if any
        if (categoryParam) {
          query = query.contains('categories', [categoryParam]);
        }
        
        if (typeParam) {
          query = query.eq('attendee_type', typeParam);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching events from Supabase:", error);
          // Fallback to mock data
          let filteredMockEvents = mockEvents;
          
          if (categoryParam) {
            filteredMockEvents = getEventsByCategory(categoryParam);
          } else if (typeParam) {
            filteredMockEvents = getEventsByAttendeeType(typeParam);
          }
          
          setEvents(filteredMockEvents);
        } else if (data && data.length > 0) {
          // Map Supabase data to Event type
          const formattedEvents: Event[] = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            shortDescription: event.short_description || "", // Map short_description to shortDescription
            categories: event.categories,
            date: {
              start: event.start_date,
              end: event.end_date || undefined
            },
            location: {
              name: event.location_name || '',
              address: event.location_address || '',
              city: event.location_city || '',
              country: event.location_country || ''
            },
            image: event.image || '/placeholder.svg',
            organizer: {
              id: event.organizer_id,
              name: "Event Organizer",
              avatar: "/placeholder.svg",
              organizationType: "company"
            },
            attendeeType: event.attendee_type || 'mixed',
            featured: event.featured || false,
            capacity: event.capacity,
            attendees: [],
            isFree: event.is_free,
            price: event.base_price
          }));
          
          setEvents(formattedEvents);
        } else {
          // No events in Supabase, fallback to mock data
          setEvents(mockEvents);
        }
      } catch (error) {
        console.error("Error in fetchEvents:", error);
        // Fallback to mock data
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [categoryParam, typeParam]);
  
  // Filter events based on search query
  const filteredEvents = searchQuery 
    ? events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;
  
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find meaningful experiences and connect with your community</p>
        </div>
        
        <div className="mb-8">
          <EventSearch 
            onSearch={setSearchQuery}
            initialLocation={categoryParam || ""}
          />
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventGrid 
            events={filteredEvents} 
            columns={3}
            showEmpty={true}
          />
        ) : searchQuery ? (
          <div className="py-12 text-center">
            <div className="inline-block rounded-full p-3 bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              No events match your search for "{searchQuery}". Try different keywords or browse all events.
            </p>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No events available at this time. Check back later!</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default EventsPage;
