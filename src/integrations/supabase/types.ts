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
      admin_workout_plans: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          exercises: Json
          id: string
          name: string
          target_muscle_groups: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          exercises: Json
          id?: string
          name: string
          target_muscle_groups?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          exercises?: Json
          id?: string
          name?: string
          target_muscle_groups?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      bmi_calculations: {
        Row: {
          bmi_category: string
          bmi_value: number
          calculated_at: string
          height: number
          id: string
          user_id: string
          weight: number
        }
        Insert: {
          bmi_category: string
          bmi_value: number
          calculated_at?: string
          height: number
          id?: string
          user_id: string
          weight: number
        }
        Update: {
          bmi_category?: string
          bmi_value?: number
          calculated_at?: string
          height?: number
          id?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      gym_attendance: {
        Row: {
          attendance_date: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          id: string
          user_id: string
          workout_session_id: string | null
        }
        Insert: {
          attendance_date: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          user_id: string
          workout_session_id?: string | null
        }
        Update: {
          attendance_date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          user_id?: string
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gym_attendance_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          gym_membership_end: string | null
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          gym_membership_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          gym_membership_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_access_control: {
        Row: {
          access_granted_at: string | null
          access_granted_by: string | null
          access_revoked_at: string | null
          created_at: string
          google_docs_file_id: string | null
          has_site_access: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_granted_at?: string | null
          access_granted_by?: string | null
          access_revoked_at?: string | null
          created_at?: string
          google_docs_file_id?: string | null
          has_site_access?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_granted_at?: string | null
          access_granted_by?: string | null
          access_revoked_at?: string | null
          created_at?: string
          google_docs_file_id?: string | null
          has_site_access?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string
          fitness_goal: string | null
          gender: string | null
          height: number | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          fitness_goal?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          fitness_goal?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_workout_assignments: {
        Row: {
          assigned_at: string
          completed_at: string | null
          id: string
          is_active: boolean | null
          user_id: string
          workout_plan_id: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id: string
          workout_plan_id: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workout_assignments_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          log_type: string | null
          user_id: string
          weight: number
          workout_session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          log_type?: string | null
          user_id: string
          weight: number
          workout_session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          log_type?: string | null
          user_id?: string
          weight?: number
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weight_logs_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plan_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          assigned_to_user: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          updated_at: string
          workout_plan_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          assigned_to_user: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          workout_plan_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          assigned_to_user?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_assignments_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "admin_workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number | null
          exercises: Json
          fitness_goal: string | null
          id: string
          level: number | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          exercises: Json
          fitness_goal?: string | null
          id?: string
          level?: number | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          exercises?: Json
          fitness_goal?: string | null
          id?: string
          level?: number | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          muscles_trained: string[]
          notes: string | null
          post_workout_weight: number | null
          pre_workout_weight: number | null
          updated_at: string
          user_id: string
          workout_date: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          muscles_trained: string[]
          notes?: string | null
          post_workout_weight?: number | null
          pre_workout_weight?: number | null
          updated_at?: string
          user_id: string
          workout_date: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          muscles_trained?: string[]
          notes?: string | null
          post_workout_weight?: number | null
          pre_workout_weight?: number | null
          updated_at?: string
          user_id?: string
          workout_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      debug_user_role: {
        Args: { user_email: string }
        Returns: {
          user_id: string
          email: string
          role: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_role_safe: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_workout_stats: {
        Args: { p_user_id: string; p_start_date: string; p_end_date: string }
        Returns: {
          total_workouts: number
          total_gym_days: number
          weight_change: number
          avg_workout_duration: number
        }[]
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_admin_or_trainer: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      user_has_site_access: {
        Args: { user_id: string }
        Returns: boolean
      }
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
