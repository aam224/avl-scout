import { SpecsTable } from "./SpecsTable";
import type { EvChargerSpecs } from "@/types/equipment";

interface EvChargerSpecsViewProps {
  specs: EvChargerSpecs;
}

export function EvChargerSpecsView({ specs }: EvChargerSpecsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SpecsTable
        title="Charger Type & Power"
        specs={[
          { label: "Charger Type", value: specs.charger_type },
          {
            label: "Connector Types",
            value: specs.connector_types?.length > 0 ? specs.connector_types.join(", ") : null,
          },
          { label: "Max Power", value: specs.max_power_kw, unit: "kW" },
          { label: "Min Power", value: specs.min_power_kw, unit: "kW" },
          { label: "Voltage Range", value: specs.voltage_range },
          { label: "Max Current", value: specs.max_current_a, unit: "A" },
        ]}
      />
      <SpecsTable
        title="Ports & Charging"
        specs={[
          { label: "Number of Ports", value: specs.num_ports },
          { label: "Simultaneous Charging", value: specs.simultaneous_charging },
          { label: "Power Sharing", value: specs.power_sharing },
          { label: "Efficiency", value: specs.efficiency_pct, unit: "%" },
          { label: "Standby Power", value: specs.standby_power_w, unit: "W" },
        ]}
      />
      <SpecsTable
        title="Smart Features"
        specs={[
          { label: "OCPP Version", value: specs.ocpp_version },
          { label: "ISO 15118", value: specs.iso_15118 },
          { label: "Plug & Charge", value: specs.plug_and_charge },
          { label: "Load Management", value: specs.load_management },
          { label: "V2G Capable", value: specs.v2g_capable },
          { label: "Solar Integration", value: specs.solar_integration },
          { label: "Battery Integrated", value: specs.battery_integrated },
        ]}
      />
      <SpecsTable
        title="Connectivity & Payment"
        specs={[
          {
            label: "Connectivity",
            value: specs.connectivity?.length > 0 ? specs.connectivity.join(", ") : null,
          },
          {
            label: "Payment Methods",
            value: specs.payment_methods?.length > 0 ? specs.payment_methods.join(", ") : null,
          },
          { label: "Display", value: specs.display_type },
        ]}
      />
      <SpecsTable
        title="Physical"
        specs={[
          { label: "Weight", value: specs.weight_kg, unit: "kg" },
          { label: "Dimensions", value: specs.dimensions_mm },
          { label: "Enclosure", value: specs.enclosure_rating },
          { label: "Temp Range", value: specs.operating_temp_range },
          { label: "Mounting", value: specs.mounting_type },
          { label: "Cable Length", value: specs.cable_length_m, unit: "m" },
        ]}
      />
    </div>
  );
}
