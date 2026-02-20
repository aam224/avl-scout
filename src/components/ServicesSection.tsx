import { Brain, BarChart3, Search, Lightbulb, TrendingUp, Database } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Market Research",
    description:
      "AI-accelerated primary and secondary research that surfaces patterns and opportunities invisible to traditional methods.",
    highlights: ["Competitive Intelligence", "Consumer Insights", "Trend Analysis"],
  },
  {
    icon: Brain,
    title: "Strategy Consulting",
    description:
      "Data-informed strategic frameworks that help organizations navigate complexity and make high-conviction decisions.",
    highlights: ["Go-to-Market Strategy", "Growth Planning", "Scenario Modeling"],
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Turn raw data into actionable intelligence. Our AI pipelines process, analyze, and visualize complex datasets at scale.",
    highlights: ["Predictive Analytics", "Dashboard Design", "Data Engineering"],
  },
  {
    icon: Lightbulb,
    title: "Innovation Advisory",
    description:
      "Identify emerging technologies and business models that will shape your industry. Stay ahead of disruption.",
    highlights: ["Technology Scouting", "R&D Strategy", "Patent Analysis"],
  },
  {
    icon: TrendingUp,
    title: "Due Diligence",
    description:
      "Comprehensive commercial and technical due diligence powered by AI-driven analysis for confident investment decisions.",
    highlights: ["Market Sizing", "Risk Assessment", "Valuation Support"],
  },
  {
    icon: Database,
    title: "Custom AI Solutions",
    description:
      "Bespoke AI tools and models tailored to your specific research and analysis workflows. From prototype to production.",
    highlights: ["Custom Models", "Workflow Automation", "Knowledge Systems"],
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Intelligence, delivered{" "}
            <span className="text-gradient">differently</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We pair deep domain expertise with AI-native workflows to deliver research and consulting services that are faster, sharper, and more actionable.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border border-border bg-card/50 p-6 hover:bg-card hover:border-primary/20 hover:shadow-glow transition-all duration-300"
            >
              {/* Icon */}
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                <service.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {service.highlights.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-muted-foreground bg-secondary rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
