
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const apiKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('OPENAI_API_KEY');

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
    const { message, context, history } = await req.json();

    // First try DeepSeek if API key is available
    let response;
    try {
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: `You are a helpful assistant for the HaflaHub application. You have access to information about the entire application structure to help users navigate and use features effectively.

The application has the following main pages and features:
- Home page: Features trending and upcoming events
- Events page: Browse and filter events by category
- Event Details: View event information, register to attend
- User Dashboard: View your upcoming events and profile
- Create Event: Form to create a new event
- Organizer Dashboard: For event creators to manage their events

${context}`
            },
            ...history,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
    } catch (error) {
      console.error('DeepSeek API error, falling back to OpenAI:', error);
      
      // Fall back to OpenAI if DeepSeek fails
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: `You are a helpful assistant for the HaflaHub application. You have access to information about the entire application structure to help users navigate and use features effectively.

The application has the following main pages and features:
- Home page: Features trending and upcoming events
- Events page: Browse and filter events by category
- Event Details: View event information, register to attend
- User Dashboard: View your upcoming events and profile
- Create Event: Form to create a new event
- Organizer Dashboard: For event creators to manage their events

${context}`
            },
            ...history,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      message: aiMessage,
      source: response.url.includes('deepseek') ? 'deepseek' : 'openai'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deepseek-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm sorry, I'm having trouble responding right now. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
