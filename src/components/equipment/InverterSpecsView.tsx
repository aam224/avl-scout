import { SpecsTable } from "./SpecsTable";
import type { InverterSpecs } from "@/types/equipment";

interface InverterSpecsViewProps {
  specs: InverterSpecs;
}

export function InverterSpecsView({ specs }: InverterSpecsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SpecsTable
        title="Power & Type"
        specs={[
          { label: "Inverter Type", value: specs.inverter_type },
          { label: "Rated Power", value: specs.rated_power_kw, unit: "kW" },
          { label: "Max Apparent Power", value: specs.max_apparent_power_kva, unit: "kVA" },
          { label: "Max AC Output Current", value: specs.max_ac_output_current_a, unit: "A" },
          { label: "Max Input Power", value: specs.max_input_power_kw, unit: "kW" },
        ]}
      />
      <SpecsTable
        title="DC Input"
        specs={[
          { label: "Max DC Voltage", value: specs.max_dc_voltage_v, unit: "V" },
          { label: "MPPT Voltage Range", value: specs.mppt_voltage_range },
          { label: "MPPT Count", value: specs.mppt_count },
          { label: "Strings Per MPPT", value: specs.strings_per_mppt },
          { label: "Max DC Current/MPPT", value: specs.max_dc_current_per_mppt_a, unit: "A" },
        ]}
      />
      <SpecsTable
        title="AC Output"
        specs={[
          { label: "AC Voltage Range", value: specs.ac_voltage_range },
          { label: "AC Frequency", value: specs.ac_frequency },
          { label: "THD", value: specs.thd_pct, unit: "%" },
          { label: "Power Factor Range", value: specs.power_factor_range },
        ]}
      />
      <SpecsTable
        title="Efficiency"
        specs={[
          { label: "Max Efficiency", value: specs.max_efficiency_pct, unit: "%" },
          { label: "CEC Weighted", value: specs.cec_weighted_efficiency_pct, unit: "%" },
          { label: "Euro Weighted", value: specs.euro_weighted_efficiency_pct, unit: "%" },
        ]}
      />
      <SpecsTable
        title="Features"
        specs={[
          { label: "Grid Forming", value: specs.grid_forming },
          { label: "Island Mode", value: specs.island_mode },
          { label: "Rapid Shutdown", value: specs.rapid_shutdown },
          { label: "Arc Fault Detection", value: specs.arc_fault_detection },
        ]}
      />
      <SpecsTable
        title="Physical & Communication"
        specs={[
          { label: "Weight", value: specs.weight_kg, unit: "kg" },
          { label: "Dimensions", value: specs.dimensions_mm },
          { label: "Enclosure", value: specs.enclosure_rating },
          { label: "Temp Range", value: specs.operating_temp_range },
          { label: "Noise Level", value: specs.noise_level_dba, unit: "dBA" },
          { label: "Cooling", value: specs.cooling_type },
          {
            label: "Communication",
            value:
              specs.communication_interfaces?.length > 0
                ? specs.communication_interfaces.join(", ")
                : null,
          },
        ]}
      />
    </div>
  );
}
