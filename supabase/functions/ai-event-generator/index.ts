
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { eventCategory, eventDetails } = await req.json();

    if (!eventCategory || !eventDetails) {
      return new Response(
        JSON.stringify({ error: 'Category and details are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating event for category: ${eventCategory}, with details: ${eventDetails}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an event planning assistant. Create an event based on the category and description provided by the user. 
                      Your response should be a JSON object with these fields:
                      {
                        "title": "Event title",
                        "description": "Detailed event description",
                        "location": {
                          "name": "Venue name",
                          "address": "Venue address",
                          "city": "City name",
                          "country": "Country name"
                        },
                        "suggestedDate": "YYYY-MM-DD",
                        "capacity": 50,
                        "isFree": true/false,
                        "suggestedPrice": 0,
                        "categoryRecommendations": ["tag1", "tag2"]
                      }` 
          },
          { 
            role: 'user', 
            content: `Create an event in the category "${eventCategory}" with these details: "${eventDetails}".
                      Format as valid JSON only with no extra text.` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Parse the JSON string from the API response
      const generatedEvent = JSON.parse(data.choices[0].message.content);
      
      // Return the parsed event data
      return new Response(
        JSON.stringify({ event: generatedEvent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from AI', raw: data.choices[0].message.content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in ai-event-generator function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
