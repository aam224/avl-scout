import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Shield,
  Database,
  ArrowLeft,
  Battery,
  Sun,
  Zap,
  PlugZap,
  Building2,
  Globe,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Award,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEquipmentDetail, useDeleteEquipment } from "@/hooks/use-equipment";
import { isDataStale, getStatusColor } from "@/types/equipment";
import { BessSpecsView } from "@/components/equipment/BessSpecsView";
import { SolarSpecsView } from "@/components/equipment/SolarSpecsView";
import { InverterSpecsView } from "@/components/equipment/InverterSpecsView";
import { EvChargerSpecsView } from "@/components/equipment/EvChargerSpecsView";
import { ChangelogView } from "@/components/equipment/ChangelogView";
import { useToast } from "@/hooks/use-toast";

const typeIcons: Record<string, React.ElementType> = {
  BESS: Battery,
  "Solar Panel": Sun,
  Inverter: Zap,
  "EV Charger": PlugZap,
};

const EquipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: equipment, isLoading, error } = useEquipmentDetail(id);
  const deleteEquipment = useDeleteEquipment();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this equipment record?")) return;

    try {
      await deleteEquipment.mutateAsync(id);
      toast({ title: "Equipment deleted", description: "The record has been removed." });
      navigate("/equipment");
    } catch {
      toast({
        title: "Delete failed",
        description: "Failed to delete the equipment record.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Equipment not found.</p>
        <Link to="/equipment">
          <Button variant="outline">Back to Database</Button>
        </Link>
      </div>
    );
  }

  const TypeIcon = typeIcons[equipment.product_type] ?? Zap;
  const stale = isDataStale(equipment.data_collected_at);

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
                <p className="text-xs text-muted-foreground">IE Report Analysis Tool</p>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">Screening</Button>
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
        {/* Breadcrumb */}
        <Link
          to="/equipment"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Equipment Database
        </Link>

        {/* Product Header */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-4">
                <TypeIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{equipment.model_name}</h2>
                {equipment.model_number && (
                  <p className="text-sm text-muted-foreground font-mono mt-0.5">
                    {equipment.model_number}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {equipment.manufacturers?.name}
                  </span>
                  {equipment.manufacturers?.country && (
                    <>
                      <span className="text-muted-foreground">|</span>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {equipment.manufacturers.country}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete equipment">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {equipment.description && (
            <p className="text-sm text-muted-foreground mb-4">{equipment.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className={getStatusColor(equipment.status)}>
              {equipment.status}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {equipment.product_type}
            </Badge>
            {equipment.release_year && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Released {equipment.release_year}
              </span>
            )}
            {equipment.warranty_years && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="h-3 w-3" />
                {equipment.warranty_years}-year warranty
              </span>
            )}
          </div>

          {/* Data quality indicators */}
          <div className="flex flex-wrap items-center gap-4 text-xs border-t border-border pt-4">
            {equipment.data_verified ? (
              <span className="flex items-center gap-1 text-score-excellent">
                <ShieldCheck className="h-4 w-4" />
                Data Verified
                {equipment.data_last_verified_at && (
                  <span className="text-muted-foreground ml-1">
                    ({new Date(equipment.data_last_verified_at).toLocaleDateString()})
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-score-warning">
                <ShieldAlert className="h-4 w-4" />
                Unverified Data
              </span>
            )}
            {stale && (
              <span className="flex items-center gap-1 text-score-warning">
                <AlertTriangle className="h-4 w-4" />
                Data may be stale (collected {new Date(equipment.data_collected_at).toLocaleDateString()})
              </span>
            )}
            {equipment.data_source && (
              <span className="text-muted-foreground">
                Source: {equipment.data_source}
                {equipment.data_source_url && (
                  <a
                    href={equipment.data_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 ml-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </span>
            )}
          </div>

          {/* Certifications */}
          {equipment.certifications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                Certifications
              </p>
              <div className="flex flex-wrap gap-1.5">
                {equipment.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Regions */}
          {equipment.regions_available.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Available Regions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {equipment.regions_available.map((region) => (
                  <Badge key={region} variant="outline" className="text-xs">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Technical Specifications</h3>
          {equipment.product_type === "BESS" && equipment.bess_specs && (
            <BessSpecsView specs={equipment.bess_specs} />
          )}
          {equipment.product_type === "Solar Panel" && equipment.solar_panel_specs && (
            <SolarSpecsView specs={equipment.solar_panel_specs} />
          )}
          {equipment.product_type === "Inverter" && equipment.inverter_specs && (
            <InverterSpecsView specs={equipment.inverter_specs} />
          )}
          {equipment.product_type === "EV Charger" && equipment.ev_charger_specs && (
            <EvChargerSpecsView specs={equipment.ev_charger_specs} />
          )}
        </div>

        {/* Changelog */}
        {id && <ChangelogView equipmentId={id} />}
      </main>
    </div>
  );
};

export default EquipmentDetail;
