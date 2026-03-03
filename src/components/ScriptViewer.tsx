import { Clock, Users, Lightbulb, MessageSquare, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScriptViewerProps {
  script: {
    id: string;
    title: string;
    hook: string;
    body: string;
    call_to_action: string;
    target_audience: string;
    estimated_duration: string;
    key_takeaways: string[];
    script_type: string;
    status: string;
  };
  onClose: () => void;
}

export function ScriptViewer({ script, onClose }: ScriptViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-2xl flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/20 text-primary">
                {script.script_type.toUpperCase()}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {script.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{script.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {script.estimated_duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {script.target_audience}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hook */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-yellow-500/20 p-1.5">
                <Mic className="h-4 w-4 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-foreground">Hook</h3>
              <span className="text-xs text-muted-foreground">(Opening 30 seconds)</span>
            </div>
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {script.hook}
              </p>
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-primary/20 p-1.5">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Main Content</h3>
              <span className="text-xs text-muted-foreground">(4-5 minutes)</span>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {script.body}
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-score-excellent/20 p-1.5">
                <Lightbulb className="h-4 w-4 text-score-excellent" />
              </div>
              <h3 className="font-semibold text-foreground">Call to Action</h3>
              <span className="text-xs text-muted-foreground">(Closing 30 seconds)</span>
            </div>
            <div className="rounded-lg border border-score-excellent/30 bg-score-excellent/5 p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {script.call_to_action}
              </p>
            </div>
          </div>

          {/* Key Takeaways */}
          {script.key_takeaways.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Key Takeaways</h3>
              <div className="space-y-2">
                {script.key_takeaways.map((takeaway, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-sm text-foreground">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
