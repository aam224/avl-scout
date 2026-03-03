import { Calendar, FileText, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyBriefPanelProps {
  brief: {
    id: string;
    week_number: number;
    year: number;
    summary: string;
    topic_count: number;
    script_count: number;
    status: string;
    generated_at: string | null;
  } | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function WeeklyBriefPanel({ brief, onGenerate, isGenerating }: WeeklyBriefPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/20 p-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Weekly Brief</h3>
            {brief && (
              <p className="text-xs text-muted-foreground">
                Week {brief.week_number}, {brief.year}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {brief ? "Refresh Brief" : "Generate Brief"}
        </Button>
      </div>

      {brief ? (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{brief.topic_count}</p>
              <p className="text-xs text-muted-foreground">Topics Discovered</p>
            </div>
            <div className="rounded-lg bg-score-excellent/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-score-excellent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{brief.script_count}</p>
              <p className="text-xs text-muted-foreground">Scripts Generated</p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {brief.summary}
            </p>
          </div>

          {brief.generated_at && (
            <p className="text-xs text-muted-foreground text-right">
              Generated: {new Date(brief.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No weekly brief yet. Discover topics and generate scripts first, then create your weekly brief.
          </p>
        </div>
      )}
    </div>
  );
}
