import { Building2, Truck, Battery, Network, FileCheck, Landmark } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Building Electrification",
    description:
      "Transition commercial and residential buildings from gas to all-electric systems. We design heat pump strategies, electrical panel upgrades, and phased retrofit plans.",
    highlights: ["Heat Pump Design", "Panel Upgrades", "Retrofit Planning"],
  },
  {
    icon: Truck,
    title: "Fleet Electrification",
    description:
      "Plan and execute the transition of vehicle fleets to electric. From route analysis to charging infrastructure, we build a roadmap that minimizes downtime and maximizes ROI.",
    highlights: ["Fleet Assessment", "Charging Infrastructure", "TCO Analysis"],
  },
  {
    icon: Battery,
    title: "Energy Storage",
    description:
      "Right-size and deploy battery energy storage systems that reduce demand charges, provide backup power, and enable participation in grid services.",
    highlights: ["BESS Sizing", "Revenue Modeling", "Procurement Support"],
  },
  {
    icon: Network,
    title: "Grid Integration",
    description:
      "Navigate interconnection processes, utility coordination, and grid readiness assessments. We ensure your electrification projects connect smoothly and compliantly.",
    highlights: ["Interconnection", "Utility Coordination", "Load Studies"],
  },
  {
    icon: FileCheck,
    title: "Electrification Roadmapping",
    description:
      "Develop multi-year strategic plans for full electrification. We assess your current infrastructure, model scenarios, and chart the most cost-effective path forward.",
    highlights: ["Baseline Audits", "Scenario Modeling", "Capital Planning"],
  },
  {
    icon: Landmark,
    title: "Incentive & Policy Navigation",
    description:
      "Maximize the financial benefits of electrification. We identify and secure federal, state, and utility incentives including IRA tax credits and rebate programs.",
    highlights: ["IRA Tax Credits", "Utility Rebates", "Grant Applications"],
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
            End-to-end{" "}
            <span className="text-gradient">electrification</span> expertise
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From initial assessment through implementation and optimization, we provide the technical expertise and strategic guidance to electrify with confidence.
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
