
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
    
    // Check for required fields
    if (!eventId || !userId || !userEmail || !eventTitle) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing booking confirmation for event "${eventTitle}" for user "${userName}" (${userEmail})`);
    console.log(`Event ID: ${eventId}, User ID: ${userId}`);

    // Generate a more robust confirmation code
    const confirmationCode = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Generate QR code with proper URL
    const requestUrl = new URL(req.url);
    // Use the original eventId for the verification URL, whether it's a UUID or not
    const verificationUrl = `${requestUrl.origin}/events/${eventId}/verify/${confirmationCode}`;
    console.log(`Generated verification URL: ${verificationUrl}`);
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl);
      
      console.log(`Booking confirmation processed successfully for ${userName} (${userEmail}) for event ${eventTitle}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Booking confirmation created successfully',
          confirmationCode,
          qrCodeUrl: qrCodeDataURL
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate QR code', details: qrError instanceof Error ? qrError.message : String(qrError) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
