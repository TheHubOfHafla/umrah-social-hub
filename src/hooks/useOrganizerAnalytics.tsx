
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export type AnalyticsData = {
  events: any[];
  metrics: any[];
  ticketSales: any[];
  engagement: any[];
  recommendations: any[];
  isLoading: boolean;
  error: Error | null;
};

// Mock data to use when fetch fails
const mockAnalyticsData = {
  events: [
    { 
      id: '1', 
      title: 'Annual Music Festival', 
      date: '2025-05-15', 
      tickets_remaining: 35,
      estimated_sellout_days: 20
    },
    { 
      id: '2', 
      title: 'Tech Conference 2025', 
      date: '2025-06-10', 
      tickets_remaining: 50,
      estimated_sellout_days: 45
    },
    { 
      id: '3', 
      title: 'Summer Art Exhibition', 
      date: '2025-07-20', 
      tickets_remaining: 15,
      estimated_sellout_days: 10
    }
  ],
  metrics: [
    { 
      event_id: '1', 
      views_count: 1250, 
      clicks_count: 520, 
      conversion_rate: 12.5 
    },
    { 
      event_id: '2', 
      views_count: 980, 
      clicks_count: 356, 
      conversion_rate: 8.7 
    },
    { 
      event_id: '3', 
      views_count: 750, 
      clicks_count: 280, 
      conversion_rate: 14.2 
    }
  ],
  ticketSales: [
    { 
      event_id: '1', 
      sale_date: '2025-03-10', 
      tickets_sold: 25, 
      revenue: 1250 
    },
    { 
      event_id: '1', 
      sale_date: '2025-03-11', 
      tickets_sold: 18, 
      revenue: 900 
    },
    { 
      event_id: '2', 
      sale_date: '2025-03-10', 
      tickets_sold: 15, 
      revenue: 750 
    },
    { 
      event_id: '3', 
      sale_date: '2025-03-12', 
      tickets_sold: 30, 
      revenue: 1500 
    }
  ],
  engagement: [
    { 
      organizer_id: '1', 
      engagement_type: 'view_profile', 
      count: 350 
    },
    { 
      organizer_id: '1', 
      engagement_type: 'click_event', 
      count: 180 
    }
  ],
  recommendations: [
    {
      type: 'social_media',
      message: 'Post more organic leads through Instagram and TikTok, and link it with HaflaHub for increased visibility.'
    },
    {
      type: 'premium_features',
      message: 'Upgrade to a premium package for increased event visibility and automated email marketing to potential buyers.'
    }
  ]
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
      
      // Use the hardcoded URL since we can't access the protected supabaseUrl property
      const supabaseUrl = 'https://annunwfjlsgrrcqfkykd.supabase.co';
      const functionUrl = `${supabaseUrl}/functions/v1/get-organizer-analytics`;
      
      console.log('Fetching analytics from:', functionUrl);
      
      // Add a timeout to the fetch operation
      const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(id);
          return response;
        } catch (error) {
          clearTimeout(id);
          throw error;
        }
      };
      
      // Fetch data from the edge function with timeout
      const response = await fetchWithTimeout(functionUrl, {
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
      
      // If there's an error, use the mock data
      toast({
        title: "Using demo data",
        description: "We couldn't connect to the server, so we're displaying example data.",
        variant: "default"
      });
      
      setData({
        events: mockAnalyticsData.events,
        metrics: mockAnalyticsData.metrics,
        ticketSales: mockAnalyticsData.ticketSales,
        engagement: mockAnalyticsData.engagement,
        recommendations: mockAnalyticsData.recommendations,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
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
