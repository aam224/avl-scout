import { Link } from "react-router-dom";
import {
  Battery,
  Sun,
  Zap,
  PlugZap,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Building2,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EquipmentWithManufacturer } from "@/types/equipment";
import { isDataStale, getStatusColor } from "@/types/equipment";

const typeIcons: Record<string, React.ElementType> = {
  BESS: Battery,
  "Solar Panel": Sun,
  Inverter: Zap,
  "EV Charger": PlugZap,
};

interface EquipmentCardProps {
  equipment: EquipmentWithManufacturer;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const TypeIcon = typeIcons[equipment.product_type] ?? Zap;
  const stale = isDataStale(equipment.data_collected_at);

  return (
    <Link
      to={`/equipment/${equipment.id}`}
      className="group block rounded-xl border border-border bg-card/50 p-5 transition-all hover:bg-card hover:shadow-card hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <TypeIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {equipment.model_name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {equipment.manufacturers?.name}
            </div>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {equipment.model_number && (
        <p className="text-xs text-muted-foreground mb-2 font-mono">{equipment.model_number}</p>
      )}

      {equipment.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {equipment.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="outline" className={getStatusColor(equipment.status)}>
          {equipment.status}
        </Badge>
        <Badge variant="outline" className="text-muted-foreground">
          {equipment.product_type}
        </Badge>
        {equipment.release_year && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {equipment.release_year}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {equipment.data_verified ? (
            <span className="flex items-center gap-1 text-score-excellent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-score-warning">
              <ShieldAlert className="h-3.5 w-3.5" />
              Unverified
            </span>
          )}
          {stale && (
            <span className="flex items-center gap-1 text-score-warning">
              <AlertTriangle className="h-3.5 w-3.5" />
              Stale data
            </span>
          )}
        </div>
        {equipment.regions_available.length > 0 && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            {equipment.regions_available.join(", ")}
          </span>
        )}
      </div>
    </Link>
  );
}
