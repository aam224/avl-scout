import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

const TOPIC_DISCOVERY_PROMPT = `You are a Content Strategist AI specializing in renewable energy and clean technology worldwide.

Your task is to identify 5 trending and impactful topics in the renewable energy sector globally. Consider these categories:
- Solar Energy
- Wind Energy
- Hydrogen & Fuel Cells
- Battery Storage & Energy Storage
- EV Infrastructure & Electric Mobility
- Grid Modernization & Smart Grids
- Policy & Regulation changes
- Green Finance & ESG Investing
- Emerging Technologies (fusion, wave, geothermal, etc.)
- Market Trends & Industry Analysis

For each topic, provide:
1. A compelling title
2. A detailed description (2-3 sentences)
3. The primary region it impacts
4. The category it falls under
5. A relevance score (0-100) based on timeliness and audience interest
6. Why it's trending right now
7. 2-3 source references or indicators

Return your response as a JSON array:
[
  {
    "title": "string",
    "description": "string",
    "region": "Global" | "North America" | "Europe" | "Asia Pacific" | "Middle East & Africa" | "Latin America" | "India" | "China",
    "category": "Solar" | "Wind" | "Hydrogen" | "Battery Storage" | "EV Infrastructure" | "Grid Modernization" | "Policy & Regulation" | "Green Finance" | "Emerging Tech" | "Market Trends",
    "relevance_score": number,
    "trending_reason": "string",
    "source_references": ["string", "string"]
  }
]

Focus on topics that would make excellent video/podcast content for an audience interested in renewable energy investments, technology, and market developments.`;

const SCRIPT_GENERATION_PROMPT = `You are a Content Strategist AI creating engaging scripts for renewable energy content.

Given a topic, create a compelling script suitable for a 5-7 minute video or podcast episode.

The script must include:
1. **Hook** (30 seconds): An attention-grabbing opening that creates curiosity
2. **Body** (4-5 minutes): The main content with clear structure, data points, expert perspectives, and real-world examples
3. **Call to Action** (30 seconds): What the audience should do next (subscribe, research, invest, etc.)

Also provide:
- Target audience description
- Estimated duration
- 3-5 key takeaways as bullet points

Return your response as JSON:
{
  "title": "string",
  "hook": "string (the opening hook script)",
  "body": "string (the main body script with clear paragraphs)",
  "call_to_action": "string (closing CTA script)",
  "target_audience": "string",
  "estimated_duration": "string",
  "key_takeaways": ["string", "string", "string"]
}

Write in a conversational, authoritative tone. Use data and specific examples. Make it engaging and informative.`;

