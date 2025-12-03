import { useState, useCallback } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ProductTypeSelect } from "@/components/ProductTypeSelect";
import { RegionSelect } from "@/components/RegionSelect";
import { ProcessingState } from "@/components/ProcessingState";
import { ScreeningResults } from "@/components/ScreeningResults";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AppState = "upload" | "processing" | "results";

const Index = () => {
  const [state, setState] = useState<AppState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productType, setProductType] = useState("");
  const [region, setRegion] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setSessionId(null);
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);

    try {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("ie-reports")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("ie-reports")
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      // Create screening session with status "uploaded"
      const { data: session, error: sessionError } = await supabase
        .from("screening_sessions")
        .insert({
          product_type: "BESS", // Default, will be updated when user selects
          region: "US", // Default, will be updated when user selects
          status: "uploaded",
          file_url: fileUrl,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSessionId(session.id);
      toast({
        title: "File uploaded",
        description: "Your IE report has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
      });
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !productType || !region || !sessionId) return;

    // Update session with selected product type and region
    await supabase
      .from("screening_sessions")
      .update({ product_type: productType, region: region, status: "processing" })
      .eq("id", sessionId);

    setState("processing");
    setProcessingStep(0);

    // Simulate processing steps
    const stepDuration = 1500;
    setTimeout(() => setProcessingStep(1), stepDuration);
    setTimeout(() => setProcessingStep(2), stepDuration * 2);
    setTimeout(async () => {
      // Update session status to completed
      await supabase
        .from("screening_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId);
      setState("results");
    }, stepDuration * 3);
  }, [selectedFile, productType, region, sessionId]);

  const handleReset = useCallback(() => {
    setState("upload");
    setSelectedFile(null);
    setProductType("");
    setRegion("");
    setProcessingStep(0);
    setSessionId(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-primary p-2 shadow-glow">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">AVL Screener</h1>
              <p className="text-xs text-muted-foreground">
                IE Report Analysis Tool
              </p>
            </div>
          </div>
          {state === "results" && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              New Analysis
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-8">
        {state === "upload" && (
          <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="mb-3 text-3xl font-bold text-foreground">
                Upload IE Report for{" "}
                <span className="text-gradient">AVL Screening</span>
              </h2>
              <p className="text-muted-foreground">
                Upload an Independent Engineering report to automatically screen
                products against AVL criteria and receive detailed scoring with
                recommendations.
              </p>
            </div>

            {/* Upload Section */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="space-y-6">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  isUploading={isUploading}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <ProductTypeSelect
                    value={productType}
                    onChange={setProductType}
                  />
                  <RegionSelect
                    value={region}
                    onChange={setRegion}
                  />
                </div>

                <Button
                  variant="glow"
                  size="lg"
                  className="w-full"
                  disabled={!selectedFile || !productType || !region || isUploading}
                  onClick={handleAnalyze}
                >
                  <Zap className="h-5 w-5" />
                  Analyze Report
                </Button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Fast Analysis",
                  description:
                    "Get comprehensive results in under a minute",
                },
                {
                  title: "AVL Criteria",
                  description: "Automatic screening against vendor list standards",
                },
                {
                  title: "Detailed Scores",
                  description: "Breakdown by category with recommendations",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card/50 p-4 text-center"
                >
                  <h3 className="mb-1 font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "processing" && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-border bg-card shadow-card">
              <ProcessingState step={processingStep} />
            </div>
          </div>
        )}

        {state === "results" && <ScreeningResults productType={productType} />}
      </main>
    </div>
  );
};

export default Index;
