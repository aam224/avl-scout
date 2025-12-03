import { useEffect, useState } from "react";
import {
  Shield,
  Factory,
  Award,
  FileCheck,
  Gauge,
  Zap,
  Loader2,
} from "lucide-react";
import { ScoreCard } from "./ScoreCard";
import { RecommendationCard } from "./RecommendationCard";
import { supabase } from "@/integrations/supabase/client";

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
  findings: Array<{
    category: string;
    finding: string;
    severity: "high" | "medium" | "low";
  }>;
  summary: string;
}

interface ScreeningResultsProps {
  productType: string;
  sessionId: string | null;
}

export function ScreeningResults({ productType, sessionId }: ScreeningResultsProps) {
  const [scores, setScores] = useState<ScoresJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("screening_sessions")
        .select("scores_json")
        .eq("id", sessionId)
        .single();

      if (!error && data?.scores_json) {
        setScores(data.scores_json as unknown as ScoresJson);
      }
      setLoading(false);
    }

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const overallScore = scores?.overall_score ?? 50;
  const recommendation = scores?.recommendation ?? "conditional";
  const scoreData = scores?.scores ?? {
    technical_compliance: 50,
    quality_assurance: 50,
    financial_stability: 50,
    manufacturing_capability: 50,
    track_record: 50,
    warranty_support: 50,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">AVL Screening Summary</p>
            <h2 className="text-2xl font-bold text-foreground">{productType}</h2>
            {scores?.summary && (
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                {scores.summary}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-4xl font-bold text-gradient">{overallScore}</p>
            </div>
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Score Cards Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Detailed Scores
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ScoreCard
            title="Technical Compliance"
            score={scoreData.technical_compliance}
            icon={Gauge}
            description="Meets technical specifications"
            delay={100}
          />
          <ScoreCard
            title="Quality Assurance"
            score={scoreData.quality_assurance}
            icon={Award}
            description="Quality management & certifications"
            delay={200}
          />
          <ScoreCard
            title="Financial Stability"
            score={scoreData.financial_stability}
            icon={Factory}
            description="Vendor financial health"
            delay={300}
          />
          <ScoreCard
            title="Manufacturing Capability"
            score={scoreData.manufacturing_capability}
            icon={Factory}
            description="Production capacity & supply chain"
            delay={400}
          />
          <ScoreCard
            title="Track Record"
            score={scoreData.track_record}
            icon={FileCheck}
            description="Historical performance & references"
            delay={500}
          />
          <ScoreCard
            title="Warranty & Support"
            score={scoreData.warranty_support}
            icon={Zap}
            description="Warranty terms & service network"
            delay={600}
          />
        </div>
      </div>

      {/* Findings */}
      {scores?.findings && scores.findings.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Key Findings
          </h3>
          <div className="space-y-2">
            {scores.findings.map((finding, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  finding.severity === "high"
                    ? "border-destructive/50 bg-destructive/5"
                    : finding.severity === "medium"
                    ? "border-yellow-500/50 bg-yellow-500/5"
                    : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      finding.severity === "high"
                        ? "bg-destructive/20 text-destructive"
                        : finding.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {finding.severity.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {finding.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{finding.finding}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Recommendation
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <RecommendationCard
            type={recommendation === "approve" ? "approve" : recommendation === "reject" ? "reject" : "conditional"}
            title={
              recommendation === "approve"
                ? "Recommend for AVL Inclusion"
                : recommendation === "reject"
                ? "Not Recommended"
                : "Conditional Approval"
            }
            description={
              recommendation === "approve"
                ? "This product meets the requirements for AVL inclusion based on the IE report analysis."
                : recommendation === "reject"
                ? "This product does not meet minimum AVL requirements."
                : "This product requires additional review before AVL inclusion."
            }
            details={
              recommendation === "approve"
                ? [
                    "Critical criteria met",
                    "Vendor stability confirmed",
                    "Documentation adequate",
                  ]
                : recommendation === "reject"
                ? [
                    "Critical deficiencies identified",
                    "Does not meet minimum standards",
                    "Recommend alternative vendors",
                  ]
                : [
                    "Some criteria below threshold",
                    "Additional documentation needed",
                    "Follow-up review required",
                  ]
            }
            delay={700}
          />
          <RecommendationCard
            type="info"
            title="Action Items"
            description="Suggested follow-up based on the screening analysis."
            details={[
              "Schedule follow-up review in 6 months",
              "Request updated test reports",
              "Monitor vendor performance quarterly",
              "Verify installation references",
            ]}
            delay={800}
          />
        </div>
      </div>
    </div>
  );
}
