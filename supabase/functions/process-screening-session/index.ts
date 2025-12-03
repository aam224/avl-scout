import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const AVL_SCREENING_PROMPT = `You are an AVL (Approved Vendor List) screening expert analyzing Independent Engineering reports.

Your task is to evaluate the product/vendor against standard AVL criteria and provide structured scoring.

Analyze the following aspects and provide scores from 0-100:
1. **Technical Compliance**: Does the product meet technical specifications?
2. **Quality Assurance**: Evidence of quality management systems, certifications (ISO, UL, etc.)
3. **Financial Stability**: Vendor's financial health indicators
4. **Manufacturing Capability**: Production capacity, facilities, supply chain
5. **Track Record**: Historical performance, references, project experience
6. **Warranty & Support**: Warranty terms, service network, technical support

Return your analysis as a JSON object with this exact structure:
{
  "overall_score": <number 0-100>,
  "recommendation": "approve" | "conditional" | "reject",
  "scores": {
    "technical_compliance": <number 0-100>,
    "quality_assurance": <number 0-100>,
    "financial_stability": <number 0-100>,
    "manufacturing_capability": <number 0-100>,
    "track_record": <number 0-100>,
    "warranty_support": <number 0-100>
  },
  "findings": [
    {
      "category": "<category name>",
      "finding": "<brief finding>",
      "severity": "high" | "medium" | "low"
    }
  ],
  "summary": "<2-3 sentence executive summary>"
}

If the document doesn't contain enough information for certain criteria, score them as 50 (neutral) and note the missing information in findings.`;

// Simple PDF text extraction - extracts readable text from PDF binary
async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(pdfBuffer);
  const text: string[] = [];
  
  // Simple text extraction by finding text streams in PDF
  let i = 0;
  while (i < bytes.length) {
    // Look for text stream markers
    if (bytes[i] === 0x42 && bytes[i + 1] === 0x54) { // "BT" - Begin Text
      let textContent = "";
      i += 2;
      while (i < bytes.length - 1) {
        if (bytes[i] === 0x45 && bytes[i + 1] === 0x54) { // "ET" - End Text
          break;
        }
        // Extract readable ASCII characters
        if (bytes[i] >= 32 && bytes[i] <= 126) {
          textContent += String.fromCharCode(bytes[i]);
        } else if (bytes[i] === 10 || bytes[i] === 13) {
          textContent += " ";
        }
        i++;
      }
      if (textContent.trim()) {
        text.push(textContent.trim());
      }
    }
    i++;
  }

  // Also try to extract any plain text content
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const rawText = decoder.decode(bytes);
  
  // Extract text between parentheses (common in PDF text objects)
  const parenMatches = rawText.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    parenMatches.forEach((match) => {
      const content = match.slice(1, -1);
      if (content.length > 2 && /[a-zA-Z]/.test(content)) {
        text.push(content);
      }
    });
  }

  // Extract text from stream objects
  const streamMatches = rawText.match(/stream\s*([\s\S]*?)\s*endstream/g);
  if (streamMatches) {
    streamMatches.forEach((match) => {
      const cleaned = match
        .replace(/stream\s*/, "")
        .replace(/\s*endstream/, "")
        .replace(/[^\x20-\x7E\n\r]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned.length > 20 && /[a-zA-Z]{3,}/.test(cleaned)) {
        text.push(cleaned);
      }
    });
  }

  return text.join("\n").slice(0, 50000); // Limit to ~50k chars
}

function cleanAndTruncateText(text: string, maxLength: number = 30000): string {
  // Remove excessive whitespace and special characters
  let cleaned = text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, " ") // Control characters
    .replace(/\s+/g, " ") // Multiple spaces
    .replace(/(\r\n|\n|\r)/g, "\n") // Normalize line endings
    .trim();

  // Truncate to max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength) + "\n\n[Document truncated for analysis]";
  }

  return cleaned;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "sessionId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing session: ${sessionId}`);

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch the ScreeningSession
    const { data: session, error: sessionError } = await supabase
      .from("screening_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("Session fetch error:", sessionError);
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found session for product type: ${session.product_type}`);

    // Update status to processing
    await supabase
      .from("screening_sessions")
      .update({ status: "processing" })
      .eq("id", sessionId);

    // 2. Fetch the PDF file
    if (!session.file_url) {
      await supabase
        .from("screening_sessions")
        .update({ status: "error" })
        .eq("id", sessionId);
      return new Response(
        JSON.stringify({ error: "No file URL found for session" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching PDF from: ${session.file_url}`);
    const pdfResponse = await fetch(session.file_url);
    if (!pdfResponse.ok) {
      await supabase
        .from("screening_sessions")
        .update({ status: "error" })
        .eq("id", sessionId);
      return new Response(
        JSON.stringify({ error: "Failed to fetch PDF file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log(`PDF fetched, size: ${pdfBuffer.byteLength} bytes`);

    // 3. Extract text from PDF
    let extractedText = await extractTextFromPdf(pdfBuffer);
    console.log(`Extracted text length: ${extractedText.length}`);

    // If extraction yielded little text, provide context from metadata
    if (extractedText.length < 100) {
      extractedText = `[PDF text extraction limited - analyzing based on available metadata]
Product Type: ${session.product_type}
Region: ${session.region}
File: ${session.file_url}`;
    }

    // 4. Clean and truncate the text
    const cleanedText = cleanAndTruncateText(extractedText);
    console.log(`Cleaned text length: ${cleanedText.length}`);

    // Save the cleaned text to llm_input_text
    await supabase
      .from("screening_sessions")
      .update({ llm_input_text: cleanedText })
      .eq("id", sessionId);

    // 5. Call the LLM with system prompt for AVL screening
    const userPrompt = `Analyze this Independent Engineering report for AVL screening.

Product Type: ${session.product_type}
Region: ${session.region}

Document Content:
${cleanedText}

Provide your AVL screening analysis as JSON.`;

    console.log("Calling Lovable AI...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: AVL_SCREENING_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        await supabase
          .from("screening_sessions")
          .update({ status: "error" })
          .eq("id", sessionId);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        await supabase
          .from("screening_sessions")
          .update({ status: "error" })
          .eq("id", sessionId);
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase
        .from("screening_sessions")
        .update({ status: "error" })
        .eq("id", sessionId);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    console.log("AI response received");

    // Parse the JSON from AI response
    let scoresJson;
    try {
      // Extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scoresJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Create a fallback response
      scoresJson = {
        overall_score: 50,
        recommendation: "conditional",
        scores: {
          technical_compliance: 50,
          quality_assurance: 50,
          financial_stability: 50,
          manufacturing_capability: 50,
          track_record: 50,
          warranty_support: 50,
        },
        findings: [
          {
            category: "Analysis",
            finding: "Unable to parse detailed analysis. Manual review recommended.",
            severity: "medium",
          },
        ],
        summary: "Analysis completed with limited data extraction. Manual review is recommended for comprehensive evaluation.",
      };
    }

    // 6. Save results and set status to completed
    const { error: updateError } = await supabase
      .from("screening_sessions")
      .update({
        scores_json: scoresJson,
        status: "completed",
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save results" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Session ${sessionId} completed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        sessionId,
        scores: scoresJson,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-screening-session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
