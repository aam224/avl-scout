import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const regions = [
  { value: "US", label: "US" },
  { value: "EU", label: "EU" },
  { value: "India", label: "India" },
  { value: "APAC", label: "APAC" },
  { value: "LATAM", label: "LATAM" },
];

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  return (
    <div className="w-full">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <Globe className="h-4 w-4 text-primary" />
        Region
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-12 bg-card border-border text-foreground">
          <SelectValue placeholder="Select region..." />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {regions.map((region) => (
            <SelectItem
              key={region.value}
              value={region.value}
              className="text-foreground focus:bg-secondary focus:text-foreground"
            >
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
