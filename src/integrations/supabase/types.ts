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
      events: {
        Row: {
          attendee_type: string | null
          base_price: number | null
          capacity: number | null
          categories: string[]
          created_at: string
          description: string
          end_date: string | null
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
          signup_date?: string
          updated_at?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
