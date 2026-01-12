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
          address: string | null
          city: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_claimed: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          leads_remaining: number | null
          logo_url: string | null
          name: string
          ofsted_rating: string | null
          ofsted_report_url: string | null
          phone: string | null
          postcode: string | null
          rating: number | null
          review_count: number | null
          service_areas: Json | null
          services: Json | null
          slug: string
          specializations: Json | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_claimed?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          leads_remaining?: number | null
          logo_url?: string | null
          name: string
          ofsted_rating?: string | null
          ofsted_report_url?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          review_count?: number | null
          service_areas?: Json | null
          services?: Json | null
          slug: string
          specializations?: Json | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_claimed?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          leads_remaining?: number | null
          logo_url?: string | null
          name?: string
          ofsted_rating?: string | null
          ofsted_report_url?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          review_count?: number | null
          service_areas?: Json | null
          services?: Json | null
          slug?: string
          specializations?: Json | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      agency_locations: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          location_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          location_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
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
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          content: string | null
          content_json: Json | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          page_key: string
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_json?: Json | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          page_key: string
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_json?: Json | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          page_key?: string
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          location_id: string | null
          page_key: string | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          page_key?: string | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          page_key?: string | null
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          accommodation_type: string | null
          created_at: string
          email: string
          first_name: string
          fostering_interest: string | null
          has_children: boolean | null
          has_pets: boolean | null
          id: string
          is_viewed: boolean | null
          last_name: string
          message: string | null
          phone: string | null
          postcode: string | null
          preferred_age_group: string | null
          source_agency_id: string | null
          source_location_id: string | null
          source_type: string | null
          status: string | null
          updated_at: string
          viewed_at: string | null
          viewed_by: string | null
        }
        Insert: {
          accommodation_type?: string | null
          created_at?: string
          email: string
          first_name: string
          fostering_interest?: string | null
          has_children?: boolean | null
          has_pets?: boolean | null
          id?: string
          is_viewed?: boolean | null
          last_name: string
          message?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_age_group?: string | null
          source_agency_id?: string | null
          source_location_id?: string | null
          source_type?: string | null
          status?: string | null
          updated_at?: string
          viewed_at?: string | null
          viewed_by?: string | null
        }
        Update: {
          accommodation_type?: string | null
          created_at?: string
          email?: string
          first_name?: string
          fostering_interest?: string | null
          has_children?: boolean | null
          has_pets?: boolean | null
          id?: string
          is_viewed?: boolean | null
          last_name?: string
          message?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_age_group?: string | null
          source_agency_id?: string | null
          source_location_id?: string | null
          source_type?: string | null
          status?: string | null
          updated_at?: string
          viewed_at?: string | null
          viewed_by?: string | null
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
      legal_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          agency_count: number | null
          created_at: string
          description: string | null
          faq_content: Json | null
          hero_content: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          type: string
          updated_at: string
        }
        Insert: {
          agency_count?: number | null
          created_at?: string
          description?: string | null
          faq_content?: Json | null
          hero_content?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          type: string
          updated_at?: string
        }
        Update: {
          agency_count?: number | null
          created_at?: string
          description?: string | null
          faq_content?: Json | null
          hero_content?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          type?: string
          updated_at?: string
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
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_response: string | null
          agency_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          agency_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating: number
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          agency_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      owns_agency: {
        Args: { _agency_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "agency" | "foster_parent" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "agency", "foster_parent", "user"],
    },
  },
} as const
