
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { generateBasicEvent } from "../../../src/lib/data.ts";

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
    console.log("Edge function called - ai-event-generator");
    const { eventCategory, eventDetails } = await req.json();

    if (!eventCategory || !eventDetails) {
      console.error("Missing required parameters:", { eventCategory, eventDetails });
      return new Response(
        JSON.stringify({ error: 'Category and details are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Since we're removing AI assistance, always use the basic event generator
    console.log(`Generating basic event for category: ${eventCategory}, with details: ${eventDetails}`);
    const basicEvent = generateBasicEvent(eventCategory, eventDetails);
    
    return new Response(
      JSON.stringify({ event: basicEvent, source: 'basic' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-event-generator function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
