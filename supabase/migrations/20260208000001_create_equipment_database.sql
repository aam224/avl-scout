-- ============================================================
-- Energy Equipment Database Schema
-- CEO Agent (Chief Equipment Officer) - Equipment Intelligence
-- ============================================================

-- Manufacturers table
CREATE TABLE public.manufacturers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  website TEXT,
  founded_year INTEGER,
  publicly_traded BOOLEAN DEFAULT false,
  stock_ticker TEXT,
  headquarters_city TEXT,
  employee_count_approx INTEGER,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main equipment table (common fields for all product types)
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id UUID NOT NULL REFERENCES public.manufacturers(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  model_name TEXT NOT NULL,
  model_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  release_year INTEGER,
  description TEXT,
  datasheet_url TEXT,
  image_url TEXT,

  -- Certifications & compliance
  certifications TEXT[] DEFAULT '{}',
  ul_listed BOOLEAN,
  iec_certified BOOLEAN,

  -- Warranty
  warranty_years INTEGER,
  warranty_details TEXT,

  -- Market info
  regions_available TEXT[] DEFAULT '{}',
  price_range_usd TEXT,

  -- Data quality
  data_source TEXT,
  data_source_url TEXT,
  data_verified BOOLEAN DEFAULT false,
  data_last_verified_at TIMESTAMP WITH TIME ZONE,
  data_collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(manufacturer_id, model_name, model_number)
);

-- Product type constraint
ALTER TABLE public.equipment
ADD CONSTRAINT valid_equipment_type CHECK (product_type IN ('BESS', 'Solar Panel', 'Inverter', 'EV Charger'));

-- Status constraint
ALTER TABLE public.equipment
ADD CONSTRAINT valid_equipment_status CHECK (status IN ('active', 'discontinued', 'announced', 'recalled'));

-- BESS-specific specifications
CREATE TABLE public.bess_specs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL UNIQUE REFERENCES public.equipment(id) ON DELETE CASCADE,

  -- Energy specs
  energy_capacity_kwh NUMERIC,
  usable_capacity_kwh NUMERIC,
  power_rating_kw NUMERIC,
  max_power_kw NUMERIC,

  -- Battery details
  chemistry TEXT,
  cell_manufacturer TEXT,
  cycle_life INTEGER,
  depth_of_discharge_pct NUMERIC,
  round_trip_efficiency_pct NUMERIC,
  calendar_life_years INTEGER,
  degradation_rate_pct_per_year NUMERIC,

  -- Thermal
  operating_temp_min_c NUMERIC,
  operating_temp_max_c NUMERIC,
  cooling_type TEXT,

  -- Physical
  weight_kg NUMERIC,
  dimensions_mm TEXT,
  enclosure_rating TEXT,
  noise_level_dba NUMERIC,

  -- Electrical
  voltage_range TEXT,
  dc_voltage_nominal NUMERIC,
  ac_voltage TEXT,
  frequency_hz TEXT,

  -- Safety
  fire_suppression TEXT,
  battery_management_system TEXT,

  -- Scalability
  modules_per_unit INTEGER,
  max_parallel_units INTEGER,
  scalable_to_mwh NUMERIC,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chemistry constraint
ALTER TABLE public.bess_specs
ADD CONSTRAINT valid_chemistry CHECK (chemistry IS NULL OR chemistry IN (
  'LFP', 'NMC', 'NCA', 'LTO', 'Sodium-Ion', 'Flow-Vanadium', 'Flow-Zinc', 'Solid-State', 'Lead-Acid', 'Other'
));

-- Solar panel specifications
CREATE TABLE public.solar_panel_specs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL UNIQUE REFERENCES public.equipment(id) ON DELETE CASCADE,

  -- Power specs
  power_rating_w NUMERIC,
  power_tolerance_pct TEXT,
  efficiency_pct NUMERIC,

  -- Cell details
  cell_type TEXT,
  cell_count INTEGER,
  bifacial BOOLEAN DEFAULT false,
  bifaciality_factor_pct NUMERIC,

  -- Voltage/current
  voc_v NUMERIC,
  isc_a NUMERIC,
  vmp_v NUMERIC,
  imp_a NUMERIC,
  max_system_voltage_v INTEGER,

  -- Temperature coefficients
  temp_coeff_pmax_pct_per_c NUMERIC,
  temp_coeff_voc_pct_per_c NUMERIC,
  temp_coeff_isc_pct_per_c NUMERIC,
  noct_c NUMERIC,

  -- Physical
  length_mm NUMERIC,
  width_mm NUMERIC,
  thickness_mm NUMERIC,
  weight_kg NUMERIC,
  frame_material TEXT,
  glass_type TEXT,
  connector_type TEXT,

  -- Degradation
  first_year_degradation_pct NUMERIC,
  annual_degradation_pct NUMERIC,
  performance_warranty_years INTEGER,
  product_warranty_years INTEGER,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cell type constraint
ALTER TABLE public.solar_panel_specs
ADD CONSTRAINT valid_cell_type CHECK (cell_type IS NULL OR cell_type IN (
  'Mono-PERC', 'Mono-TOPCon', 'Mono-HJT', 'Mono-IBC', 'Poly', 'Thin-Film-CdTe', 'Thin-Film-CIGS', 'Other'
));

