import { Clock, Plus, Pencil, ShieldCheck, AlertTriangle, Trash2 } from "lucide-react";
import { useEquipmentChangelog } from "@/hooks/use-equipment";
import { formatDistanceToNow } from "date-fns";

const changeTypeIcons: Record<string, React.ElementType> = {
  created: Plus,
  updated: Pencil,
  verified: ShieldCheck,
  flagged: AlertTriangle,
  deleted: Trash2,
};

const changeTypeColors: Record<string, string> = {
  created: "text-score-excellent",
  updated: "text-primary",
  verified: "text-score-good",
  flagged: "text-score-warning",
  deleted: "text-score-poor",
};

interface ChangelogViewProps {
  equipmentId: string;
}

export function ChangelogView({ equipmentId }: ChangelogViewProps) {
  const { data: changelog, isLoading } = useEquipmentChangelog(equipmentId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-48 bg-muted rounded mb-1" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!changelog || changelog.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No changelog entries yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="border-b border-border bg-card px-4 py-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Change History
        </h3>
      </div>
      <div className="divide-y divide-border">
        {changelog.map((entry) => {
          const Icon = changeTypeIcons[entry.change_type] ?? Pencil;
          const color = changeTypeColors[entry.change_type] ?? "text-muted-foreground";

          return (
            <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
              <div className={`mt-0.5 rounded-full bg-card p-1.5 ${color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {entry.change_type}
                  </span>
                  {entry.field_name && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {entry.field_name}
                    </span>
                  )}
                </div>
                {entry.change_reason && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {entry.change_reason}
                  </p>
                )}
                {entry.old_value && entry.new_value && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    <span className="text-score-poor line-through">{entry.old_value}</span>
                    {" -> "}
                    <span className="text-score-excellent">{entry.new_value}</span>
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                  <span className="text-xs text-muted-foreground">by {entry.changed_by}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
