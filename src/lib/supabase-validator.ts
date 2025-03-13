
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';

// Function to validate Supabase across various functionalities
export const validateSupabaseIntegrations = async () => {
  const results = {
    connectionStatus: false,
    auth: false,
    profiles: false,
    events: false,
  };

  // Check basic connection
  results.connectionStatus = await checkSupabaseConnection();
  
  // Check auth functionality
  try {
    const { data: session } = await supabase.auth.getSession();
    results.auth = true;
    console.log('Auth integration validated');
  } catch (error) {
    console.error('Auth integration check failed:', error);
  }
  
  // Check profiles table access
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (!error) {
      results.profiles = true;
      console.log('Profiles integration validated');
    } else {
      console.error('Profiles integration check failed:', error);
    }
  } catch (error) {
    console.error('Profiles check error:', error);
  }
  
  // Check events table access
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    if (!error) {
      results.events = true;
      console.log('Events integration validated');
    } else {
      console.error('Events integration check failed:', error);
    }
  } catch (error) {
    console.error('Events check error:', error);
  }
  
  return results;
};

// Function to validate a specific table integration with type safety
export const validateTableIntegration = async (
  tableName: 'attendees' | 'events' | 'ticket_types' | 'chat_messages' | 
            'event_confirmations' | 'event_metrics' | 'organizers' | 
            'profiles' | 'ticket_sales_daily' | 'user_engagement'
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from(tableName).select('id').limit(1);
    if (error) {
      console.error(`${tableName} integration check failed:`, error);
      return false;
    }
    console.log(`${tableName} integration validated`);
    return true;
  } catch (error) {
    console.error(`${tableName} check error:`, error);
    return false;
  }
};
