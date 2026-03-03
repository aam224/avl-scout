import { Shield, Clock, Eye, LineChart } from "lucide-react";

const differentiators = [
  {
    icon: Clock,
    title: "Speed Without Compromise",
    description:
      "AI-accelerated workflows deliver research in days, not weeks. You get the depth of traditional consulting at the speed your business demands.",
  },
  {
    icon: Eye,
    title: "Deeper Pattern Recognition",
    description:
      "Our AI systems analyze millions of data points to surface non-obvious patterns and connections that manual research simply cannot find.",
  },
  {
    icon: Shield,
    title: "Rigorous & Transparent",
    description:
      "Every insight is traceable to its source. We provide full methodology documentation so you can trust and defend the findings.",
  },
  {
    icon: LineChart,
    title: "Built for Action",
    description:
      "We don't deliver shelf-ware. Every engagement is designed to produce clear, prioritized recommendations that drive real business outcomes.",
  },
];

export const WhyUsSection = () => {
  return (
    <section id="why-us" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
              Why Simplergy
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              The new standard for{" "}
              <span className="text-gradient">research & consulting</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Traditional consulting is slow, expensive, and often disconnected from the data. Simplergy was built to change that. We bring together AI-native research capabilities with senior-level strategic thinking.
            </p>

            <div className="space-y-6">
              {differentiators.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card/50 p-8 lg:p-10">
              {/* Decorative grid */}
              <div className="absolute inset-0 rounded-2xl bg-grid opacity-20" />

              <div className="relative space-y-8">
                {/* Testimonial quote */}
                <div>
                  <blockquote className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                    "Simplergy delivered in two weeks what would have taken our internal team three months. The AI-powered analysis uncovered market segments we hadn't even considered."
                  </blockquote>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VP</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">VP of Strategy</p>
                    <p className="text-sm text-muted-foreground">Fortune 500 Energy Company</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-gradient">85%</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Faster time-to-insight</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">3.2x</div>
                    <p className="text-xs text-muted-foreground mt-0.5">ROI on engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
