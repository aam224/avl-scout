import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";

const productTypes = [
  { value: "solar-pv", label: "Solar PV Modules" },
  { value: "inverters", label: "Inverters" },
  { value: "battery-storage", label: "Battery Storage Systems" },
  { value: "transformers", label: "Transformers" },
  { value: "cables", label: "Cables & Wiring" },
  { value: "mounting", label: "Mounting Systems" },
  { value: "trackers", label: "Solar Trackers" },
  { value: "other", label: "Other Components" },
];

interface ProductTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductTypeSelect({ value, onChange }: ProductTypeSelectProps) {
  return (
    <div className="w-full">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <Package className="h-4 w-4 text-primary" />
        Product Type
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-12 bg-card border-border text-foreground">
          <SelectValue placeholder="Select product type..." />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {productTypes.map((type) => (
            <SelectItem
              key={type.value}
              value={type.value}
              className="text-foreground focus:bg-secondary focus:text-foreground"
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
