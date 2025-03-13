
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the organizer ID for the current user
    const { data: organizerData, error: organizerError } = await supabaseClient
      .from('organizers')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (organizerError || !organizerData) {
      return new Response(
        JSON.stringify({ error: 'Not an organizer' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const organizerId = organizerData.id;
    
    // Get the events for this organizer
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('id, title, date, tickets_remaining, estimated_sellout_days')
      .eq('organizer_id', organizerId);
    
    if (eventsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch events' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For each event, get the metrics
    const eventIds = events.map(event => event.id);
    
    // Get metrics
    const { data: metrics, error: metricsError } = await supabaseClient
      .from('event_metrics')
      .select('*')
      .in('event_id', eventIds);
      
    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
    }
    
    // Get ticket sales
    const { data: ticketSales, error: salesError } = await supabaseClient
      .from('ticket_sales_daily')
      .select('*')
      .in('event_id', eventIds)
      .order('sale_date', { ascending: false });
      
    if (salesError) {
      console.error('Error fetching ticket sales:', salesError);
    }
    
    // Get user engagement
    const { data: engagement, error: engagementError } = await supabaseClient
      .from('user_engagement')
      .select('*')
      .eq('organizer_id', organizerId)
      .order('created_at', { ascending: false });
      
    if (engagementError) {
      console.error('Error fetching user engagement:', engagementError);
    }

    // Generate AI recommendations based on data
    const recommendations = generateRecommendations(events, metrics, ticketSales, engagement);

    return new Response(
      JSON.stringify({
        events,
        metrics: metrics || [],
        ticketSales: ticketSales || [],
        engagement: engagement || [],
        recommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-organizer-analytics function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to generate recommendations based on data
function generateRecommendations(events, metrics, ticketSales, engagement) {
  const recommendations = [];
  
  // Sample recommendation logic - in a real system, this would be more sophisticated
  if (events.length === 0) {
    recommendations.push({
      type: 'create_event',
      message: 'Create your first event to start tracking performance metrics!'
    });
    return recommendations;
  }
  
  // Check if there are events with low ticket sales
  const eventsWithLowSales = events.filter(event => {
    const eventMetrics = metrics?.find(m => m.event_id === event.id);
    return eventMetrics && eventMetrics.conversion_rate < 10; // Less than 10% conversion
  });
  
  if (eventsWithLowSales.length > 0) {
    recommendations.push({
      type: 'improve_sales',
      message: 'Some of your events have low conversion rates. Consider offering early bird discounts to boost ticket sales.',
      affectedEvents: eventsWithLowSales.map(e => e.title)
    });
  }
  
  // Check engagement types
  const profileViews = engagement?.filter(e => e.engagement_type === 'view_profile')?.length || 0;
  const eventClicks = engagement?.filter(e => e.engagement_type === 'click_event')?.length || 0;
  
  if (profileViews > 0 && eventClicks / profileViews < 0.5) {
    recommendations.push({
      type: 'profile_optimization',
      message: 'Your profile gets views but fewer clicks on events. Consider improving your organizer profile with more details about your events.'
    });
  }
  
  // Recommend social media promotion
  recommendations.push({
    type: 'social_media',
    message: 'Post more organic leads through Instagram and TikTok, and link it with HaflaHub for increased visibility.'
  });
  
  // Premium features recommendation
  recommendations.push({
    type: 'premium_features',
    message: 'Upgrade to a premium package for increased event visibility and automated email marketing to potential buyers.'
  });
  
  return recommendations;
}
