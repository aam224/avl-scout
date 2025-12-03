import { Loader2, FileSearch, Brain, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStateProps {
  step: number;
}

const steps = [
  { icon: FileSearch, label: "Extracting report data" },
  { icon: Brain, label: "Analyzing against AVL criteria" },
  { icon: ClipboardCheck, label: "Generating recommendations" },
];

export function ProcessingState({ step }: ProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative rounded-full bg-primary/10 p-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </div>

      <h3 className="mb-8 text-xl font-semibold text-foreground">
        Processing IE Report
      </h3>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = index === step;
          const isComplete = index < step;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 rounded-lg p-3 transition-all duration-300",
                isActive && "bg-primary/10",
                isComplete && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isComplete
                    ? "bg-score-excellent/20 text-score-excellent"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : isComplete
                    ? "text-score-excellent"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {isActive && (
                <Loader2 className="ml-auto h-4 w-4 text-primary animate-spin" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
