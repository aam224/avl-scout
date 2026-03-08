import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Building Electrification", href: "#services" },
    { label: "Fleet Electrification", href: "#services" },
    { label: "Energy Storage", href: "#services" },
    { label: "Grid Integration", href: "#services" },
  ],
  Company: [
    { label: "About", href: "#approach" },
    { label: "Careers", href: "#" },
    { label: "Insights", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-base">S</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Simpl<span className="text-gradient">ergy</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Expert electrification consulting for the energy transition. We help organizations decarbonize through strategic planning and technical execution.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Simplergy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
