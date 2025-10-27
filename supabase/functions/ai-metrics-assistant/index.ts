import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, tradesContext, action } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert Trading Widget Creator AI that helps traders visualize their performance data.

USER'S TRADING CONTEXT:
${tradesContext ? JSON.stringify(tradesContext, null, 2) : 'No trading data available yet'}

CRITICAL: Return ONLY valid JSON with these EXACT field names:

OUTPUT FORMAT FOR WIDGET GENERATION:
{
  "widget": {
    "title": "Clear, actionable title",
    "description": "Brief explanation of what this shows",
    "widget_type": "metric|chart|table",
    "query_config": {
      "metric": "roi|pnl|win_rate|count",
      "aggregation": "sum|avg|count",
      "group_by": "setup|symbol|broker|hour_of_day|day_of_week",
      "order": "desc|asc",
      "limit": 10,
      "filters": {
        "date_range": "all|last_7_days|last_30_days|last_90_days",
        "trade_type": "long|short"
      }
    },
    "display_config": {
      "format": "currency|percent|number",
      "chart_type": "bar|pie",
      "show_trend": true,
      "show_rank": true
    }
  },
  "summary": "Natural language explanation"
}

WIDGET TYPE GUIDELINES:
- "metric": Single number display (total PnL, average ROI, win rate %)
- "chart": Visual comparison - use "bar" for rankings, "pie" for distributions
- "table": Detailed ranked list showing name, value, and trade count

METRIC OPTIONS:
- "roi": Return on Investment percentage (use format: "percent")
- "pnl": Profit and Loss amount (use format: "currency")
- "win_rate": Percentage of winning trades (use format: "percent")
- "count": Number of trades (use format: "number")

GROUPING OPTIONS:
- "setup": Group by trading setup strategy
- "symbol": Group by ticker symbol
- "broker": Group by broker used
- "hour_of_day": Group by hour (0-23)
- "day_of_week": Group by day name

IMPORTANT RULES:
- ONLY return the JSON object, no additional text or markdown
- Use "widget_type" NOT "visualization_type"
- Use "query_config" NOT "data_config"
- Use "display_config" NOT "display_format"
- For rankings/comparisons: use widget_type="table" or "chart"
- For single metrics: use widget_type="metric"
- Always include appropriate format (currency, percent, or number)

Current action: ${action || 'generate'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Try to parse as JSON if it looks like JSON
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                       aiResponse.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        parsedResponse = { message: aiResponse };
      }
    } catch {
      parsedResponse = { message: aiResponse };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-metrics-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
