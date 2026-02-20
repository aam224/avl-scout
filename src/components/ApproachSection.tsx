import { Cpu, Users, Zap, Target } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Scope & Define",
    description:
      "We start by deeply understanding your challenge. Our team works with you to frame the right questions and define clear success criteria.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI-Powered Research",
    description:
      "Our proprietary AI systems process vast datasets, academic literature, market signals, and unstructured data to surface insights at unprecedented speed.",
  },
  {
    number: "03",
    icon: Users,
    title: "Expert Analysis",
    description:
      "Senior consultants with deep industry expertise review, contextualize, and synthesize AI-generated insights into actionable recommendations.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Deliver & Iterate",
    description:
      "We deliver clear, compelling outputs and work alongside your team to implement findings. Continuous feedback loops ensure lasting impact.",
  },
];

export const ApproachSection = () => {
  return (
    <section id="approach" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Our Approach
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Human expertise,{" "}
            <span className="text-gradient">amplified by AI</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We don't replace human judgment with AI. We amplify it. Our approach combines the pattern-recognition power of AI with the contextual understanding of experienced consultants.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line (hidden on mobile, shown on lg) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(100%_-_12px)] w-[calc(100%_-_44px)] h-px bg-border z-0" />
              )}

              <div className="relative rounded-2xl border border-border bg-card/50 p-6 hover:bg-card hover:border-primary/20 transition-all duration-300 h-full">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary tracking-widest">
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
