import { SpecsTable } from "./SpecsTable";
import type { SolarPanelSpecs } from "@/types/equipment";

interface SolarSpecsViewProps {
  specs: SolarPanelSpecs;
}

export function SolarSpecsView({ specs }: SolarSpecsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SpecsTable
        title="Power Output"
        specs={[
          { label: "Power Rating", value: specs.power_rating_w, unit: "W" },
          { label: "Power Tolerance", value: specs.power_tolerance_pct, unit: "%" },
          { label: "Efficiency", value: specs.efficiency_pct, unit: "%" },
          { label: "Bifacial", value: specs.bifacial },
          { label: "Bifaciality Factor", value: specs.bifaciality_factor_pct, unit: "%" },
        ]}
      />
      <SpecsTable
        title="Cell Details"
        specs={[
          { label: "Cell Type", value: specs.cell_type },
          { label: "Cell Count", value: specs.cell_count },
          { label: "Max System Voltage", value: specs.max_system_voltage_v, unit: "V" },
        ]}
      />
      <SpecsTable
        title="Electrical Characteristics"
        specs={[
          { label: "Voc", value: specs.voc_v, unit: "V" },
          { label: "Isc", value: specs.isc_a, unit: "A" },
          { label: "Vmp", value: specs.vmp_v, unit: "V" },
          { label: "Imp", value: specs.imp_a, unit: "A" },
        ]}
      />
      <SpecsTable
        title="Temperature Coefficients"
        specs={[
          { label: "Pmax Coeff.", value: specs.temp_coeff_pmax_pct_per_c, unit: "%/C" },
          { label: "Voc Coeff.", value: specs.temp_coeff_voc_pct_per_c, unit: "%/C" },
          { label: "Isc Coeff.", value: specs.temp_coeff_isc_pct_per_c, unit: "%/C" },
          { label: "NOCT", value: specs.noct_c, unit: "C" },
        ]}
      />
      <SpecsTable
        title="Physical"
        specs={[
          { label: "Length", value: specs.length_mm, unit: "mm" },
          { label: "Width", value: specs.width_mm, unit: "mm" },
          { label: "Thickness", value: specs.thickness_mm, unit: "mm" },
          { label: "Weight", value: specs.weight_kg, unit: "kg" },
          { label: "Frame", value: specs.frame_material },
          { label: "Glass", value: specs.glass_type },
          { label: "Connector", value: specs.connector_type },
        ]}
      />
      <SpecsTable
        title="Warranty & Degradation"
        specs={[
          { label: "1st Year Degradation", value: specs.first_year_degradation_pct, unit: "%" },
          { label: "Annual Degradation", value: specs.annual_degradation_pct, unit: "%" },
          { label: "Performance Warranty", value: specs.performance_warranty_years, unit: "years" },
          { label: "Product Warranty", value: specs.product_warranty_years, unit: "years" },
        ]}
      />
    </div>
  );
}
