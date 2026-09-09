// Hand-written to match supabase/migrations/0001_init.sql.
// Once the Supabase CLI is linked to the project, replace this file with the
// generated one: `supabase gen types typescript --linked > src/lib/database.types.ts`

export type ContentType = 'Attraction' | 'Destination' | 'Event' | 'Accommodation' | 'Tour' | 'Experience'
export type ContentStatus = 'Draft' | 'Pending Approval' | 'Published' | 'Archived' | 'Inactive'
export type UserRole = 'Visitor' | 'NTG Staff' | 'Administrator'
export type AccountStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number
          auth_user_id: string | null
          full_name: string
          email: string
          password_hash: string | null
          role: UserRole
          account_status: AccountStatus
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['users']['Row']> & { full_name: string; email: string }
        Update: Partial<Database['public']['Tables']['users']['Row']>
        Relationships: []
      }
      user_preferences: {
        Row: {
          preference_id: number
          user_id: number
          travel_interest: string | null
          preferred_activity: string | null
          preferred_region: string | null
        }
        Insert: Partial<Database['public']['Tables']['user_preferences']['Row']> & { user_id: number }
        Update: Partial<Database['public']['Tables']['user_preferences']['Row']>
        Relationships: []
      }
      tourism_content: {
        Row: {
          content_id: number
          title: string
          content_type: ContentType
          description: string | null
          location: string | null
          category: string | null
          status: ContentStatus
          image_url: string | null
          event_datetime: string | null
          updated_by: number | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tourism_content']['Row']> & {
          title: string
          content_type: ContentType
        }
        Update: Partial<Database['public']['Tables']['tourism_content']['Row']>
        Relationships: []
      }
      trips: {
        Row: {
          trip_id: number
          user_id: number
          trip_name: string
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['trips']['Row']> & { user_id: number; trip_name: string }
        Update: Partial<Database['public']['Tables']['trips']['Row']>
        Relationships: []
      }
      trip_items: {
        Row: {
          trip_item_id: number
          trip_id: number
          content_id: number
          planned_date: string | null
        }
        Insert: Partial<Database['public']['Tables']['trip_items']['Row']> & { trip_id: number; content_id: number }
        Update: Partial<Database['public']['Tables']['trip_items']['Row']>
        Relationships: []
      }
      saved_items: {
        Row: {
          saved_item_id: number
          user_id: number
          content_id: number
          saved_at: string
        }
        Insert: Partial<Database['public']['Tables']['saved_items']['Row']> & { user_id: number; content_id: number }
        Update: Partial<Database['public']['Tables']['saved_items']['Row']>
        Relationships: []
      }
      recommendations: {
        Row: {
          recommendation_id: number
          user_id: number
          content_id: number
          recommendation_reason: string | null
          recommendation_score: number | null
          generated_at: string
        }
        Insert: Partial<Database['public']['Tables']['recommendations']['Row']> & {
          user_id: number
          content_id: number
        }
        Update: Partial<Database['public']['Tables']['recommendations']['Row']>
        Relationships: []
      }
      external_data: {
        Row: {
          external_data_id: number
          content_id: number
          source_type: string | null
          source_name: string | null
          data_value: string | null
          retrieved_at: string
        }
        Insert: Partial<Database['public']['Tables']['external_data']['Row']> & { content_id: number }
        Update: Partial<Database['public']['Tables']['external_data']['Row']>
        Relationships: []
      }
      notifications: {
        Row: {
          notification_id: number
          user_id: number
          notification_type: string | null
          message: string | null
          is_read: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & { user_id: number }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
