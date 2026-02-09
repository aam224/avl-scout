import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Database,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipmentStatsBar } from "@/components/equipment/EquipmentStatsBar";
import { EquipmentFiltersBar } from "@/components/equipment/EquipmentFiltersBar";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { useEquipmentList } from "@/hooks/use-equipment";
import { seedEquipmentDatabase } from "@/data/seed-equipment";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { EquipmentFilters } from "@/types/equipment";

const EquipmentDatabase = () => {
  const [filters, setFilters] = useState<EquipmentFilters>({});
  const [isSeeding, setIsSeeding] = useState(false);
  const { data: equipment, isLoading } = useEquipmentList(filters);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSeed = useCallback(async () => {
    setIsSeeding(true);
    try {
      const result = await seedEquipmentDatabase();
      if (result.success) {
        toast({
          title: "Database seeded",
          description: `Created ${result.manufacturersCreated} manufacturers and ${result.equipmentCreated} products.`,
        });
      } else {
        toast({
          title: "Seeding completed with errors",
          description: `${result.equipmentCreated} products created. ${result.errors.length} errors occurred.`,
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["equipment-stats"] });
    } catch (error) {
      toast({
        title: "Seeding failed",
        description: "Failed to seed the equipment database. Check console for details.",
        variant: "destructive",
      });
      console.error("Seed error:", error);
    } finally {
      setIsSeeding(false);
    }
  }, [toast, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="rounded-lg gradient-primary p-2 shadow-glow">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">AVL Screener</h1>
                <p className="text-xs text-muted-foreground">
                  IE Report Analysis Tool
                </p>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Screening
              </Button>
            </Link>
            <Link to="/equipment">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                <Database className="h-4 w-4" />
                Equipment DB
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-8 space-y-6">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Energy Equipment Database
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive product intelligence for BESS, Solar, Inverters, and EV Chargers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isSeeding ? "Seeding..." : "Seed Database"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <EquipmentStatsBar />

        {/* Filters */}
        <EquipmentFiltersBar filters={filters} onChange={setFilters} />

        {/* Equipment Grid */}
        <EquipmentGrid equipment={equipment} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default EquipmentDatabase;
