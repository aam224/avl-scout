import {
  Shield,
  Factory,
  Award,
  FileCheck,
  Gauge,
  Zap,
} from "lucide-react";
import { ScoreCard } from "./ScoreCard";
import { RecommendationCard } from "./RecommendationCard";

interface ScreeningResultsProps {
  productType: string;
}

// Mock data - in real app this would come from AI analysis
const getMockResults = (productType: string) => {
  const baseScores = {
    manufacturer: { score: 85, title: "Manufacturer Assessment" },
    quality: { score: 72, title: "Quality Standards" },
    certification: { score: 90, title: "Certifications" },
    documentation: { score: 68, title: "Documentation" },
    performance: { score: 78, title: "Performance Data" },
    reliability: { score: 82, title: "Reliability Metrics" },
  };

  return baseScores;
};

const productTypeLabels: Record<string, string> = {
  "solar-pv": "Solar PV Modules",
  inverters: "Inverters",
  "battery-storage": "Battery Storage Systems",
  transformers: "Transformers",
  cables: "Cables & Wiring",
  mounting: "Mounting Systems",
  trackers: "Solar Trackers",
  other: "Other Components",
};

export function ScreeningResults({ productType }: ScreeningResultsProps) {
  const results = getMockResults(productType);
  const overallScore = Math.round(
    Object.values(results).reduce((sum, r) => sum + r.score, 0) /
      Object.values(results).length
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">AVL Screening Summary</p>
            <h2 className="text-2xl font-bold text-foreground">
              {productTypeLabels[productType] || productType}
            </h2>
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
            title="Manufacturer Assessment"
            score={results.manufacturer.score}
            icon={Factory}
            description="Company history & financial stability"
            delay={100}
          />
          <ScoreCard
            title="Quality Standards"
            score={results.quality.score}
            icon={Award}
            description="ISO & industry compliance"
            delay={200}
          />
          <ScoreCard
            title="Certifications"
            score={results.certification.score}
            icon={FileCheck}
            description="Product certifications & testing"
            delay={300}
          />
          <ScoreCard
            title="Documentation"
            score={results.documentation.score}
            icon={FileCheck}
            description="Technical docs & warranties"
            delay={400}
          />
          <ScoreCard
            title="Performance Data"
            score={results.performance.score}
            icon={Gauge}
            description="Efficiency & output metrics"
            delay={500}
          />
          <ScoreCard
            title="Reliability Metrics"
            score={results.reliability.score}
            icon={Zap}
            description="Degradation & failure rates"
            delay={600}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Recommendations
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <RecommendationCard
            type={overallScore >= 75 ? "approve" : "conditional"}
            title={
              overallScore >= 75
                ? "Recommend for AVL Inclusion"
                : "Conditional Approval"
            }
            description={
              overallScore >= 75
                ? "This product meets the minimum requirements for AVL inclusion based on the IE report analysis."
                : "This product requires additional review before AVL inclusion."
            }
            details={
              overallScore >= 75
                ? [
                    "All critical certifications verified",
                    "Manufacturer financial stability confirmed",
                    "Performance data within acceptable ranges",
                  ]
                : [
                    "Documentation score below threshold",
                    "Request updated warranty terms",
                    "Verify field performance data",
                  ]
            }
            delay={700}
          />
          <RecommendationCard
            type="info"
            title="Action Items"
            description="Suggested follow-up items based on the screening analysis."
            details={[
              "Schedule follow-up review in 6 months",
              "Request updated test reports for latest batch",
              "Monitor manufacturer financial reports quarterly",
              "Verify installation references",
            ]}
            delay={800}
          />
        </div>
      </div>
    </div>
  );
}
