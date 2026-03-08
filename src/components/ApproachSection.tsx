import { ClipboardCheck, Map, Hammer, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Assess",
    description:
      "We start with a comprehensive audit of your current energy systems, infrastructure, and operations to establish a baseline and identify electrification opportunities.",
  },
  {
    number: "02",
    icon: Map,
    title: "Plan",
    description:
      "Our team develops a detailed electrification roadmap with phased milestones, cost-benefit analysis, incentive strategies, and risk mitigation plans tailored to your goals.",
  },
  {
    number: "03",
    icon: Hammer,
    title: "Execute",
    description:
      "We manage vendor selection, equipment procurement, utility coordination, and project implementation to ensure your electrification projects are delivered on time and on budget.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Optimize",
    description:
      "Post-deployment, we monitor system performance, optimize energy usage, and ensure you're capturing the full value of your electrification investments over time.",
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
            A proven path to{" "}
            <span className="text-gradient">electrification</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Electrification is a journey, not a single project. Our four-phase approach ensures you move at the right pace with the right strategy, reducing risk and maximizing impact at every step.
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
