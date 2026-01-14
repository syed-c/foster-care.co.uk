export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          acceptance_types: string[] | null
          address: string | null
          agency_type: string | null
          allowance_guidance: Json | null
          city: string | null
          claim_status: string | null
          claimed_at: string | null
          complex_needs_support: boolean | null
          county: string | null
          cover_image_url: string | null
          created_at: string | null
          data_source: string | null
          description: string | null
          email: string | null
          field_sources: Json | null
          gmb_last_sync: string | null
          gmb_place_id: string | null
          gmb_sync_status: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          logo_url: string | null
          name: string
          ofsted_last_inspection: string | null
          ofsted_rating: string | null
          ofsted_urn: string | null
          phone: string | null
          postcode: string | null
          rating: number | null
          response_time_hours: number | null
          review_count: number | null
          short_description: string | null
          slug: string
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          acceptance_types?: string[] | null
          address?: string | null
          agency_type?: string | null
          allowance_guidance?: Json | null
          city?: string | null
          claim_status?: string | null
          claimed_at?: string | null
          complex_needs_support?: boolean | null
          county?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          field_sources?: Json | null
          gmb_last_sync?: string | null
          gmb_place_id?: string | null
          gmb_sync_status?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          name: string
          ofsted_last_inspection?: string | null
          ofsted_rating?: string | null
          ofsted_urn?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          acceptance_types?: string[] | null
          address?: string | null
          agency_type?: string | null
          allowance_guidance?: Json | null
          city?: string | null
          claim_status?: string | null
          claimed_at?: string | null
          complex_needs_support?: boolean | null
          county?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          field_sources?: Json | null
          gmb_last_sync?: string | null
          gmb_place_id?: string | null
          gmb_sync_status?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          name?: string
          ofsted_last_inspection?: string | null
          ofsted_rating?: string | null
          ofsted_urn?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      agency_documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_template: boolean | null
          name: string
          updated_at: string | null
          uploaded_by: string | null
          workspace_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_template?: boolean | null
          name: string
          updated_at?: string | null
          uploaded_by?: string | null
          workspace_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_template?: boolean | null
          name?: string
          updated_at?: string | null
          uploaded_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "agency_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_locations: {
        Row: {
          agency_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          location_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          location_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_locations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_specialisms: {
        Row: {
          agency_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          specialism_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          specialism_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          specialism_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_specialisms_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_specialisms_specialism_id_fkey"
            columns: ["specialism_id"]
            isOneToOne: false
            referencedRelation: "specialisms"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: string | null
          reminder_at: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          reminder_at?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          reminder_at?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "agency_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_team_members: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          permissions: Json | null
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          permissions?: Json | null
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_team_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "agency_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_workspaces: {
        Row: {
          agency_id: string
          created_at: string | null
          id: string
          name: string
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string | null
          id?: string
          name: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          id?: string
          name?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_workspaces_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          page_key: string
          section: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          page_key: string
          section: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          page_key?: string
          section?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          agency_id: string | null
          answer: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          location_id: string | null
          page_key: string | null
          question: string
          scope: string | null
          specialism_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          answer: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          page_key?: string | null
          question: string
          scope?: string | null
          specialism_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          answer?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          page_key?: string | null
          question?: string
          scope?: string | null
          specialism_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_specialism_id_fkey"
            columns: ["specialism_id"]
            isOneToOne: false
            referencedRelation: "specialisms"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          converted_at: string | null
          created_at: string | null
          email: string
          first_name: string
          fostering_interest: string[] | null
          id: string
          is_viewed: boolean | null
          last_name: string | null
          marketing_consent: boolean | null
          message: string | null
          notes: Json | null
          phone: string | null
          postcode: string | null
          preferred_contact: string | null
          privacy_accepted: boolean | null
          responded_at: string | null
          source_agency_id: string | null
          source_location_id: string | null
          source_page: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          converted_at?: string | null
          created_at?: string | null
          email: string
          first_name: string
          fostering_interest?: string[] | null
          id?: string
          is_viewed?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          message?: string | null
          notes?: Json | null
          phone?: string | null
          postcode?: string | null
          preferred_contact?: string | null
          privacy_accepted?: boolean | null
          responded_at?: string | null
          source_agency_id?: string | null
          source_location_id?: string | null
          source_page?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          converted_at?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          fostering_interest?: string[] | null
          id?: string
          is_viewed?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          message?: string | null
          notes?: Json | null
          phone?: string | null
          postcode?: string | null
          preferred_contact?: string | null
          privacy_accepted?: boolean | null
          responded_at?: string | null
          source_agency_id?: string | null
          source_location_id?: string | null
          source_page?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_source_agency_id_fkey"
            columns: ["source_agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_source_location_id_fkey"
            columns: ["source_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          agency_count: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          parent_id: string | null
          population: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          type: string
          updated_at: string | null
        }
        Insert: {
          agency_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          parent_id?: string | null
          population?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          type: string
          updated_at?: string | null
        }
        Update: {
          agency_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          parent_id?: string | null
          population?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string | null
          from_path: string
          id: string
          is_active: boolean | null
          redirect_type: number | null
          to_path: string
        }
        Insert: {
          created_at?: string | null
          from_path: string
          id?: string
          is_active?: boolean | null
          redirect_type?: number | null
          to_path: string
        }
        Update: {
          created_at?: string | null
          from_path?: string
          id?: string
          is_active?: boolean | null
          redirect_type?: number | null
          to_path?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_response: string | null
          admin_response_at: string | null
          agency_id: string
          author_email: string | null
          author_name: string
          author_user_id: string | null
          content: string
          created_at: string | null
          external_id: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          rating: number
          source: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          admin_response_at?: string | null
          agency_id: string
          author_email?: string | null
          author_name: string
          author_user_id?: string | null
          content: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          rating: number
          source?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          admin_response_at?: string | null
          agency_id?: string
          author_email?: string | null
          author_name?: string
          author_user_id?: string | null
          content?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          rating?: number
          source?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          category: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      specialisms: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_agency_team_member: { Args: { agency_uuid: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