-- Inverter specifications
CREATE TABLE public.inverter_specs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL UNIQUE REFERENCES public.equipment(id) ON DELETE CASCADE,

  -- Type
  inverter_type TEXT,

  -- Power specs
  rated_power_kw NUMERIC,
  max_apparent_power_kva NUMERIC,
  max_ac_output_current_a NUMERIC,

  -- DC input
  max_dc_voltage_v NUMERIC,
  mppt_voltage_range TEXT,
  mppt_count INTEGER,
  strings_per_mppt INTEGER,
  max_dc_current_per_mppt_a NUMERIC,
  max_input_power_kw NUMERIC,

  -- AC output
  ac_voltage_range TEXT,
  ac_frequency TEXT,
  thd_pct NUMERIC,
  power_factor_range TEXT,

  -- Efficiency
  max_efficiency_pct NUMERIC,
  cec_weighted_efficiency_pct NUMERIC,
  euro_weighted_efficiency_pct NUMERIC,

  -- Features
  grid_forming BOOLEAN DEFAULT false,
  island_mode BOOLEAN DEFAULT false,
  rapid_shutdown BOOLEAN DEFAULT false,
  arc_fault_detection BOOLEAN DEFAULT false,

  -- Physical
  weight_kg NUMERIC,
  dimensions_mm TEXT,
  enclosure_rating TEXT,
  operating_temp_range TEXT,
  noise_level_dba NUMERIC,
  cooling_type TEXT,

  -- Communication
  communication_interfaces TEXT[] DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inverter type constraint
ALTER TABLE public.inverter_specs
ADD CONSTRAINT valid_inverter_type CHECK (inverter_type IS NULL OR inverter_type IN (
  'String', 'Central', 'Micro', 'Hybrid', 'Battery', 'Utility-Scale', 'Other'
));

-- EV Charger specifications
CREATE TABLE public.ev_charger_specs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL UNIQUE REFERENCES public.equipment(id) ON DELETE CASCADE,

  -- Type
  charger_type TEXT,
  connector_types TEXT[] DEFAULT '{}',

  -- Power specs
  max_power_kw NUMERIC,
  min_power_kw NUMERIC,
  voltage_range TEXT,
  max_current_a NUMERIC,

  -- Ports
  num_ports INTEGER,
  simultaneous_charging BOOLEAN DEFAULT false,
  power_sharing BOOLEAN DEFAULT false,

  -- Efficiency
  efficiency_pct NUMERIC,
  standby_power_w NUMERIC,

  -- Features
  ocpp_version TEXT,
  iso_15118 BOOLEAN DEFAULT false,
  plug_and_charge BOOLEAN DEFAULT false,
  load_management BOOLEAN DEFAULT false,
  v2g_capable BOOLEAN DEFAULT false,
  solar_integration BOOLEAN DEFAULT false,
  battery_integrated BOOLEAN DEFAULT false,

  -- Connectivity
  connectivity TEXT[] DEFAULT '{}',
  payment_methods TEXT[] DEFAULT '{}',
  display_type TEXT,

  -- Physical
  weight_kg NUMERIC,
  dimensions_mm TEXT,
  enclosure_rating TEXT,
  operating_temp_range TEXT,
  mounting_type TEXT,
  cable_length_m NUMERIC,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Charger type constraint
ALTER TABLE public.ev_charger_specs
ADD CONSTRAINT valid_charger_type CHECK (charger_type IS NULL OR charger_type IN (
  'Level 1 AC', 'Level 2 AC', 'DC Fast', 'Ultra-Fast DC', 'Wireless', 'Portable', 'Other'
));

-- Equipment changelog for audit trail
CREATE TABLE public.equipment_changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  change_reason TEXT,
  changed_by TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Change type constraint
ALTER TABLE public.equipment_changelog
ADD CONSTRAINT valid_change_type CHECK (change_type IN ('created', 'updated', 'verified', 'flagged', 'deleted'));

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX idx_equipment_manufacturer ON public.equipment(manufacturer_id);
CREATE INDEX idx_equipment_product_type ON public.equipment(product_type);
CREATE INDEX idx_equipment_status ON public.equipment(status);
CREATE INDEX idx_equipment_model_name ON public.equipment(model_name);
CREATE INDEX idx_manufacturers_name ON public.manufacturers(name);
CREATE INDEX idx_changelog_equipment ON public.equipment_changelog(equipment_id);
CREATE INDEX idx_changelog_created ON public.equipment_changelog(created_at);

-- ============================================================
-- Row Level Security (public access - internal tool)
-- ============================================================

ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bess_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_panel_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inverter_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_charger_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on manufacturers" ON public.manufacturers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bess_specs" ON public.bess_specs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on solar_panel_specs" ON public.solar_panel_specs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on inverter_specs" ON public.inverter_specs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ev_charger_specs" ON public.ev_charger_specs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on equipment_changelog" ON public.equipment_changelog FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Triggers for updated_at
-- ============================================================

CREATE TRIGGER update_manufacturers_updated_at
BEFORE UPDATE ON public.manufacturers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bess_specs_updated_at
BEFORE UPDATE ON public.bess_specs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solar_panel_specs_updated_at
BEFORE UPDATE ON public.solar_panel_specs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inverter_specs_updated_at
BEFORE UPDATE ON public.inverter_specs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ev_charger_specs_updated_at
BEFORE UPDATE ON public.ev_charger_specs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
