import { Loader2, Database } from "lucide-react";
import { EquipmentCard } from "./EquipmentCard";
import type { EquipmentWithManufacturer } from "@/types/equipment";

interface EquipmentGridProps {
  equipment: EquipmentWithManufacturer[] | undefined;
  isLoading: boolean;
}

export function EquipmentGrid({ equipment, isLoading }: EquipmentGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!equipment || equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Database className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No equipment found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No equipment matches your current filters. Try adjusting your search
          criteria or seed the database with initial equipment data.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
}
