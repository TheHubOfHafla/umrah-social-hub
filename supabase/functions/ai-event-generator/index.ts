
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { generateBasicEvent } from "../../../src/lib/data.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

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

    // If neither API key is available, fall back to basic generator
    if (!openAIApiKey && !deepseekApiKey) {
      console.warn("Neither OPENAI_API_KEY nor DEEPSEEK_API_KEY set, falling back to basic event generator");
      const basicEvent = generateBasicEvent(eventCategory, eventDetails);
      return new Response(
        JSON.stringify({ event: basicEvent, source: 'fallback' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating event for category: ${eventCategory}, with details: ${eventDetails}`);

    const instructionsPrompt = `You are an event planning assistant. Extract and create a structured event based on the category and description provided by the user.
    Pay special attention to:
    1. Event title - create an appropriate title if none is mentioned
    2. Detailed description - expand on the provided details
    3. Location - extract any venue, address, city, and country information
    4. Date - extract or suggest a reasonable date
    5. Capacity - extract the number of attendees if mentioned, default to 50 otherwise
    6. Price - determine if the event is free or has a price based on the details
    7. Tags/categories - suggest relevant tags for the event
    
    Your response should be ONLY a JSON object with these exact fields:
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
    }`;

    // Try Deepseek first if API key is available
    if (deepseekApiKey) {
      try {
        console.log("Attempting to use Deepseek API");
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { 
                role: 'system', 
                content: instructionsPrompt
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
        
        console.log("Deepseek API response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Deepseek API error:', errorData);
          throw new Error(`Deepseek API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Deepseek response received");
        
        try {
          // Parse the JSON string from the API response
          const generatedEvent = JSON.parse(data.choices[0].message.content);
          
          // Return the parsed event data
          return new Response(
            JSON.stringify({ event: generatedEvent, source: 'deepseek' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (parseError) {
          console.error('Error parsing Deepseek response:', parseError);
          console.log('Raw content:', data.choices[0].message.content);
          throw new Error('Invalid response format from Deepseek AI');
        }
      } catch (deepseekError) {
        console.error('Error with Deepseek API, falling back to OpenAI:', deepseekError);
        // If Deepseek fails and OpenAI is available, try OpenAI next
        if (!openAIApiKey) {
          // If OpenAI is not available, fall back to basic generator
          const basicEvent = generateBasicEvent(eventCategory, eventDetails);
          return new Response(
            JSON.stringify({ 
              event: basicEvent, 
              source: 'fallback', 
              error: deepseekError.message 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Try OpenAI if Deepseek wasn't used or failed
    if (openAIApiKey) {
      try {
        console.log("Attempting to use OpenAI API");
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
                content: instructionsPrompt 
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
        
        console.log("OpenAI API response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('OpenAI API error:', errorData);
          
          // Fall back to the basic event generator
          const basicEvent = generateBasicEvent(eventCategory, eventDetails);
          return new Response(
            JSON.stringify({ 
              event: basicEvent, 
              source: 'fallback', 
              error: `OpenAI API error: ${response.status}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        console.log("OpenAI response received");
        
        try {
          // Parse the JSON string from the API response
          const generatedEvent = JSON.parse(data.choices[0].message.content);
          
          // Return the parsed event data
          return new Response(
            JSON.stringify({ event: generatedEvent, source: 'openai' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError);
          console.log('Raw content:', data.choices[0].message.content);
          
          // Fall back to the basic event generator
          const basicEvent = generateBasicEvent(eventCategory, eventDetails);
          return new Response(
            JSON.stringify({ 
              event: basicEvent, 
              source: 'fallback', 
              error: 'Invalid response format from AI',
              raw: data.choices[0].message.content 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (openAIError) {
        console.error('Error calling OpenAI API:', openAIError);
        
        // Fall back to the basic event generator
        const basicEvent = generateBasicEvent(eventCategory, eventDetails);
        return new Response(
          JSON.stringify({ event: basicEvent, source: 'fallback', error: openAIError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If we get here, we tried all available APIs and they failed
    const basicEvent = generateBasicEvent(eventCategory, eventDetails);
    return new Response(
      JSON.stringify({ event: basicEvent, source: 'fallback', error: 'All API attempts failed' }),
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
