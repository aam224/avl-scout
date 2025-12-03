import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

type RecommendationType = "approve" | "conditional" | "reject" | "info";

interface RecommendationCardProps {
  type: RecommendationType;
  title: string;
  description: string;
  details?: string[];
  delay?: number;
}

const typeConfig: Record<
  RecommendationType,
  {
    icon: typeof CheckCircle2;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  approve: {
    icon: CheckCircle2,
    color: "text-score-excellent",
    bgColor: "bg-score-excellent/10",
    borderColor: "border-score-excellent/30",
  },
  conditional: {
    icon: AlertTriangle,
    color: "text-score-warning",
    bgColor: "bg-score-warning/10",
    borderColor: "border-score-warning/30",
  },
  reject: {
    icon: XCircle,
    color: "text-score-poor",
    bgColor: "bg-score-poor/10",
    borderColor: "border-score-poor/30",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
};

export function RecommendationCard({
  type,
  title,
  description,
  details,
  delay = 0,
}: RecommendationCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-xl border p-5 opacity-0 animate-fade-in",
        config.bgColor,
        config.borderColor
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className={cn("rounded-lg p-2", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div>
          <h3 className={cn("font-semibold", config.color)}>{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {details && details.length > 0 && (
        <ul className="ml-12 space-y-1">
          {details.map((detail, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", config.color.replace("text-", "bg-"))} />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
