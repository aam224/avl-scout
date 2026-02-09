import { Battery, Sun, Zap, PlugZap, Building2, ShieldCheck } from "lucide-react";
import { useEquipmentStats } from "@/hooks/use-equipment";

export function EquipmentStatsBar() {
  const { data: stats, isLoading } = useEquipmentStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-4 animate-pulse">
            <div className="h-4 w-12 bg-muted rounded mb-2" />
            <div className="h-6 w-8 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { label: "Total Products", value: stats.totalEquipment, icon: Building2, color: "text-primary" },
    { label: "BESS", value: stats.bessCount, icon: Battery, color: "text-score-excellent" },
    { label: "Solar", value: stats.solarCount, icon: Sun, color: "text-yellow-500" },
    { label: "Inverters", value: stats.inverterCount, icon: Zap, color: "text-score-good" },
    { label: "EV Chargers", value: stats.evChargerCount, icon: PlugZap, color: "text-blue-400" },
    { label: "Verified", value: stats.verifiedCount, icon: ShieldCheck, color: "text-score-excellent" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-card"
        >
          <div className="flex items-center gap-2 mb-1">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
