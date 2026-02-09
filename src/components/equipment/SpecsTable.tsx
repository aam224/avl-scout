interface SpecRow {
  label: string;
  value: string | number | boolean | null | undefined;
  unit?: string;
}

interface SpecsTableProps {
  title: string;
  specs: SpecRow[];
}

export function SpecsTable({ title, specs }: SpecsTableProps) {
  const displaySpecs = specs.filter(
    (s) => s.value !== null && s.value !== undefined && s.value !== ""
  );

  if (displaySpecs.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="border-b border-border bg-card px-4 py-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border">
        {displaySpecs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-card transition-colors"
          >
            <span className="text-sm text-muted-foreground">{spec.label}</span>
            <span className="text-sm font-medium text-foreground text-right">
              {typeof spec.value === "boolean"
                ? spec.value
                  ? "Yes"
                  : "No"
                : spec.value}
              {spec.unit && typeof spec.value !== "boolean" && (
                <span className="text-muted-foreground ml-1">{spec.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