async function callAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function parseJsonFromResponse(text: string): unknown {
  // Try to extract JSON from markdown code blocks or raw text
  const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("No JSON found in AI response");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topicId } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { week, year } = getCurrentWeekAndYear();

    // ─── ACTION: Discover Topics ────────────────────────────────────────
    if (action === "discover_topics") {
      console.log(`Discovering topics for week ${week}, ${year}`);

      const userPrompt = `Identify 5 trending renewable energy topics for the current week (Week ${week} of ${year}).
Focus on the most recent developments, announcements, and market movements happening right now in the global renewable energy landscape.`;

      const aiContent = await callAI(TOPIC_DISCOVERY_PROMPT, userPrompt);
      const topics = parseJsonFromResponse(aiContent) as Array<{
        title: string;
        description: string;
        region: string;
        category: string;
        relevance_score: number;
        trending_reason: string;
        source_references: string[];
      }>;

      // Store topics in database
      const topicRecords = topics.map((topic) => ({
        title: topic.title,
        description: topic.description,
        region: topic.region,
        category: topic.category,
        relevance_score: topic.relevance_score,
        trending_reason: topic.trending_reason,
        source_references: topic.source_references,
        status: "discovered",
        week_number: week,
        year: year,
      }));

      const { data: insertedTopics, error: insertError } = await supabase
        .from("content_topics")
        .insert(topicRecords)
        .select();

      if (insertError) {
        console.error("Topic insert error:", insertError);
        throw new Error(`Failed to store topics: ${insertError.message}`);
      }

      console.log(`Stored ${insertedTopics.length} topics`);

      return new Response(
        JSON.stringify({ success: true, topics: insertedTopics }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ─── ACTION: Generate Script ────────────────────────────────────────
    if (action === "generate_script") {
      if (!topicId) {
        return new Response(
          JSON.stringify({ error: "topicId is required for script generation" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Generating script for topic: ${topicId}`);

      // Fetch the topic
      const { data: topic, error: topicError } = await supabase
        .from("content_topics")
        .select("*")
        .eq("id", topicId)
        .single();

      if (topicError || !topic) {
        return new Response(
          JSON.stringify({ error: "Topic not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update topic status
      await supabase
        .from("content_topics")
        .update({ status: "script_pending" })
        .eq("id", topicId);

      const userPrompt = `Create a script for the following renewable energy topic:

Title: ${topic.title}
Description: ${topic.description}
Region: ${topic.region}
Category: ${topic.category}
Why it's trending: ${topic.trending_reason}
References: ${(topic.source_references || []).join(", ")}

Create an engaging, informative script that covers this topic comprehensively.`;

      const aiContent = await callAI(SCRIPT_GENERATION_PROMPT, userPrompt);
      const script = parseJsonFromResponse(aiContent) as {
        title: string;
        hook: string;
        body: string;
        call_to_action: string;
        target_audience: string;
        estimated_duration: string;
        key_takeaways: string[];
      };

      // Store the script
      const { data: insertedScript, error: scriptError } = await supabase
        .from("content_scripts")
        .insert({
          topic_id: topicId,
          title: script.title,
          hook: script.hook,
          body: script.body,
          call_to_action: script.call_to_action,
          target_audience: script.target_audience,
          estimated_duration: script.estimated_duration,
          key_takeaways: script.key_takeaways,
          script_type: "video",
          status: "draft",
          week_number: week,
          year: year,
        })
        .select()
        .single();

      if (scriptError) {
        console.error("Script insert error:", scriptError);
        throw new Error(`Failed to store script: ${scriptError.message}`);
      }

      // Update topic status to script_ready
      await supabase
        .from("content_topics")
        .update({ status: "script_ready" })
        .eq("id", topicId);

      console.log(`Script generated and stored: ${insertedScript.id}`);

      return new Response(
        JSON.stringify({ success: true, script: insertedScript }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ─── ACTION: Generate Weekly Brief ──────────────────────────────────
    if (action === "generate_weekly_brief") {
      console.log(`Generating weekly brief for week ${week}, ${year}`);

      // Fetch all topics for this week
      const { data: topics } = await supabase
        .from("content_topics")
        .select("*")
        .eq("week_number", week)
        .eq("year", year);

      // Fetch all scripts for this week
      const { data: scripts } = await supabase
        .from("content_scripts")
        .select("*, content_topics(*)")
        .eq("week_number", week)
        .eq("year", year);

      const topicCount = topics?.length ?? 0;
      const scriptCount = scripts?.length ?? 0;

      const summary = `Weekly Content Brief - Week ${week}, ${year}\n\n` +
        `Topics Discovered: ${topicCount}\n` +
        `Scripts Generated: ${scriptCount}\n\n` +
        `Topics:\n${(topics || []).map((t, i) => `${i + 1}. ${t.title} [${t.category}] - ${t.region} (Score: ${t.relevance_score}/100)`).join("\n")}\n\n` +
        `Scripts:\n${(scripts || []).map((s, i) => `${i + 1}. ${s.title} (${s.estimated_duration}) - Status: ${s.status}`).join("\n")}`;

      // Upsert the weekly brief
      const { data: brief, error: briefError } = await supabase
        .from("weekly_briefs")
        .upsert(
          {
            week_number: week,
            year: year,
            summary: summary,
            topic_count: topicCount,
            script_count: scriptCount,
            status: "ready",
            generated_at: new Date().toISOString(),
          },
          { onConflict: "week_number,year" }
        )
        .select()
        .single();

      if (briefError) {
        console.error("Brief upsert error:", briefError);
        throw new Error(`Failed to store brief: ${briefError.message}`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          brief,
          topics: topics || [],
          scripts: scripts || [],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action. Use: discover_topics, generate_script, or generate_weekly_brief",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in content-strategist:", error);
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
