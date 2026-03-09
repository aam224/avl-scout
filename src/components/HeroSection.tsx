import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="container relative mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border mb-8 opacity-0 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Electrification Consulting
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 opacity-0 animate-fade-in animate-delay-100">
            Powering the{" "}
            <br className="hidden sm:block" />
            transition to{" "}
            <span className="text-gradient">electric</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in animate-delay-200">
            Simplergy helps organizations navigate the shift from fossil fuels to electric energy. From buildings to fleets to the grid, we make electrification simple, strategic, and achievable.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in animate-delay-300">
            <Button
              size="lg"
              className="gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-opacity px-8 h-12 text-base"
              asChild
            >
              <a href="#contact">
                Start Your Transition
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-secondary h-12 text-base px-8"
              asChild
            >
              <a href="#services">Our Services</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-fade-in animate-delay-500">
            {[
              { value: "500+", label: "MW Electrified" },
              { value: "120+", label: "Projects Delivered" },
              { value: "40%", label: "Avg. Carbon Reduction" },
              { value: "98%", label: "Client Retention" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
