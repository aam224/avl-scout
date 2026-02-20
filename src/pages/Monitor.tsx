import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Activity,
  Bell,
  Clock,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

type Monitor = {
  id: string;
  url: string;
  label: string;
  is_active: boolean;
  check_interval_minutes: number;
  content_hash: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  notify_email: string | null;
  notify_phone: string | null;
  notification_method: string;
  created_at: string;
  updated_at: string;
};

type ChangeLog = {
  id: string;
  monitor_id: string;
  previous_hash: string | null;
  new_hash: string;
  diff_summary: string | null;
  notified: boolean;
  notification_error: string | null;
  detected_at: string;
};

const Monitor = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notificationMethod, setNotificationMethod] = useState("email");
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [monitorsRes, logsRes] = await Promise.all([
      supabase
        .from("website_monitors")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("website_change_logs")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(50),
    ]);

    if (monitorsRes.data) {
      setMonitors(monitorsRes.data);
      if (monitorsRes.data.length > 0 && !editingMonitor) {
        const m = monitorsRes.data[0];
        setEditingMonitor(m);
        setNotifyEmail(m.notify_email || "");
        setNotifyPhone(m.notify_phone || "");
        setNotificationMethod(m.notification_method);
      }
    }
    if (logsRes.data) setChangeLogs(logsRes.data);
    setLoading(false);
  }, [editingMonitor]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveSettings = async () => {
    if (!editingMonitor) return;
    setSaving(true);

    const { error } = await supabase
      .from("website_monitors")
      .update({
        notify_email: notifyEmail || null,
        notify_phone: notifyPhone || null,
        notification_method: notificationMethod,
      })
      .eq("id", editingMonitor.id);

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Settings saved", description: "Notification settings updated." });
      fetchData();
    }
    setSaving(false);
  };

  const handleToggleActive = async (monitor: Monitor) => {
    const { error } = await supabase
      .from("website_monitors")
      .update({ is_active: !monitor.is_active })
      .eq("id", monitor.id);

    if (!error) {
      fetchData();
      toast({
        title: monitor.is_active ? "Monitor paused" : "Monitor activated",
        description: `${monitor.label} is now ${monitor.is_active ? "paused" : "active"}.`,
      });
    }
  };

  const handleCheckNow = async (monitorId: string) => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "monitor-website",
        { body: { monitorId } }
      );

      if (error) throw error;

      const result = data?.results?.[0];
      if (result?.status === "changed") {
        toast({
          title: "Change detected!",
          description: `A change was detected on the monitored page.${result.notified ? " Notification sent." : ""}`,
        });
      } else if (result?.status === "no_change") {
        toast({
          title: "No changes",
          description: "The page content has not changed since last check.",
        });
      } else if (result?.status === "fetch_error") {
        toast({
          title: "Fetch error",
          description: `Could not reach the website (HTTP ${result.httpStatus}).`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check complete",
          description: JSON.stringify(result),
        });
      }

      fetchData();
    } catch (err) {
      toast({
        title: "Check failed",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString();
  };

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-primary p-2 shadow-glow">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                AVL Scout - Website Monitor
              </h1>
              <p className="text-xs text-muted-foreground">
                Track changes on USCIS eGov
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Screener
            </Button>
          </Link>
        </div>
      </header>

      <main className="container relative mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
          {/* Monitor Cards */}
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading monitors...</p>
            </div>
          ) : (
            monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                {/* Monitor header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Activity
                      className={`h-5 w-5 ${monitor.is_active ? "text-green-400" : "text-muted-foreground"}`}
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {monitor.label}
                      </h2>
                      <a
                        href={monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {monitor.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={monitor.is_active}
                      onCheckedChange={() => handleToggleActive(monitor)}
                    />
                    <Badge
                      variant={monitor.is_active ? "default" : "secondary"}
                    >
                      {monitor.is_active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>

                {/* Status tiles */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Last Checked
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {timeAgo(monitor.last_checked_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(monitor.last_checked_at)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Last Change
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {timeAgo(monitor.last_changed_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(monitor.last_changed_at)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Check Interval
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Every {monitor.check_interval_minutes} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {monitor.content_hash
                        ? `Hash: ${monitor.content_hash.slice(0, 12)}...`
                        : "No baseline yet"}
                    </p>
                  </div>
                </div>

                {/* Check Now button */}
                <div className="mt-4">
                  <Button
                    variant="glow"
                    size="sm"
                    disabled={checking}
                    onClick={() => handleCheckNow(monitor.id)}
                  >
                    {checking ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {checking ? "Checking..." : "Check Now"}
                  </Button>
                </div>
              </div>
            ))
          )}

          {/* Notification Settings */}
          {editingMonitor && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Notification Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="notification-method">
                    Notification Method
                  </Label>
                  <Select
                    value={notificationMethod}
                    onValueChange={setNotificationMethod}
                  >
                    <SelectTrigger id="notification-method" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email only</SelectItem>
                      <SelectItem value="sms">SMS only</SelectItem>
                      <SelectItem value="both">Email + SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(notificationMethod === "email" ||
                  notificationMethod === "both") && (
                  <div>
                    <Label htmlFor="notify-email">Email Address</Label>
                    <Input
                      id="notify-email"
                      type="email"
                      placeholder="you@example.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {(notificationMethod === "sms" ||
                  notificationMethod === "both") && (
                  <div>
                    <Label htmlFor="notify-phone">Phone Number</Label>
                    <Input
                      id="notify-phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Notification Settings"}
                </Button>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Setup required for notifications:</p>
                <ul className="list-disc ml-4 space-y-0.5">
                  <li>
                    <strong>Email:</strong> Set the{" "}
                    <code className="bg-muted px-1 rounded">RESEND_API_KEY</code>{" "}
                    secret in Supabase Dashboard &gt; Edge Functions &gt; Secrets.
                    Sign up at{" "}
                    <a
                      href="https://resend.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      resend.com
                    </a>{" "}
                    (free tier available).
                  </li>
                  <li>
                    <strong>SMS:</strong> Set{" "}
                    <code className="bg-muted px-1 rounded">TWILIO_ACCOUNT_SID</code>,{" "}
                    <code className="bg-muted px-1 rounded">TWILIO_AUTH_TOKEN</code>,
                    and{" "}
                    <code className="bg-muted px-1 rounded">TWILIO_FROM_NUMBER</code>{" "}
                    in Supabase secrets.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Change History */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Change History
            </h2>

            {changeLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No changes detected yet.</p>
                <p className="text-xs mt-1">
                  Changes will appear here once the monitor detects a
                  difference.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {changeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3"
                  >
                    {log.notified ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    ) : log.notification_error ? (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          Change detected
                        </span>
                        <Badge
                          variant={log.notified ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {log.notified ? "Notified" : "Not notified"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(log.detected_at)}
                      </p>
                      {log.diff_summary && (
                        <p className="text-xs text-muted-foreground mt-1 break-all">
                          {log.diff_summary}
                        </p>
                      )}
                      {log.notification_error && (
                        <p className="text-xs text-destructive mt-1">
                          Error: {log.notification_error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cron Info */}
          <div className="rounded-2xl border border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
            <p>
              The monitor runs automatically every 60 minutes via{" "}
              <code className="bg-muted px-1 rounded">pg_cron</code>. You can
              also trigger a manual check using the "Check Now" button above.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Monitor;
