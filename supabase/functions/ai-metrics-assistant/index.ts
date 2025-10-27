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

    const systemPrompt = `You are an expert Trading Analyst AI with exceptional mathematical reasoning and trading domain expertise.

USER'S COMPLETE TRADE DATA:
${tradesContext ? JSON.stringify(tradesContext, null, 2) : 'No trading data available yet'}

YOUR ROLE: When users ask questions about their trading performance, you THINK THROUGH the calculation step-by-step, EXPLAIN your reasoning, and PROVIDE the answer with full transparency.

CRITICAL: Return ONLY valid JSON with these EXACT formats:

=== FORMAT 1: CALCULATED METRIC WIDGET ===
Use this when user asks for a specific calculation (e.g., "revenue per hour", "profit factor", "average win"):

{
  "widget": {
    "title": "Clear, actionable title",
    "description": "Brief explanation of what this shows",
    "widget_type": "metric",
    "calculated_value": 17.42,
    "calculation": {
      "method": "Total PnL / Trading Hours Elapsed",
      "steps": [
        "Step 1: Calculate total PnL = Sum of all trades = $1,951.39",
        "Step 2: Find first trade date = 2025-10-13",
        "Step 3: Find last trade date = 2025-10-27",
        "Step 4: Calculate calendar span = 14 days",
        "Step 5: Determine trading hours = 14 days × 8 hours/day = 112 hours",
        "Step 6: Calculate result = $1,951.39 / 112 hours = $17.42/hour"
      ],
      "assumptions": [
        "8 trading hours per business day",
        "Includes all calendar days in the range",
        "Based on trade dates, not actual entry/exit times"
      ],
      "raw_data": {
        "total_pnl": 1951.39,
        "first_trade": "2025-10-13",
        "last_trade": "2025-10-27",
        "days_elapsed": 14,
        "hours_used": 112
      }
    },
    "display_config": {
      "format": "currency",
      "suffix": "/hour",
      "decimals": 2
    }
  },
  "summary": "Based on your 14-day trading history, your revenue per hour is $17.42, assuming 8 trading hours per day."
}

=== FORMAT 2: GROUPED DATA WIDGET (Chart/Table) ===
Use this for comparisons and rankings (e.g., "best setups", "win rate by hour"):

{
  "widget": {
    "title": "Top Setups by Win Rate",
    "description": "Your trading setups ranked by success rate",
    "widget_type": "table",
    "calculated_data": [
      {
        "name": "Momentum Breakout",
        "value": 75.5,
        "count": 22,
        "calculation": "17 wins / 22 total trades = 75.5% win rate"
      },
      {
        "name": "Range Breakdown",
        "value": 68.2,
        "count": 15,
        "calculation": "11 wins / 15 total trades = 68.2% win rate"
      }
    ],
    "calculation": {
      "method": "Group by setup, calculate win rate for each",
      "steps": [
        "Step 1: Group all trades by setup name",
        "Step 2: For each setup, count winning trades (PnL > 0)",
        "Step 3: Calculate win rate = wins / total trades × 100",
        "Step 4: Sort by win rate descending",
        "Step 5: Return top results"
      ]
    },
    "display_config": {
      "format": "percent",
      "show_rank": true,
      "chart_type": "bar"
    }
  },
  "summary": "Your most successful setup is Momentum Breakout with a 75.5% win rate across 22 trades."
}

=== FORMAT 3: CLARIFYING QUESTIONS ===
Use this when you need more context:

{
  "clarification_needed": true,
  "question": "I can calculate your revenue per hour in three ways. Which would you prefer?",
  "options": [
    {
      "label": "Calendar hours (24 hours/day)",
      "value": 5.70,
      "explanation": "Total PnL / all hours since first trade = $1,951.39 / 342 hours = $5.70/hour"
    },
    {
      "label": "Trading hours (8 hours/day)",
      "value": 17.42,
      "explanation": "Total PnL / business hours (8h/day) = $1,951.39 / 112 hours = $17.42/hour"
    },
    {
      "label": "Active trading hours only",
      "value": 22.17,
      "explanation": "Total PnL / actual hours in trades = $1,951.39 / 88 hours = $22.17/hour"
    }
  ],
  "default": "Trading hours (8 hours/day)"
}

=== CALCULATION GUIDELINES ===

1. **Always show your work**: Include every step of calculation
2. **State assumptions clearly**: Trading hours, weekends, data quality, etc.
3. **Verify your math**: Double-check calculations before responding
4. **Provide context**: Compare to averages, explain what's good/bad
5. **Use actual data**: Reference specific numbers from the trades provided
6. **Be precise**: Use appropriate decimal places
7. **Think step-by-step**: Don't skip logical steps

=== COMMON CALCULATIONS ===

**Revenue per hour**: Total PnL / Hours elapsed (consider trading hours vs calendar hours)
**Revenue per day**: Total PnL / Days elapsed
**Profit factor**: Sum(winning trades) / |Sum(losing trades)|
**Average win**: Sum(winning trades) / Count(wins)
**Average loss**: Sum(losing trades) / Count(losses)
**Win rate**: Count(wins) / Count(all trades) × 100
**Largest win/loss**: Max/Min of all PnL values
**Expected value**: (Win rate × Avg win) - (Loss rate × Avg loss)

=== VERIFICATION CHECKLIST ===
Before returning a result, verify:
✓ Did I use the correct formula?
✓ Did I handle zero/null values properly?
✓ Are my assumptions reasonable?
✓ Does the result make intuitive sense?
✓ Did I explain every step clearly?

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
