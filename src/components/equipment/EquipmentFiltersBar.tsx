import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useManufacturers } from "@/hooks/use-equipment";
import {
  PRODUCT_TYPES,
  EQUIPMENT_STATUSES,
  type EquipmentFilters,
} from "@/types/equipment";

interface EquipmentFiltersBarProps {
  filters: EquipmentFilters;
  onChange: (filters: EquipmentFilters) => void;
}

export function EquipmentFiltersBar({ filters, onChange }: EquipmentFiltersBarProps) {
  const { data: manufacturers } = useManufacturers();

  const hasFilters =
    filters.productType || filters.manufacturer || filters.status || filters.search;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search equipment by name, model, or description..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="pl-10 bg-card border-border"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select
          value={filters.productType ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, productType: v === "all" ? undefined : (v as EquipmentFilters["productType"]) })
          }
        >
          <SelectTrigger className="w-[160px] bg-card border-border">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Types</SelectItem>
            {PRODUCT_TYPES.map((pt) => (
              <SelectItem key={pt.value} value={pt.value}>
                {pt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.manufacturer ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, manufacturer: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Manufacturers</SelectItem>
            {manufacturers?.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, status: v === "all" ? undefined : (v as EquipmentFilters["status"]) })
          }
        >
          <SelectTrigger className="w-[140px] bg-card border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            {EQUIPMENT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange({})}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
