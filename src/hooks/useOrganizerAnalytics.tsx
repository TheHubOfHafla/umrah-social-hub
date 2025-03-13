
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export type AnalyticsData = {
  events: any[];
  metrics: any[];
  ticketSales: any[];
  engagement: any[];
  recommendations: any[];
  isLoading: boolean;
  error: Error | null;
};

export const useOrganizerAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    events: [],
    metrics: [],
    ticketSales: [],
    engagement: [],
    recommendations: [],
    isLoading: true,
    error: null
  });

  const fetchAnalytics = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('No active session found. Please log in.');
      }
      
      // Get the access token
      const accessToken = sessionData.session.access_token;
      
      // Get the current Supabase URL
      const supabaseUrl = supabase.supabaseUrl;
      
      // Fetch data from the edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/get-organizer-analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function response error:', errorText);
        throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
      }
      
      const analyticsData = await response.json();
      console.log('Received analytics data:', analyticsData);
      
      setData({
        events: analyticsData.events || [],
        metrics: analyticsData.metrics || [],
        ticketSales: analyticsData.ticketSales || [],
        engagement: analyticsData.engagement || [],
        recommendations: analyticsData.recommendations || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching organizer analytics:', error);
      setData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }));
      toast({
        title: "Error fetching analytics",
        description: error instanceof Error ? error.message : "Failed to load analytics data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    ...data,
    refetch: fetchAnalytics
  };
};
