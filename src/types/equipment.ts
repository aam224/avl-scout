import type { Tables } from "@/integrations/supabase/types";

export type Manufacturer = Tables<"manufacturers">;
export type Equipment = Tables<"equipment">;
export type BessSpecs = Tables<"bess_specs">;
export type SolarPanelSpecs = Tables<"solar_panel_specs">;
export type InverterSpecs = Tables<"inverter_specs">;
export type EvChargerSpecs = Tables<"ev_charger_specs">;
export type EquipmentChangelog = Tables<"equipment_changelog">;

export type ProductType = "BESS" | "Solar Panel" | "Inverter" | "EV Charger";
export type EquipmentStatus = "active" | "discontinued" | "announced" | "recalled";

export interface EquipmentWithManufacturer extends Equipment {
  manufacturers: Manufacturer;
}

export interface EquipmentWithDetails extends EquipmentWithManufacturer {
  bess_specs: BessSpecs | null;
  solar_panel_specs: SolarPanelSpecs | null;
  inverter_specs: InverterSpecs | null;
  ev_charger_specs: EvChargerSpecs | null;
}

export interface EquipmentFilters {
  productType?: ProductType;
  manufacturer?: string;
  status?: EquipmentStatus;
  search?: string;
  verified?: boolean;
}

export const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: "BESS", label: "Battery Storage", icon: "Battery" },
  { value: "Solar Panel", label: "Solar Panel", icon: "Sun" },
  { value: "Inverter", label: "Inverter", icon: "Zap" },
  { value: "EV Charger", label: "EV Charger", icon: "PlugZap" },
];

export const EQUIPMENT_STATUSES: { value: EquipmentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "discontinued", label: "Discontinued" },
  { value: "announced", label: "Announced" },
  { value: "recalled", label: "Recalled" },
];

export function isDataStale(dataCollectedAt: string): boolean {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(dataCollectedAt) < sixMonthsAgo;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active": return "text-score-excellent bg-score-excellent/10";
    case "discontinued": return "text-muted-foreground bg-muted";
    case "announced": return "text-primary bg-primary/10";
    case "recalled": return "text-score-poor bg-score-poor/10";
    default: return "text-muted-foreground bg-muted";
  }
}
