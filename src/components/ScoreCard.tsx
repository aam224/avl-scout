import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon: LucideIcon;
  description: string;
  delay?: number;
}

export function ScoreCard({
  title,
  score,
  maxScore = 100,
  icon: Icon,
  description,
  delay = 0,
}: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-score-excellent";
    if (pct >= 60) return "text-score-good";
    if (pct >= 40) return "text-score-warning";
    return "text-score-poor";
  };

  const getBarColor = (pct: number) => {
    if (pct >= 80) return "bg-score-excellent";
    if (pct >= 60) return "bg-score-good";
    if (pct >= 40) return "bg-score-warning";
    return "bg-score-poor";
  };

  const getScoreLabel = (pct: number) => {
    if (pct >= 80) return "Excellent";
    if (pct >= 60) return "Good";
    if (pct >= 40) return "Needs Review";
    return "High Risk";
  };

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 shadow-card opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={cn("text-2xl font-bold", getScoreColor(percentage))}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">/{maxScore}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              getBarColor(percentage)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={cn("font-medium", getScoreColor(percentage))}>
            {getScoreLabel(percentage)}
          </span>
          <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
