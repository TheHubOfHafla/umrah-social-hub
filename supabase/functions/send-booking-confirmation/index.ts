
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

    console.log(`Processing booking confirmation for event "${eventTitle}" for user "${userName}" (${userEmail})`);

    // Generate a unique confirmation code
    const confirmationCode = `${eventId.substring(0, 6)}-${Date.now().toString(36)}`;
    
    // Generate QR code
    const verificationUrl = `${new URL(req.url).origin}/events/${eventId}/verify/${confirmationCode}`;
    console.log(`Generated verification URL: ${verificationUrl}`);
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl);
    
    // In a production environment, we would store booking confirmation in the database
    // and send an email to the user with the QR code
    
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
  } catch (error) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
