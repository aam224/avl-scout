import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  EquipmentWithManufacturer,
  EquipmentWithDetails,
  EquipmentFilters,
  Manufacturer,
} from "@/types/equipment";

export function useEquipmentList(filters: EquipmentFilters) {
  return useQuery({
    queryKey: ["equipment", filters],
    queryFn: async (): Promise<EquipmentWithManufacturer[]> => {
      let query = supabase
        .from("equipment")
        .select("*, manufacturers(*)")
        .order("updated_at", { ascending: false });

      if (filters.productType) {
        query = query.eq("product_type", filters.productType);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.manufacturer) {
        query = query.eq("manufacturer_id", filters.manufacturer);
      }
      if (filters.verified !== undefined) {
        query = query.eq("data_verified", filters.verified);
      }
      if (filters.search) {
        query = query.or(
          `model_name.ilike.%${filters.search}%,model_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as EquipmentWithManufacturer[];
    },
  });
}

export function useEquipmentDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: async (): Promise<EquipmentWithDetails> => {
      const { data, error } = await supabase
        .from("equipment")
        .select(
          "*, manufacturers(*), bess_specs(*), solar_panel_specs(*), inverter_specs(*), ev_charger_specs(*)"
        )
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data as unknown as EquipmentWithDetails;
    },
    enabled: !!id,
  });
}

export function useEquipmentChangelog(equipmentId: string | undefined) {
  return useQuery({
    queryKey: ["equipment-changelog", equipmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_changelog")
        .select("*")
        .eq("equipment_id", equipmentId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!equipmentId,
  });
}

export function useManufacturers() {
  return useQuery({
    queryKey: ["manufacturers"],
    queryFn: async (): Promise<Manufacturer[]> => {
      const { data, error } = await supabase
        .from("manufacturers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEquipmentStats() {
  return useQuery({
    queryKey: ["equipment-stats"],
    queryFn: async () => {
      const [
        { count: totalEquipment },
        { count: totalManufacturers },
        { count: bessCount },
        { count: solarCount },
        { count: inverterCount },
        { count: evChargerCount },
        { count: verifiedCount },
      ] = await Promise.all([
        supabase.from("equipment").select("*", { count: "exact", head: true }),
        supabase.from("manufacturers").select("*", { count: "exact", head: true }),
        supabase.from("equipment").select("*", { count: "exact", head: true }).eq("product_type", "BESS"),
        supabase.from("equipment").select("*", { count: "exact", head: true }).eq("product_type", "Solar Panel"),
        supabase.from("equipment").select("*", { count: "exact", head: true }).eq("product_type", "Inverter"),
        supabase.from("equipment").select("*", { count: "exact", head: true }).eq("product_type", "EV Charger"),
        supabase.from("equipment").select("*", { count: "exact", head: true }).eq("data_verified", true),
      ]);

      return {
        totalEquipment: totalEquipment ?? 0,
        totalManufacturers: totalManufacturers ?? 0,
        bessCount: bessCount ?? 0,
        solarCount: solarCount ?? 0,
        inverterCount: inverterCount ?? 0,
        evChargerCount: evChargerCount ?? 0,
        verifiedCount: verifiedCount ?? 0,
      };
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["equipment-stats"] });
    },
  });
}
