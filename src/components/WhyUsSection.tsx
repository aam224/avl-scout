import { Shield, Leaf, Wrench, Scale } from "lucide-react";

const differentiators = [
  {
    icon: Leaf,
    title: "Deep Electrification Expertise",
    description:
      "Our team has decades of combined experience in energy systems, power engineering, and clean energy transitions. We live and breathe electrification.",
  },
  {
    icon: Scale,
    title: "Technology-Agnostic Advice",
    description:
      "We recommend the best solutions for your situation, not the ones that earn us commissions. Our independence means you get unbiased, objective guidance.",
  },
  {
    icon: Wrench,
    title: "End-to-End Support",
    description:
      "From feasibility studies and engineering design to procurement and commissioning, we stay with you through every phase of the electrification journey.",
  },
  {
    icon: Shield,
    title: "Regulatory & Incentive Mastery",
    description:
      "We navigate complex utility tariffs, building codes, emissions regulations, and incentive programs so you capture every dollar of available support.",
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
              Your trusted partner in{" "}
              <span className="text-gradient">electrification</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              The energy transition is complex. Navigating equipment choices, utility processes, incentive programs, and construction timelines requires a team that's done it before. Simplergy brings that experience to every engagement.
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
                    "Simplergy guided us through a full building electrification that cut our gas usage to zero and reduced energy costs by 35%. Their team made a complex transition feel straightforward."
                  </blockquote>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DS</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Director of Sustainability</p>
                    <p className="text-sm text-muted-foreground">Commercial Real Estate Portfolio</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-gradient">35%</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Energy cost reduction</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">100%</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Gas elimination</p>
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
