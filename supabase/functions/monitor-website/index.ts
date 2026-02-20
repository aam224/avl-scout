import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Optional: set these in Supabase Dashboard > Edge Functions > Secrets
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
const NOTIFICATION_FROM_EMAIL =
  Deno.env.get("NOTIFICATION_FROM_EMAIL") || "monitor@resend.dev";

/**
 * Hash a string using the Web Crypto API (SHA-256).
 */
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Strip HTML tags and normalize whitespace to get a stable text
 * representation for change detection.
 */
function normalizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "") // remove scripts
    .replace(/<style[\s\S]*?<\/style>/gi, "") // remove styles
    .replace(/<!--[\s\S]*?-->/g, "") // remove comments
    .replace(/<[^>]+>/g, " ") // strip remaining tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Send email notification via Resend API.
 */
async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFICATION_FROM_EMAIL,
        to: [to],
        subject,
        html: body,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `Resend API ${res.status}: ${errText}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/**
 * Send SMS notification via Twilio API.
 */
async function sendSms(
  to: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return { ok: false, error: "Twilio credentials not configured" };
  }
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_FROM_NUMBER,
        To: to,
        Body: message,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `Twilio API ${res.status}: ${errText}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/**
 * Send notification based on monitor configuration.
 */
async function notify(
  monitor: {
    notification_method: string;
    notify_email: string | null;
    notify_phone: string | null;
    label: string;
    url: string;
  },
  diffSummary: string
): Promise<{ notified: boolean; error?: string }> {
  const errors: string[] = [];
  let notified = false;

  const subject = `Website Change Detected: ${monitor.label}`;
  const emailBody = `
    <h2>Change Detected on ${monitor.label}</h2>
    <p><strong>URL:</strong> <a href="${monitor.url}">${monitor.url}</a></p>
    <p><strong>Detected at:</strong> ${new Date().toISOString()}</p>
    <h3>Summary</h3>
    <p>${diffSummary}</p>
    <p style="color:#666;font-size:12px;">This is an automated alert from your AVL Scout website monitor.</p>
  `;
  const smsBody = `[AVL Scout] Change detected on ${monitor.label} (${monitor.url}) at ${new Date().toLocaleString()}. ${diffSummary}`;

  if (
    (monitor.notification_method === "email" ||
      monitor.notification_method === "both") &&
    monitor.notify_email
  ) {
    const result = await sendEmail(monitor.notify_email, subject, emailBody);
    if (result.ok) {
      notified = true;
    } else {
      errors.push(`Email: ${result.error}`);
    }
  }

  if (
    (monitor.notification_method === "sms" ||
      monitor.notification_method === "both") &&
    monitor.notify_phone
  ) {
    const result = await sendSms(monitor.notify_phone, smsBody);
    if (result.ok) {
      notified = true;
    } else {
      errors.push(`SMS: ${result.error}`);
    }
  }

  return {
    notified,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Optionally accept a specific monitor ID, otherwise check all active monitors
    let monitorId: string | null = null;
    try {
      const body = await req.json();
      monitorId = body?.monitorId ?? null;
    } catch {
      // No body — check all active monitors
    }

    // Fetch monitors to check
    let query = supabase
      .from("website_monitors")
      .select("*")
      .eq("is_active", true);

    if (monitorId) {
      query = query.eq("id", monitorId);
    }

    const { data: monitors, error: fetchError } = await query;
    if (fetchError) {
      console.error("Error fetching monitors:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch monitors" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!monitors || monitors.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active monitors found" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const monitor of monitors) {
      console.log(`Checking: ${monitor.label} (${monitor.url})`);

      try {
        // Fetch the website
        const response = await fetch(monitor.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; AVLScout-Monitor/1.0; +https://avl-scout.app)",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          console.error(
            `Failed to fetch ${monitor.url}: ${response.status}`
          );
          results.push({
            monitorId: monitor.id,
            label: monitor.label,
            status: "fetch_error",
            httpStatus: response.status,
          });
          continue;
        }

        const html = await response.text();
        const normalizedContent = normalizeHtml(html);
        const newHash = await hashContent(normalizedContent);

        // Update last_checked_at
        await supabase
          .from("website_monitors")
          .update({ last_checked_at: new Date().toISOString() })
          .eq("id", monitor.id);

        if (monitor.content_hash && monitor.content_hash !== newHash) {
          // Change detected!
          console.log(`Change detected on ${monitor.label}`);

          const diffSummary = `The content of ${monitor.url} has changed since the last check. Previous hash: ${monitor.content_hash.slice(0, 12)}... New hash: ${newHash.slice(0, 12)}...`;

          // Send notification
          const { notified, error: notifyError } = await notify(
            monitor,
            diffSummary
          );

          // Log the change
          await supabase.from("website_change_logs").insert({
            monitor_id: monitor.id,
            previous_hash: monitor.content_hash,
            new_hash: newHash,
            diff_summary: diffSummary,
            notified,
            notification_error: notifyError || null,
          });

          // Update stored hash and last_changed_at
          await supabase
            .from("website_monitors")
            .update({
              content_hash: newHash,
              last_changed_at: new Date().toISOString(),
            })
            .eq("id", monitor.id);

          results.push({
            monitorId: monitor.id,
            label: monitor.label,
            status: "changed",
            notified,
            notifyError: notifyError || null,
          });
        } else {
          // No change — store hash if this is the first check
          if (!monitor.content_hash) {
            await supabase
              .from("website_monitors")
              .update({ content_hash: newHash })
              .eq("id", monitor.id);
          }

          results.push({
            monitorId: monitor.id,
            label: monitor.label,
            status: "no_change",
          });
        }
      } catch (monitorError) {
        console.error(
          `Error checking ${monitor.label}:`,
          monitorError
        );
        results.push({
          monitorId: monitor.id,
          label: monitor.label,
          status: "error",
          error: String(monitorError),
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in monitor-website:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
