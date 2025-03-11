
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import QRCode from "https://esm.sh/qrcode@1.5.1";

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
    const { eventId, userId, userName, userEmail, eventTitle, eventDate, eventLocation, ticketType } = await req.json();
    
    if (!eventId || !userId || !userEmail || !eventTitle) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a unique confirmation code
    const confirmationCode = `${eventId.substring(0, 6)}-${Date.now().toString(36)}`;
    
    // Generate QR code
    const verificationUrl = `${new URL(req.url).origin}/events/${eventId}/verify/${confirmationCode}`;
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl);
    
    // Store booking confirmation in the database
    const supabaseAdminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    
    // We need to use the service role key to insert data on behalf of the user
    const supabase = createClient(supabaseUrl, supabaseAdminKey);
    
    const { data, error } = await supabase
      .from('event_confirmations')
      .insert({
        user_id: userId,
        event_id: eventId,
        confirmation_code: confirmationCode,
        qr_code_url: qrCodeDataURL,
        ticket_type: ticketType,
        email_sent: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error storing confirmation in database:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to store booking confirmation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, we would send an email with the QR code
    // For now, we'll simulate that by returning success with the QR code data
    console.log(`Booking confirmation for user ${userName} (${userEmail}) for event ${eventTitle}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking confirmation created successfully',
        confirmationCode,
        qrCodeUrl: qrCodeDataURL
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to create Supabase client
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      insert: (data) => ({
        select: () => ({
          single: async () => {
            try {
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify(data),
              });
              
              if (!response.ok) {
                throw new Error(`Supabase error: ${response.status}`);
              }
              
              const responseData = await response.json();
              return { data: responseData[0], error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        })
      })
    })
  };
}
