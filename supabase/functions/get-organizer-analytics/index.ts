
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get query parameters
    const url = new URL(req.url);
    const organizerId = url.searchParams.get('organizerId');

    if (!organizerId) {
      return new Response(
        JSON.stringify({ error: 'Organizer ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get event IDs for the organizer
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_date, capacity, tickets_remaining, estimated_sellout_days')
      .eq('organizer_id', organizerId);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch events' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const eventIds = events.map(event => event.id);

    // Get metrics for each event
    const { data: metrics, error: metricsError } = await supabase
      .from('event_metrics')
      .select('*')
      .in('event_id', eventIds);

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch metrics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get ticket sales data
    const { data: ticketSales, error: salesError } = await supabase
      .from('ticket_sales_daily')
      .select('*')
      .in('event_id', eventIds)
      .order('sale_date', { ascending: true });

    if (salesError) {
      console.error('Error fetching ticket sales:', salesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch ticket sales' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get engagement data
    const { data: engagement, error: engagementError } = await supabase
      .from('user_engagement')
      .select('*')
      .eq('organizer_id', organizerId);

    if (engagementError) {
      console.error('Error fetching user engagement:', engagementError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user engagement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI recommendations based on data
    const recommendations = generateRecommendations(events, metrics, ticketSales, engagement);

    return new Response(
      JSON.stringify({
        events,
        metrics,
        ticketSales,
        engagement,
        recommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-organizer-analytics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to generate AI-based recommendations
function generateRecommendations(events, metrics, ticketSales, engagement) {
  const recommendations = [];

  // Process events data
  events.forEach(event => {
    const eventMetrics = metrics.filter(m => m.event_id === event.id);
    const eventSales = ticketSales.filter(s => s.event_id === event.id);
    const eventEngagement = engagement.filter(e => e.event_id === event.id);
    
    // Low conversion rate recommendation
    const avgConversionRate = eventMetrics.length > 0 
      ? eventMetrics.reduce((sum, m) => sum + m.conversion_rate, 0) / eventMetrics.length 
      : 0;
    
    if (avgConversionRate < 10) {
      recommendations.push({
        eventId: event.id,
        eventTitle: event.title,
        type: 'conversion',
        message: `Your event "${event.title}" is getting views but has a low conversion rate (${avgConversionRate.toFixed(1)}%). Consider offering an early bird discount to boost sales.`
      });
    }
    
    // Slow ticket sales recommendation
    if (event.estimated_sellout_days && event.estimated_sellout_days > 60) {
      recommendations.push({
        eventId: event.id,
        eventTitle: event.title,
        type: 'sales_speed',
        message: `At the current rate, tickets for "${event.title}" might not sell out before the event. Consider boosting visibility through social media promotion.`
      });
    }
    
    // High engagement but low sales
    if (eventEngagement.length > 50 && eventSales.length < 10) {
      recommendations.push({
        eventId: event.id,
        eventTitle: event.title,
        type: 'engagement',
        message: `"${event.title}" has high user interest but low ticket sales. Try sending a targeted marketing campaign to users who viewed the event.`
      });
    }
  });
  
  // General recommendations
  if (events.length > 0 && recommendations.length === 0) {
    recommendations.push({
      type: 'general',
      message: 'Your events are performing well! To maximize reach, consider cross-promoting between your different events.'
    });
  }
  
  if (events.length === 0) {
    recommendations.push({
      type: 'new_organizer',
      message: 'Welcome! Create your first event to start tracking performance metrics and get personalized recommendations.'
    });
  }

  return recommendations;
}
