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
      budget_items: {
        Row: {
          budget_amount: number
          category_id: string
          created_at: string | null
          id: string
          period: Database["public"]["Enums"]["budget_period"]
          updated_at: string | null
        }
        Insert: {
          budget_amount: number
          category_id: string
          created_at?: string | null
          id?: string
          period?: Database["public"]["Enums"]["budget_period"]
          updated_at?: string | null
        }
        Update: {
          budget_amount?: number
          category_id?: string
          created_at?: string | null
          id?: string
          period?: Database["public"]["Enums"]["budget_period"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          account_prefix: string | null
          color: string
          created_at: string | null
          id: string
          is_system_category: boolean | null
          name: string
          type: Database["public"]["Enums"]["category_type"]
          updated_at: string | null
        }
        Insert: {
          account_prefix?: string | null
          color?: string
          created_at?: string | null
          id?: string
          is_system_category?: boolean | null
          name: string
          type: Database["public"]["Enums"]["category_type"]
          updated_at?: string | null
        }
        Update: {
          account_prefix?: string | null
          color?: string
          created_at?: string | null
          id?: string
          is_system_category?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["category_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      fiscal_years: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      income_transaction_logs: {
        Row: {
          action: string
          component: string
          created_at: string
          details: Json | null
          id: string
          transaction_id: string | null
          user_session: string | null
        }
        Insert: {
          action: string
          component?: string
          created_at?: string
          details?: Json | null
          id?: string
          transaction_id?: string | null
          user_session?: string | null
        }
        Update: {
          action?: string
          component?: string
          created_at?: string
          details?: Json | null
          id?: string
          transaction_id?: string | null
          user_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_transaction_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          category_id: string | null
          comp_aux_lib: string | null
          comp_aux_num: string | null
          compte_lib: string | null
          compte_num: string | null
          created_at: string | null
          credit: number | null
          date_let: string | null
          debit: number | null
          ecriture_date: string
          ecriture_let: string | null
          ecriture_lib: string
          ecriture_num: string | null
          fiscal_year_id: string | null
          id: string
          idevise: string | null
          journal_code: string | null
          journal_lib: string | null
          journal_type: string | null
          montant_devise: number | null
          num_doc: string | null
          piece_date: string | null
          piece_ref: string | null
          source: string | null
          updated_at: string | null
          valid_date: string | null
        }
        Insert: {
          category_id?: string | null
          comp_aux_lib?: string | null
          comp_aux_num?: string | null
          compte_lib?: string | null
          compte_num?: string | null
          created_at?: string | null
          credit?: number | null
          date_let?: string | null
          debit?: number | null
          ecriture_date: string
          ecriture_let?: string | null
          ecriture_lib: string
          ecriture_num?: string | null
          fiscal_year_id?: string | null
          id?: string
          idevise?: string | null
          journal_code?: string | null
          journal_lib?: string | null
          journal_type?: string | null
          montant_devise?: number | null
          num_doc?: string | null
          piece_date?: string | null
          piece_ref?: string | null
          source?: string | null
          updated_at?: string | null
          valid_date?: string | null
        }
        Update: {
          category_id?: string | null
          comp_aux_lib?: string | null
          comp_aux_num?: string | null
          compte_lib?: string | null
          compte_num?: string | null
          created_at?: string | null
          credit?: number | null
          date_let?: string | null
          debit?: number | null
          ecriture_date?: string
          ecriture_let?: string | null
          ecriture_lib?: string
          ecriture_num?: string | null
          fiscal_year_id?: string | null
          id?: string
          idevise?: string | null
          journal_code?: string | null
          journal_lib?: string | null
          journal_type?: string | null
          montant_devise?: number | null
          num_doc?: string | null
          piece_date?: string | null
          piece_ref?: string | null
          source?: string | null
          updated_at?: string | null
          valid_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_category_for_account: {
        Args: { account_num: string }
        Returns: string
      }
      get_fiscal_year_for_date: {
        Args: { transaction_date: string }
        Returns: string
      }
    }
    Enums: {
      budget_period: "monthly" | "quarterly" | "yearly"
      category_type: "income" | "expense" | "BS"
      transaction_type: "income" | "expense"
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
    Enums: {
      budget_period: ["monthly", "quarterly", "yearly"],
      category_type: ["income", "expense", "BS"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
