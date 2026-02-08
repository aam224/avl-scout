import { SpecsTable } from "./SpecsTable";
import type { BessSpecs } from "@/types/equipment";

interface BessSpecsViewProps {
  specs: BessSpecs;
}

export function BessSpecsView({ specs }: BessSpecsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SpecsTable
        title="Energy & Power"
        specs={[
          { label: "Energy Capacity", value: specs.energy_capacity_kwh, unit: "kWh" },
          { label: "Usable Capacity", value: specs.usable_capacity_kwh, unit: "kWh" },
          { label: "Power Rating", value: specs.power_rating_kw, unit: "kW" },
          { label: "Max Power", value: specs.max_power_kw, unit: "kW" },
          { label: "Scalable To", value: specs.scalable_to_mwh, unit: "MWh" },
        ]}
      />
      <SpecsTable
        title="Battery Details"
        specs={[
          { label: "Chemistry", value: specs.chemistry },
          { label: "Cell Manufacturer", value: specs.cell_manufacturer },
          { label: "Cycle Life", value: specs.cycle_life, unit: "cycles" },
          { label: "Depth of Discharge", value: specs.depth_of_discharge_pct, unit: "%" },
          { label: "Round-Trip Efficiency", value: specs.round_trip_efficiency_pct, unit: "%" },
          { label: "Calendar Life", value: specs.calendar_life_years, unit: "years" },
          { label: "Degradation Rate", value: specs.degradation_rate_pct_per_year, unit: "%/year" },
        ]}
      />
      <SpecsTable
        title="Thermal & Physical"
        specs={[
          { label: "Operating Temp (Min)", value: specs.operating_temp_min_c, unit: "C" },
          { label: "Operating Temp (Max)", value: specs.operating_temp_max_c, unit: "C" },
          { label: "Cooling", value: specs.cooling_type },
          { label: "Weight", value: specs.weight_kg, unit: "kg" },
          { label: "Dimensions", value: specs.dimensions_mm },
          { label: "Enclosure", value: specs.enclosure_rating },
          { label: "Noise Level", value: specs.noise_level_dba, unit: "dBA" },
        ]}
      />
      <SpecsTable
        title="Electrical & Safety"
        specs={[
          { label: "DC Voltage (Nominal)", value: specs.dc_voltage_nominal, unit: "V" },
          { label: "Voltage Range", value: specs.voltage_range },
          { label: "AC Voltage", value: specs.ac_voltage },
          { label: "Frequency", value: specs.frequency_hz },
          { label: "Fire Suppression", value: specs.fire_suppression },
          { label: "BMS", value: specs.battery_management_system },
          { label: "Modules Per Unit", value: specs.modules_per_unit },
          { label: "Max Parallel Units", value: specs.max_parallel_units },
        ]}
      />
    </div>
  );
}
