import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Search,
  Loader2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/TopicCard";
import { ScriptViewer } from "@/components/ScriptViewer";
import { WeeklyBriefPanel } from "@/components/WeeklyBriefPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Topic {
  id: string;
  title: string;
  description: string;
  region: string;
  category: string;
  relevance_score: number;
  trending_reason: string | null;
  source_references: string[] | null;
  status: string;
  week_number: number;
  year: number;
  created_at: string;
}

interface Script {
  id: string;
  topic_id: string | null;
  title: string;
  hook: string;
  body: string;
  call_to_action: string;
  target_audience: string;
  estimated_duration: string;
  key_takeaways: string[];
  script_type: string;
  status: string;
  week_number: number;
  year: number;
  created_at: string;
}

interface WeeklyBrief {
  id: string;
  week_number: number;
  year: number;
  summary: string;
  topic_count: number;
  script_count: number;
  status: string;
  generated_at: string | null;
}

function getCurrentWeekAndYear(): { week: number; year: number } {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return { week, year };
}

const ContentStrategist = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [weeklyBrief, setWeeklyBrief] = useState<WeeklyBrief | null>(null);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [generatingScriptFor, setGeneratingScriptFor] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { week, year } = getCurrentWeekAndYear();

  const fetchData = useCallback(async () => {
    const [topicsRes, scriptsRes, briefRes] = await Promise.all([
      supabase
        .from("content_topics")
        .select("*")
        .eq("week_number", week)
        .eq("year", year)
        .order("relevance_score", { ascending: false }),
      supabase
        .from("content_scripts")
        .select("*")
        .eq("week_number", week)
        .eq("year", year)
        .order("created_at", { ascending: false }),
      supabase
        .from("weekly_briefs")
        .select("*")
        .eq("week_number", week)
        .eq("year", year)
        .maybeSingle(),
    ]);

    if (topicsRes.data) setTopics(topicsRes.data as Topic[]);
    if (scriptsRes.data) setScripts(scriptsRes.data as Script[]);
    if (briefRes.data) setWeeklyBrief(briefRes.data as WeeklyBrief);
    setLoading(false);
  }, [week, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDiscoverTopics = useCallback(async () => {
    setIsDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "content-strategist",
        { body: { action: "discover_topics" } }
      );

      if (error) throw error;

      toast({
        title: "Topics Discovered",
        description: `Found ${data.topics?.length || 0} trending renewable energy topics.`,
      });

      await fetchData();
    } catch (error) {
      console.error("Topic discovery error:", error);
      toast({
        title: "Discovery Failed",
        description: "Failed to discover topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  }, [toast, fetchData]);

  const handleGenerateScript = useCallback(
    async (topicId: string) => {
      setGeneratingScriptFor(topicId);
      try {
        const { data, error } = await supabase.functions.invoke(
          "content-strategist",
          { body: { action: "generate_script", topicId } }
        );

        if (error) throw error;

        toast({
          title: "Script Generated",
          description: `Script "${data.script?.title}" is ready for review.`,
        });

        await fetchData();
      } catch (error) {
        console.error("Script generation error:", error);
        toast({
          title: "Script Generation Failed",
          description: "Failed to generate script. Please try again.",
          variant: "destructive",
        });
      } finally {
        setGeneratingScriptFor(null);
      }
    },
    [toast, fetchData]
  );

  const handleGenerateBrief = useCallback(async () => {
    setIsGeneratingBrief(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "content-strategist",
        { body: { action: "generate_weekly_brief" } }
      );

      if (error) throw error;

      toast({
        title: "Weekly Brief Ready",
        description: `Brief for Week ${week} is ready.`,
      });

      await fetchData();
    } catch (error) {
      console.error("Brief generation error:", error);
      toast({
        title: "Brief Generation Failed",
        description: "Failed to generate weekly brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBrief(false);
    }
  }, [toast, fetchData, week]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-1">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="rounded-lg gradient-primary p-2 shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                Content Strategist
              </h1>
              <p className="text-xs text-muted-foreground">
                Renewable Energy Content Agent - Week {week}, {year}
              </p>
            </div>
          </div>
          <Button
            variant="glow"
            size="sm"
            onClick={handleDiscoverTopics}
            disabled={isDiscovering}
          >
            {isDiscovering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Discover Topics
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Topics & Scripts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Topics Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Trending Topics
                </h2>
                <span className="text-sm text-muted-foreground">
                  {topics.length} topics this week
                </span>
              </div>

              {topics.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      description={topic.description}
                      region={topic.region}
                      category={topic.category}
                      relevanceScore={topic.relevance_score}
                      trendingReason={topic.trending_reason}
                      status={topic.status}
                      onGenerateScript={handleGenerateScript}
                      isGenerating={generatingScriptFor === topic.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">
                    No topics yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click "Discover Topics" to find trending renewable energy
                    topics worldwide.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDiscoverTopics}
                    disabled={isDiscovering}
                  >
                    {isDiscovering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Discover Topics
                  </Button>
                </div>
              )}
            </div>

            {/* Scripts Section */}
            {scripts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Generated Scripts
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {scripts.length} scripts this week
                  </span>
                </div>
                <div className="space-y-3">
                  {scripts.map((script) => (
                    <div
                      key={script.id}
                      className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedScript(script)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-lg bg-primary/20 p-2 shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {script.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {script.estimated_duration} &middot;{" "}
                            {script.script_type} &middot;{" "}
                            {script.key_takeaways.length} takeaways
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Weekly Brief */}
          <div>
            <WeeklyBriefPanel
              brief={weeklyBrief}
              onGenerate={handleGenerateBrief}
              isGenerating={isGeneratingBrief}
            />
          </div>
        </div>
      </main>

      {/* Script Viewer Modal */}
      {selectedScript && (
        <ScriptViewer
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}
    </div>
  );
};

export default ContentStrategist;
