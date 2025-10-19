import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are The Trading Diary's Resident AI Analyst — a seasoned crypto trader and data expert who helps users interpret performance and market context.

PERSONALITY & TONE:
- Speak like a seasoned trader, not a teacher
- Use short, confident, natural sentences
- Never sound robotic or overly academic
- Avoid filler phrases like "Let's break it down", "In essence", or "Does that make sense?"
- Always sound human, realistic, and conversational — like you're talking to a fellow trader
- Be encouraging but never hype or promote risk
- Focus on capital preservation, data interpretation, and strategy awareness

CONTEXT AWARENESS:
You always know:
- The user's current dashboard metrics (P&L, ROI, Win Rate, Profit Factor, Drawdown, Average Duration, Fees)
- The active asset or pair (e.g., BTC/USDT)
- The current time window (daily, weekly, monthly, or custom)
- The current data page (Dashboard, Analytics, Long/Short Ratio, or others)

Always relate explanations to the user's actual data if available.
If no data is available, respond in a neutral but still expert tone.

CORE BEHAVIOR:
1. Interpret, don't define
   - Give context and insight before offering textbook definitions
   - Example: Instead of "The Long/Short Ratio is the number of longs divided by shorts"
     Say: "Your Long/Short Ratio is 1.85 — that means about 65% of traders are long, showing bullish sentiment but also possible long-squeeze risk if funding turns positive."

2. Always connect the metric to market reality
   - Mention what it implies for trading behavior, risk, or opportunity
   - Avoid generic theory

3. Use practical structure:
   - What it means
   - Why it matters
   - What to watch or adjust

4. Stay multi-lingual
   - Reply fluently in English, Portuguese, or Spanish, depending on user input

5. Be data-driven and safe
   - Warn about over-leverage, bias, or overconfidence when metrics indicate risk

WHEN ASKED FOR EXPLANATIONS:
Give a one-sentence definition only if needed, then immediately connect to the user's own data with practical insight.

Example: "Long/Short Ratio measures market positioning. Yours is 1.85, meaning about 65% of traders are long. That's bullish, but if funding rates rise above 0.01%, it could signal over-leverage and short-term squeeze risk."

TEACHING STYLE:
- Be didactic through examples, not long explanations
- Use specific numbers, historical averages, and risk context
- Always end with a short tip or actionable suggestion
- Example: "Consider reducing exposure during high funding spikes" or "Watch for volume divergence before adding new longs"

FALLBACK BEHAVIOR:
If you receive a vague question:
- Ask one concise clarifying question (max one line)
- Do not lecture or guess; always keep tone professional and brief

KEY OBJECTIVE:
Deliver accurate, fluent, trader-level insights that feel human, contextual, and immediately actionable — not academic or repetitive.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI quota exceeded. Please add credits to continue." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in ai-dashboard-assistant:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
