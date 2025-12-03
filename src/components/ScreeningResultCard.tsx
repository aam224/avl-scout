import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Factory,
  DollarSign,
  History,
  Wrench,
  FileQuestion,
} from "lucide-react";

interface Finding {
  category: string;
  finding: string;
  severity: "high" | "medium" | "low";
}

interface ScoresJson {
  overall_score: number;
  recommendation: "approve" | "conditional" | "reject";
  scores: {
    technical_compliance: number;
    quality_assurance: number;
    financial_stability: number;
    manufacturing_capability: number;
    track_record: number;
    warranty_support: number;
  };
  findings: Finding[];
  summary: string;
}

interface ScreeningResultCardProps {
  scoresJson: ScoresJson;
}

const scoreCategories = [
  { key: "technical_compliance", label: "Technical Compliance", icon: Shield },
  { key: "quality_assurance", label: "Quality Assurance", icon: CheckCircle2 },
  { key: "financial_stability", label: "Financial Stability", icon: DollarSign },
  { key: "manufacturing_capability", label: "Manufacturing", icon: Factory },
  { key: "track_record", label: "Track Record", icon: History },
  { key: "warranty_support", label: "Warranty & Support", icon: Wrench },
] as const;

export function ScreeningResultCard({ scoresJson }: ScreeningResultCardProps) {
  const { overall_score, recommendation, scores, findings, summary } = scoresJson;

  // Separate findings by type
  const redFlags = findings.filter((f) => f.severity === "high");
  const warnings = findings.filter((f) => f.severity === "medium");
  const missingInfo = findings.filter(
    (f) => f.finding.toLowerCase().includes("missing") || 
           f.finding.toLowerCase().includes("not provided") ||
           f.finding.toLowerCase().includes("insufficient")
  );

  const getRecommendationConfig = () => {
    switch (recommendation) {
      case "approve":
        return {
          label: "Approved",
          variant: "default" as const,
          icon: CheckCircle2,
          className: "bg-green-500/10 text-green-500 border-green-500/20",
        };
      case "conditional":
        return {
          label: "Conditional",
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        };
      case "reject":
        return {
          label: "Rejected",
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-500/10 text-red-500 border-red-500/20",
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const recConfig = getRecommendationConfig();
  const RecIcon = recConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header: Overall Score & Recommendation */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Overall Score Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-5xl font-bold ${getScoreColor(overall_score)}`}>
                {overall_score}
              </div>
              <div className="flex-1">
                <Progress 
                  value={overall_score} 
                  className="h-3"
                  indicatorClassName={getProgressColor(overall_score)}
                />
                <p className="mt-1 text-xs text-muted-foreground">out of 100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge className={`px-4 py-2 text-lg font-semibold ${recConfig.className}`}>
                <RecIcon className="mr-2 h-5 w-5" />
                {recConfig.label}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Scores */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Category Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreCategories.map(({ key, label, icon: Icon }) => {
              const score = scores[key];
              return (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-background/50 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                    <Progress
                      value={score}
                      className="flex-1 h-2"
                      indicatorClassName={getProgressColor(score)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Red Flags & Warnings */}
      {(redFlags.length > 0 || warnings.length > 0) && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Findings & Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {redFlags.map((finding, idx) => (
              <div
                key={`red-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3"
              >
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <span className="font-medium text-red-500">{finding.category}</span>
                  <p className="text-sm text-foreground">{finding.finding}</p>
                </div>
              </div>
            ))}
            {warnings.map((finding, idx) => (
              <div
                key={`warn-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <span className="font-medium text-yellow-500">{finding.category}</span>
                  <p className="text-sm text-foreground">{finding.finding}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Missing Information */}
      {missingInfo.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileQuestion className="h-5 w-5 text-muted-foreground" />
              Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {missingInfo.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <span>
                    <strong className="text-foreground">{item.category}:</strong>{" "}
                    {item.finding}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
