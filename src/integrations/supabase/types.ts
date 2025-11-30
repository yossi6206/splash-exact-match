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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          annual_revenue: number | null
          business_type: string
          category: string
          clicks_count: number | null
          contacts_count: number | null
          created_at: string
          description: string | null
          employees_count: number | null
          id: string
          images: string[] | null
          includes: string[] | null
          lease_details: string | null
          lease_expiry_date: string | null
          lease_monthly_cost: number | null
          location: string
          monthly_profit: number | null
          price: number
          reasons_for_sale: string | null
          seller_name: string | null
          seller_phone: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
          years_operating: number | null
        }
        Insert: {
          annual_revenue?: number | null
          business_type: string
          category: string
          clicks_count?: number | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          employees_count?: number | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          lease_details?: string | null
          lease_expiry_date?: string | null
          lease_monthly_cost?: number | null
          location: string
          monthly_profit?: number | null
          price: number
          reasons_for_sale?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
          years_operating?: number | null
        }
        Update: {
          annual_revenue?: number | null
          business_type?: string
          category?: string
          clicks_count?: number | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          employees_count?: number | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          lease_details?: string | null
          lease_expiry_date?: string | null
          lease_monthly_cost?: number | null
          location?: string
          monthly_profit?: number | null
          price?: number
          reasons_for_sale?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
          years_operating?: number | null
        }
        Relationships: []
      }
      cars: {
        Row: {
          category: string | null
          clicks_count: number | null
          condition: string | null
          contacts_count: number | null
          created_at: string
          description: string | null
          features: string[] | null
          fuel_type: string | null
          hand: number
          id: string
          images: string[] | null
          km: number
          location: string
          manufacturer: string | null
          model: string
          price: string | null
          seller_name: string | null
          seller_phone: string | null
          status: string
          transmission: string | null
          updated_at: string
          user_id: string
          vehicle_type: string | null
          views_count: number | null
          year: number
        }
        Insert: {
          category?: string | null
          clicks_count?: number | null
          condition?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          fuel_type?: string | null
          hand: number
          id?: string
          images?: string[] | null
          km: number
          location: string
          manufacturer?: string | null
          model: string
          price?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          transmission?: string | null
          updated_at?: string
          user_id: string
          vehicle_type?: string | null
          views_count?: number | null
          year: number
        }
        Update: {
          category?: string | null
          clicks_count?: number | null
          condition?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          fuel_type?: string | null
          hand?: number
          id?: string
          images?: string[] | null
          km?: number
          location?: string
          manufacturer?: string | null
          model?: string
          price?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          transmission?: string | null
          updated_at?: string
          user_id?: string
          vehicle_type?: string | null
          views_count?: number | null
          year?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          freelancer_id: string
          id: string
          last_message_at: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          freelancer_id: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          freelancer_id?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_cars: {
        Row: {
          car_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_cars_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      freelancer_review_helpful: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "freelancer_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_reviews: {
        Row: {
          comment: string
          communication_rating: number | null
          created_at: string
          deadline_rating: number | null
          freelancer_id: string
          helpful_count: number | null
          id: string
          professionalism_rating: number | null
          project_type: string | null
          rating: number
          reviewer_id: string
          reviewer_name: string
          title: string
          updated_at: string
          verified_client: boolean | null
          work_quality_rating: number | null
        }
        Insert: {
          comment: string
          communication_rating?: number | null
          created_at?: string
          deadline_rating?: number | null
          freelancer_id: string
          helpful_count?: number | null
          id?: string
          professionalism_rating?: number | null
          project_type?: string | null
          rating: number
          reviewer_id: string
          reviewer_name: string
          title: string
          updated_at?: string
          verified_client?: boolean | null
          work_quality_rating?: number | null
        }
        Update: {
          comment?: string
          communication_rating?: number | null
          created_at?: string
          deadline_rating?: number | null
          freelancer_id?: string
          helpful_count?: number | null
          id?: string
          professionalism_rating?: number | null
          project_type?: string | null
          rating?: number
          reviewer_id?: string
          reviewer_name?: string
          title?: string
          updated_at?: string
          verified_client?: boolean | null
          work_quality_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_reviews_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancers: {
        Row: {
          availability: string | null
          avatar_url: string | null
          bio: string | null
          category: string
          created_at: string
          experience_years: number | null
          full_name: string
          hourly_rate: number
          id: string
          languages: string[] | null
          location: string | null
          portfolio_url: string | null
          rating: number | null
          skills: string[]
          title: string
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          category: string
          created_at?: string
          experience_years?: number | null
          full_name: string
          hourly_rate: number
          id?: string
          languages?: string[] | null
          location?: string | null
          portfolio_url?: string | null
          rating?: number | null
          skills: string[]
          title: string
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          experience_years?: number | null
          full_name?: string
          hourly_rate?: number
          id?: string
          languages?: string[] | null
          location?: string | null
          portfolio_url?: string | null
          rating?: number | null
          skills?: string[]
          title?: string
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          cover_letter: string
          created_at: string
          email: string
          full_name: string
          id: string
          job_id: string
          linkedin_url: string | null
          phone: string
          portfolio_url: string | null
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          cover_letter: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_id: string
          linkedin_url?: string | null
          phone: string
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          cover_letter?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          linkedin_url?: string | null
          phone?: string
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applicants_count: number | null
          application_process: string[] | null
          benefits: string[] | null
          clicks_count: number | null
          company_name: string
          company_size: string | null
          contacts_count: number | null
          created_at: string
          description: string
          experience_max: number | null
          experience_min: number | null
          id: string
          industry: string | null
          job_type: string
          location: string
          nice_to_have: string[] | null
          requirements: string[]
          salary_max: number | null
          salary_min: number | null
          scope: string
          status: string
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          applicants_count?: number | null
          application_process?: string[] | null
          benefits?: string[] | null
          clicks_count?: number | null
          company_name: string
          company_size?: string | null
          contacts_count?: number | null
          created_at?: string
          description: string
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          industry?: string | null
          job_type: string
          location: string
          nice_to_have?: string[] | null
          requirements: string[]
          salary_max?: number | null
          salary_min?: number | null
          scope: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          applicants_count?: number | null
          application_process?: string[] | null
          benefits?: string[] | null
          clicks_count?: number | null
          company_name?: string
          company_size?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          industry?: string | null
          job_type?: string
          location?: string
          nice_to_have?: string[] | null
          requirements?: string[]
          salary_max?: number | null
          salary_min?: number | null
          scope?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      laptops: {
        Row: {
          battery: string | null
          brand: string
          clicks_count: number | null
          condition: string
          connectivity: string | null
          contacts_count: number | null
          created_at: string
          description: string | null
          features: string[] | null
          graphics_card: string | null
          id: string
          images: string[] | null
          location: string
          model: string
          operating_system: string | null
          ports: string | null
          price: number
          processor: string | null
          ram: number | null
          resolution: string | null
          screen_size: number | null
          seller_name: string | null
          seller_phone: string | null
          status: string
          storage: number | null
          storage_type: string | null
          updated_at: string
          user_id: string
          views_count: number | null
          weight: string | null
        }
        Insert: {
          battery?: string | null
          brand: string
          clicks_count?: number | null
          condition: string
          connectivity?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          graphics_card?: string | null
          id?: string
          images?: string[] | null
          location: string
          model: string
          operating_system?: string | null
          ports?: string | null
          price: number
          processor?: string | null
          ram?: number | null
          resolution?: string | null
          screen_size?: number | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          storage?: number | null
          storage_type?: string | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          weight?: string | null
        }
        Update: {
          battery?: string | null
          brand?: string
          clicks_count?: number | null
          condition?: string
          connectivity?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          graphics_card?: string | null
          id?: string
          images?: string[] | null
          location?: string
          model?: string
          operating_system?: string | null
          ports?: string | null
          price?: number
          processor?: string | null
          ram?: number | null
          resolution?: string | null
          screen_size?: number | null
          seller_name?: string | null
          seller_phone?: string | null
          status?: string
          storage?: number | null
          storage_type?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          weight?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_type: string | null
          attachment_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      online_status: {
        Row: {
          is_online: boolean | null
          last_seen: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          accessible: boolean | null
          balcony: boolean | null
          clicks_count: number | null
          condition: string | null
          contacts_count: number | null
          created_at: string
          description: string | null
          elevator: boolean | null
          features: string[] | null
          floor: number | null
          id: string
          images: string[] | null
          location: string
          parking: boolean | null
          price: number
          property_type: string
          rooms: number
          seller_name: string | null
          seller_phone: string | null
          size: number | null
          status: string
          title: string
          total_floors: number | null
          updated_at: string
          user_id: string
          views_count: number | null
          year: number | null
        }
        Insert: {
          accessible?: boolean | null
          balcony?: boolean | null
          clicks_count?: number | null
          condition?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          elevator?: boolean | null
          features?: string[] | null
          floor?: number | null
          id?: string
          images?: string[] | null
          location: string
          parking?: boolean | null
          price: number
          property_type: string
          rooms: number
          seller_name?: string | null
          seller_phone?: string | null
          size?: number | null
          status?: string
          title: string
          total_floors?: number | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          year?: number | null
        }
        Update: {
          accessible?: boolean | null
          balcony?: boolean | null
          clicks_count?: number | null
          condition?: string | null
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          elevator?: boolean | null
          features?: string[] | null
          floor?: number | null
          id?: string
          images?: string[] | null
          location?: string
          parking?: boolean | null
          price?: number
          property_type?: string
          rooms?: number
          seller_name?: string | null
          seller_phone?: string | null
          size?: number | null
          status?: string
          title?: string
          total_floors?: number | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          year?: number | null
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          helpful_count: number | null
          id: string
          item_id: string
          item_type: string
          rating: number
          title: string
          updated_at: string
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          item_id: string
          item_type: string
          rating: number
          title: string
          updated_at?: string
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          item_id?: string
          item_type?: string
          rating?: number
          title?: string
          updated_at?: string
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: []
      }
      secondhand_items: {
        Row: {
          age: string | null
          brand: string | null
          category: string
          clicks_count: number | null
          color: string | null
          condition: string
          contacts_count: number | null
          created_at: string
          delivery_available: boolean | null
          description: string | null
          dimensions: string | null
          features: string[] | null
          id: string
          images: string[] | null
          location: string
          material: string | null
          negotiable: boolean | null
          price: number
          seller_name: string | null
          seller_phone: string | null
          size: string | null
          status: string
          subcategory: string | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
          warranty: string | null
          weight: string | null
          year_manufactured: number | null
        }
        Insert: {
          age?: string | null
          brand?: string | null
          category: string
          clicks_count?: number | null
          color?: string | null
          condition: string
          contacts_count?: number | null
          created_at?: string
          delivery_available?: boolean | null
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          location: string
          material?: string | null
          negotiable?: boolean | null
          price: number
          seller_name?: string | null
          seller_phone?: string | null
          size?: string | null
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
          warranty?: string | null
          weight?: string | null
          year_manufactured?: number | null
        }
        Update: {
          age?: string | null
          brand?: string | null
          category?: string
          clicks_count?: number | null
          color?: string | null
          condition?: string
          contacts_count?: number | null
          created_at?: string
          delivery_available?: boolean | null
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          location?: string
          material?: string | null
          negotiable?: boolean | null
          price?: number
          seller_name?: string | null
          seller_phone?: string | null
          size?: string | null
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
          warranty?: string | null
          weight?: string | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      seller_reviews: {
        Row: {
          accuracy_rating: number | null
          comment: string
          communication_rating: number | null
          created_at: string
          id: string
          rating: number
          reviewer_id: string
          seller_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          accuracy_rating?: number | null
          comment: string
          communication_rating?: number | null
          created_at?: string
          id?: string
          rating: number
          reviewer_id: string
          seller_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          accuracy_rating?: number | null
          comment?: string
          communication_rating?: number | null
          created_at?: string
          id?: string
          rating?: number
          reviewer_id?: string
          seller_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tip_comments: {
        Row: {
          comment: string
          created_at: string
          helpful_count: number | null
          id: string
          tip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          tip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          tip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
