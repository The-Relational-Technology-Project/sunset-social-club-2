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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      community_insights: {
        Row: {
          created_at: string
          id: string
          markdown: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          markdown?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          markdown?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_signups: {
        Row: {
          created_at: string
          cross_streets: string | null
          email: string
          first_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          cross_streets?: string | null
          email: string
          first_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          cross_streets?: string | null
          email?: string
          first_name?: string | null
          id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_markdown: string
          created_at: string
          cta_label: string | null
          cta_url: string | null
          heading: string
          id: string
          slug: string
          subject: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body_markdown: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          heading: string
          id?: string
          slug: string
          subject: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body_markdown?: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          heading?: string
          id?: string
          slug?: string
          subject?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      event_feedback: {
        Row: {
          answers: Json
          created_at: string
          form_slug: string
          id: string
          member_email: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          form_slug: string
          id?: string
          member_email?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          form_slug?: string
          id?: string
          member_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_feedback_forms: {
        Row: {
          created_at: string
          id: string
          intro: string
          questions: Json
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          intro?: string
          questions?: Json
          slug: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          intro?: string
          questions?: Json
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          created_at: string
          id: string
          idea: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          idea?: string
          name?: string
        }
        Relationships: []
      }
      jukebox_settings: {
        Row: {
          current_event_label: string | null
          id: number
          submissions_open: boolean
          updated_at: string
        }
        Insert: {
          current_event_label?: string | null
          id?: number
          submissions_open?: boolean
          updated_at?: string
        }
        Update: {
          current_event_label?: string | null
          id?: number
          submissions_open?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      jukebox_submissions: {
        Row: {
          added_to_playlist_at: string | null
          album_art_url: string | null
          approve_error: string | null
          approved_at: string | null
          artist_name: string
          created_at: string
          duration_ms: number | null
          id: string
          requester_name: string
          spotify_playlist_snapshot_id: string | null
          spotify_track_id: string
          spotify_uri: string
          status: string
          submitter_fingerprint: string | null
          track_name: string
          updated_at: string
        }
        Insert: {
          added_to_playlist_at?: string | null
          album_art_url?: string | null
          approve_error?: string | null
          approved_at?: string | null
          artist_name: string
          created_at?: string
          duration_ms?: number | null
          id?: string
          requester_name: string
          spotify_playlist_snapshot_id?: string | null
          spotify_track_id: string
          spotify_uri: string
          status?: string
          submitter_fingerprint?: string | null
          track_name: string
          updated_at?: string
        }
        Update: {
          added_to_playlist_at?: string | null
          album_art_url?: string | null
          approve_error?: string | null
          approved_at?: string | null
          artist_name?: string
          created_at?: string
          duration_ms?: number | null
          id?: string
          requester_name?: string
          spotify_playlist_snapshot_id?: string | null
          spotify_track_id?: string
          spotify_uri?: string
          status?: string
          submitter_fingerprint?: string | null
          track_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          approved: boolean
          caption: string | null
          created_at: string
          id: string
          instagram_ok: boolean
          storage_path: string
          uploaded_by_email: string | null
          user_id: string
        }
        Insert: {
          approved?: boolean
          caption?: string | null
          created_at?: string
          id?: string
          instagram_ok?: boolean
          storage_path: string
          uploaded_by_email?: string | null
          user_id: string
        }
        Update: {
          approved?: boolean
          caption?: string | null
          created_at?: string
          id?: string
          instagram_ok?: boolean
          storage_path?: string
          uploaded_by_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      potluck_signups: {
        Row: {
          bringing: string
          created_at: string
          id: string
          ip_hash: string | null
          name: string
        }
        Insert: {
          bringing: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          name: string
        }
        Update: {
          bringing?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          name?: string
        }
        Relationships: []
      }
      quick_event_feedback: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          met_neighbor: boolean
          summarized_at: string | null
          would_recommend: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          met_neighbor: boolean
          summarized_at?: string | null
          would_recommend: boolean
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          met_neighbor?: boolean
          summarized_at?: string | null
          would_recommend?: boolean
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_club_member: { Args: never; Returns: boolean }
      is_current_user_member: { Args: never; Returns: boolean }
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
