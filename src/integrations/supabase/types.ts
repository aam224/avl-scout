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
      screening_sessions: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          llm_input_text: string | null
          product_type: string
          region: string
          scores_json: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          llm_input_text?: string | null
          product_type: string
          region: string
          scores_json?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          llm_input_text?: string | null
          product_type?: string
          region?: string
          scores_json?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          id: string
          name: string
          country: string | null
          website: string | null
          founded_year: number | null
          publicly_traded: boolean
          stock_ticker: string | null
          headquarters_city: string | null
          employee_count_approx: number | null
          description: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          country?: string | null
          website?: string | null
          founded_year?: number | null
          publicly_traded?: boolean
          stock_ticker?: string | null
          headquarters_city?: string | null
          employee_count_approx?: number | null
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string | null
          website?: string | null
          founded_year?: number | null
          publicly_traded?: boolean
          stock_ticker?: string | null
          headquarters_city?: string | null
          employee_count_approx?: number | null
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          id: string
          manufacturer_id: string
          product_type: string
          model_name: string
          model_number: string | null
          status: string
          release_year: number | null
          description: string | null
          datasheet_url: string | null
          image_url: string | null
          certifications: string[]
          ul_listed: boolean | null
          iec_certified: boolean | null
          warranty_years: number | null
          warranty_details: string | null
          regions_available: string[]
          price_range_usd: string | null
          data_source: string | null
          data_source_url: string | null
          data_verified: boolean
          data_last_verified_at: string | null
          data_collected_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manufacturer_id: string
          product_type: string
          model_name: string
          model_number?: string | null
          status?: string
          release_year?: number | null
          description?: string | null
          datasheet_url?: string | null
          image_url?: string | null
          certifications?: string[]
          ul_listed?: boolean | null
          iec_certified?: boolean | null
          warranty_years?: number | null
          warranty_details?: string | null
          regions_available?: string[]
          price_range_usd?: string | null
          data_source?: string | null
          data_source_url?: string | null
          data_verified?: boolean
          data_last_verified_at?: string | null
          data_collected_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manufacturer_id?: string
          product_type?: string
          model_name?: string
          model_number?: string | null
          status?: string
          release_year?: number | null
          description?: string | null
          datasheet_url?: string | null
          image_url?: string | null
          certifications?: string[]
          ul_listed?: boolean | null
          iec_certified?: boolean | null
          warranty_years?: number | null
          warranty_details?: string | null
          regions_available?: string[]
          price_range_usd?: string | null
          data_source?: string | null
          data_source_url?: string | null
          data_verified?: boolean
          data_last_verified_at?: string | null
          data_collected_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          }
        ]
      }
      bess_specs: {
        Row: {
          id: string
          equipment_id: string
          energy_capacity_kwh: number | null
          usable_capacity_kwh: number | null
          power_rating_kw: number | null
          max_power_kw: number | null
          chemistry: string | null
          cell_manufacturer: string | null
          cycle_life: number | null
          depth_of_discharge_pct: number | null
          round_trip_efficiency_pct: number | null
          calendar_life_years: number | null
          degradation_rate_pct_per_year: number | null
          operating_temp_min_c: number | null
          operating_temp_max_c: number | null
          cooling_type: string | null
          weight_kg: number | null
          dimensions_mm: string | null
          enclosure_rating: string | null
          noise_level_dba: number | null
          voltage_range: string | null
          dc_voltage_nominal: number | null
          ac_voltage: string | null
          frequency_hz: string | null
          fire_suppression: string | null
          battery_management_system: string | null
          modules_per_unit: number | null
          max_parallel_units: number | null
          scalable_to_mwh: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          energy_capacity_kwh?: number | null
          usable_capacity_kwh?: number | null
          power_rating_kw?: number | null
          max_power_kw?: number | null
          chemistry?: string | null
          cell_manufacturer?: string | null
          cycle_life?: number | null
          depth_of_discharge_pct?: number | null
          round_trip_efficiency_pct?: number | null
          calendar_life_years?: number | null
          degradation_rate_pct_per_year?: number | null
          operating_temp_min_c?: number | null
          operating_temp_max_c?: number | null
          cooling_type?: string | null
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          noise_level_dba?: number | null
          voltage_range?: string | null
          dc_voltage_nominal?: number | null
          ac_voltage?: string | null
          frequency_hz?: string | null
          fire_suppression?: string | null
          battery_management_system?: string | null
          modules_per_unit?: number | null
          max_parallel_units?: number | null
          scalable_to_mwh?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          energy_capacity_kwh?: number | null
          usable_capacity_kwh?: number | null
          power_rating_kw?: number | null
          max_power_kw?: number | null
          chemistry?: string | null
          cell_manufacturer?: string | null
          cycle_life?: number | null
          depth_of_discharge_pct?: number | null
          round_trip_efficiency_pct?: number | null
          calendar_life_years?: number | null
          degradation_rate_pct_per_year?: number | null
          operating_temp_min_c?: number | null
          operating_temp_max_c?: number | null
          cooling_type?: string | null
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          noise_level_dba?: number | null
          voltage_range?: string | null
          dc_voltage_nominal?: number | null
          ac_voltage?: string | null
          frequency_hz?: string | null
          fire_suppression?: string | null
          battery_management_system?: string | null
          modules_per_unit?: number | null
          max_parallel_units?: number | null
          scalable_to_mwh?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bess_specs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: true
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          }
        ]
      }
      solar_panel_specs: {
        Row: {
          id: string
          equipment_id: string
          power_rating_w: number | null
          power_tolerance_pct: string | null
          efficiency_pct: number | null
          cell_type: string | null
          cell_count: number | null
          bifacial: boolean
          bifaciality_factor_pct: number | null
          voc_v: number | null
          isc_a: number | null
          vmp_v: number | null
          imp_a: number | null
          max_system_voltage_v: number | null
          temp_coeff_pmax_pct_per_c: number | null
          temp_coeff_voc_pct_per_c: number | null
          temp_coeff_isc_pct_per_c: number | null
          noct_c: number | null
          length_mm: number | null
          width_mm: number | null
          thickness_mm: number | null
          weight_kg: number | null
          frame_material: string | null
          glass_type: string | null
          connector_type: string | null
          first_year_degradation_pct: number | null
          annual_degradation_pct: number | null
          performance_warranty_years: number | null
          product_warranty_years: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          power_rating_w?: number | null
          power_tolerance_pct?: string | null
          efficiency_pct?: number | null
          cell_type?: string | null
          cell_count?: number | null
          bifacial?: boolean
          bifaciality_factor_pct?: number | null
          voc_v?: number | null
          isc_a?: number | null
          vmp_v?: number | null
          imp_a?: number | null
          max_system_voltage_v?: number | null
          temp_coeff_pmax_pct_per_c?: number | null
          temp_coeff_voc_pct_per_c?: number | null
          temp_coeff_isc_pct_per_c?: number | null
          noct_c?: number | null
          length_mm?: number | null
          width_mm?: number | null
          thickness_mm?: number | null
          weight_kg?: number | null
          frame_material?: string | null
          glass_type?: string | null
          connector_type?: string | null
          first_year_degradation_pct?: number | null
          annual_degradation_pct?: number | null
          performance_warranty_years?: number | null
          product_warranty_years?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          power_rating_w?: number | null
          power_tolerance_pct?: string | null
          efficiency_pct?: number | null
          cell_type?: string | null
          cell_count?: number | null
          bifacial?: boolean
          bifaciality_factor_pct?: number | null
          voc_v?: number | null
          isc_a?: number | null
          vmp_v?: number | null
          imp_a?: number | null
          max_system_voltage_v?: number | null
          temp_coeff_pmax_pct_per_c?: number | null
          temp_coeff_voc_pct_per_c?: number | null
          temp_coeff_isc_pct_per_c?: number | null
          noct_c?: number | null
          length_mm?: number | null
          width_mm?: number | null
          thickness_mm?: number | null
          weight_kg?: number | null
          frame_material?: string | null
          glass_type?: string | null
          connector_type?: string | null
          first_year_degradation_pct?: number | null
          annual_degradation_pct?: number | null
          performance_warranty_years?: number | null
          product_warranty_years?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solar_panel_specs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: true
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          }
        ]
      }
      inverter_specs: {
        Row: {
          id: string
          equipment_id: string
          inverter_type: string | null
          rated_power_kw: number | null
          max_apparent_power_kva: number | null
          max_ac_output_current_a: number | null
          max_dc_voltage_v: number | null
          mppt_voltage_range: string | null
          mppt_count: number | null
          strings_per_mppt: number | null
          max_dc_current_per_mppt_a: number | null
          max_input_power_kw: number | null
          ac_voltage_range: string | null
          ac_frequency: string | null
          thd_pct: number | null
          power_factor_range: string | null
          max_efficiency_pct: number | null
          cec_weighted_efficiency_pct: number | null
          euro_weighted_efficiency_pct: number | null
          grid_forming: boolean
          island_mode: boolean
          rapid_shutdown: boolean
          arc_fault_detection: boolean
          weight_kg: number | null
          dimensions_mm: string | null
          enclosure_rating: string | null
          operating_temp_range: string | null
          noise_level_dba: number | null
          cooling_type: string | null
          communication_interfaces: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          inverter_type?: string | null
          rated_power_kw?: number | null
          max_apparent_power_kva?: number | null
          max_ac_output_current_a?: number | null
          max_dc_voltage_v?: number | null
          mppt_voltage_range?: string | null
          mppt_count?: number | null
          strings_per_mppt?: number | null
          max_dc_current_per_mppt_a?: number | null
          max_input_power_kw?: number | null
          ac_voltage_range?: string | null
          ac_frequency?: string | null
          thd_pct?: number | null
          power_factor_range?: string | null
          max_efficiency_pct?: number | null
          cec_weighted_efficiency_pct?: number | null
          euro_weighted_efficiency_pct?: number | null
          grid_forming?: boolean
          island_mode?: boolean
          rapid_shutdown?: boolean
          arc_fault_detection?: boolean
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          operating_temp_range?: string | null
          noise_level_dba?: number | null
          cooling_type?: string | null
          communication_interfaces?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          inverter_type?: string | null
          rated_power_kw?: number | null
          max_apparent_power_kva?: number | null
          max_ac_output_current_a?: number | null
          max_dc_voltage_v?: number | null
          mppt_voltage_range?: string | null
          mppt_count?: number | null
          strings_per_mppt?: number | null
          max_dc_current_per_mppt_a?: number | null
          max_input_power_kw?: number | null
          ac_voltage_range?: string | null
          ac_frequency?: string | null
          thd_pct?: number | null
          power_factor_range?: string | null
          max_efficiency_pct?: number | null
          cec_weighted_efficiency_pct?: number | null
          euro_weighted_efficiency_pct?: number | null
          grid_forming?: boolean
          island_mode?: boolean
          rapid_shutdown?: boolean
          arc_fault_detection?: boolean
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          operating_temp_range?: string | null
          noise_level_dba?: number | null
          cooling_type?: string | null
          communication_interfaces?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inverter_specs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: true
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          }
        ]
      }
      ev_charger_specs: {
        Row: {
          id: string
          equipment_id: string
          charger_type: string | null
          connector_types: string[]
          max_power_kw: number | null
          min_power_kw: number | null
          voltage_range: string | null
          max_current_a: number | null
          num_ports: number | null
          simultaneous_charging: boolean
          power_sharing: boolean
          efficiency_pct: number | null
          standby_power_w: number | null
          ocpp_version: string | null
          iso_15118: boolean
          plug_and_charge: boolean
          load_management: boolean
          v2g_capable: boolean
          solar_integration: boolean
          battery_integrated: boolean
          connectivity: string[]
          payment_methods: string[]
          display_type: string | null
          weight_kg: number | null
          dimensions_mm: string | null
          enclosure_rating: string | null
          operating_temp_range: string | null
          mounting_type: string | null
          cable_length_m: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          charger_type?: string | null
          connector_types?: string[]
          max_power_kw?: number | null
          min_power_kw?: number | null
          voltage_range?: string | null
          max_current_a?: number | null
          num_ports?: number | null
          simultaneous_charging?: boolean
          power_sharing?: boolean
          efficiency_pct?: number | null
          standby_power_w?: number | null
          ocpp_version?: string | null
          iso_15118?: boolean
          plug_and_charge?: boolean
          load_management?: boolean
          v2g_capable?: boolean
          solar_integration?: boolean
          battery_integrated?: boolean
          connectivity?: string[]
          payment_methods?: string[]
          display_type?: string | null
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          operating_temp_range?: string | null
          mounting_type?: string | null
          cable_length_m?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          charger_type?: string | null
          connector_types?: string[]
          max_power_kw?: number | null
          min_power_kw?: number | null
          voltage_range?: string | null
          max_current_a?: number | null
          num_ports?: number | null
          simultaneous_charging?: boolean
          power_sharing?: boolean
          efficiency_pct?: number | null
          standby_power_w?: number | null
          ocpp_version?: string | null
          iso_15118?: boolean
          plug_and_charge?: boolean
          load_management?: boolean
          v2g_capable?: boolean
          solar_integration?: boolean
          battery_integrated?: boolean
          connectivity?: string[]
          payment_methods?: string[]
          display_type?: string | null
          weight_kg?: number | null
          dimensions_mm?: string | null
          enclosure_rating?: string | null
          operating_temp_range?: string | null
          mounting_type?: string | null
          cable_length_m?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ev_charger_specs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: true
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment_changelog: {
        Row: {
          id: string
          equipment_id: string
          change_type: string
          field_name: string | null
          old_value: string | null
          new_value: string | null
          change_reason: string | null
          changed_by: string
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          change_type: string
          field_name?: string | null
          old_value?: string | null
          new_value?: string | null
          change_reason?: string | null
          changed_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          change_type?: string
          field_name?: string | null
          old_value?: string | null
          new_value?: string | null
          change_reason?: string | null
          changed_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_changelog_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          }
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
