import { Globe, TrendingUp, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  region: string;
  category: string;
  relevanceScore: number;
  trendingReason: string | null;
  status: string;
  onGenerateScript: (topicId: string) => void;
  isGenerating: boolean;
}

const categoryColors: Record<string, string> = {
  Solar: "bg-yellow-500/20 text-yellow-600",
  Wind: "bg-sky-500/20 text-sky-600",
  Hydrogen: "bg-purple-500/20 text-purple-600",
  "Battery Storage": "bg-green-500/20 text-green-600",
  "EV Infrastructure": "bg-blue-500/20 text-blue-600",
  "Grid Modernization": "bg-orange-500/20 text-orange-600",
  "Policy & Regulation": "bg-red-500/20 text-red-600",
  "Green Finance": "bg-emerald-500/20 text-emerald-600",
  "Emerging Tech": "bg-indigo-500/20 text-indigo-600",
  "Market Trends": "bg-pink-500/20 text-pink-600",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-score-excellent";
  if (score >= 60) return "text-score-good";
  if (score >= 40) return "text-score-warning";
  return "text-score-poor";
}

export function TopicCard({
  id,
  title,
  description,
  region,
  category,
  relevanceScore,
  trendingReason,
  status,
  onGenerateScript,
  isGenerating,
}: TopicCardProps) {
  const hasScript = status === "script_ready" || status === "published";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded",
                categoryColors[category] || "bg-muted text-muted-foreground"
              )}
            >
              {category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {region}
            </span>
          </div>
          <h3 className="font-semibold text-foreground leading-tight">{title}</h3>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">Relevance</p>
          <p className={cn("text-2xl font-bold", getScoreColor(relevanceScore))}>
            {relevanceScore}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{description}</p>

      {trendingReason && (
        <div className="flex items-start gap-2 mb-4 p-2 rounded-lg bg-primary/5">
          <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary">{trendingReason}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            hasScript
              ? "bg-score-excellent/20 text-score-excellent"
              : status === "script_pending"
              ? "bg-yellow-500/20 text-yellow-600"
              : "bg-muted text-muted-foreground"
          )}
        >
          {hasScript ? "Script Ready" : status === "script_pending" ? "Generating..." : "No Script"}
        </span>

        {!hasScript && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateScript(id)}
            disabled={isGenerating || status === "script_pending"}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Generate Script
          </Button>
        )}
      </div>
    </div>
  );
}
