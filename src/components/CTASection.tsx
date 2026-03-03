import { ArrowRight, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 md:p-12 lg:p-16 text-center">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
              Let's Work Together
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to transform your{" "}
              <span className="text-gradient">research capability</span>?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you have a specific project in mind or want to explore how AI can elevate your research and strategy function, we'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-opacity px-8 h-12 text-base"
                asChild
              >
                <a href="mailto:hello@simplergy.com">
                  <Mail className="mr-2 h-4 w-4" />
                  hello@simplergy.com
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:bg-secondary h-12 text-base px-8"
                asChild
              >
                <a href="mailto:hello@simplergy.com">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Schedule a Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                No commitment required
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Response within 24 hours
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Free initial consultation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
