export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendees: {
        Row: {
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          purchase_date: string
          ticket_type_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          purchase_date?: string
          ticket_type_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          purchase_date?: string
          ticket_type_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          event_id: string
          id: string
          is_organizer: boolean | null
          is_pinned: boolean | null
          is_private: boolean | null
          message_type: string | null
          parent_id: string | null
          recipient_id: string | null
          timestamp: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          event_id: string
          id?: string
          is_organizer?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          message_type?: string | null
          parent_id?: string | null
          recipient_id?: string | null
          timestamp?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          event_id?: string
          id?: string
          is_organizer?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          message_type?: string | null
          parent_id?: string | null
          recipient_id?: string | null
          timestamp?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      event_confirmations: {
        Row: {
          confirmation_code: string
          created_at: string | null
          email_sent: boolean | null
          event_id: string
          id: string
          qr_code_url: string | null
          status: string | null
          ticket_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confirmation_code: string
          created_at?: string | null
          email_sent?: boolean | null
          event_id: string
          id?: string
          qr_code_url?: string | null
          status?: string | null
          ticket_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confirmation_code?: string
          created_at?: string | null
          email_sent?: boolean | null
          event_id?: string
          id?: string
          qr_code_url?: string | null
          status?: string | null
          ticket_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_metrics: {
        Row: {
          clicks_count: number | null
          conversion_rate: number | null
          created_at: string | null
          event_id: string | null
          id: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          clicks_count?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          clicks_count?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_metrics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendee_type: string | null
          base_price: number | null
          capacity: number | null
          categories: string[]
          created_at: string
          description: string
          end_date: string | null
          estimated_sellout_days: number | null
          featured: boolean | null
          id: string
          image: string | null
          is_free: boolean | null
          location_address: string | null
          location_city: string | null
          location_country: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          organizer_id: string
          short_description: string | null
          start_date: string
          tickets_remaining: number | null
          title: string
          updated_at: string
        }
        Insert: {
          attendee_type?: string | null
          base_price?: number | null
          capacity?: number | null
          categories: string[]
          created_at?: string
          description: string
          end_date?: string | null
          estimated_sellout_days?: number | null
          featured?: boolean | null
          id?: string
          image?: string | null
          is_free?: boolean | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          organizer_id: string
          short_description?: string | null
          start_date: string
          tickets_remaining?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          attendee_type?: string | null
          base_price?: number | null
          capacity?: number | null
          categories?: string[]
          created_at?: string
          description?: string
          end_date?: string | null
          estimated_sellout_days?: number | null
          featured?: boolean | null
          id?: string
          image?: string | null
          is_free?: boolean | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          organizer_id?: string
          short_description?: string | null
          start_date?: string
          tickets_remaining?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      organizers: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          organization_type: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          organization_type?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_type?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          events_attending: string[] | null
          following: string[] | null
          id: string
          interests: string[] | null
          name: string | null
          phone: string | null
          saved_events: string[] | null
          signup_date: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          events_attending?: string[] | null
          following?: string[] | null
          id: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          saved_events?: string[] | null
          signup_date?: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          events_attending?: string[] | null
          following?: string[] | null
          id?: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          saved_events?: string[] | null
          signup_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_sales_daily: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          revenue: number | null
          sale_date: string
          tickets_sold: number | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          revenue?: number | null
          sale_date: string
          tickets_sold?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          revenue?: number | null
          sale_date?: string
          tickets_sold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sales_daily_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          available: boolean | null
          created_at: string
          description: string | null
          event_id: string
          id: string
          name: string
          price: number
          quantity: number
          sold: number | null
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          price: number
          quantity: number
          sold?: number | null
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
          sold?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_engagement: {
        Row: {
          created_at: string | null
          engagement_type: string
          event_id: string | null
          id: string
          organizer_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          engagement_type: string
          event_id?: string | null
          id?: string
          organizer_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          engagement_type?: string
          event_id?: string | null
          id?: string
          organizer_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_engagement_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_engagement_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
