import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, broker } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid text parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a trade data extraction specialist. Extract trading information from OCR text and structure it precisely.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no backticks, no explanations
2. All numeric fields must be numbers, not strings
3. Dates must be ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
4. side must be exactly "long" or "short" (lowercase)
5. For each field, include a confidence score (0.0 to 1.0)

If a field is unclear or missing, use null for the value and set confidence to 0.`;

    const userPrompt = `Extract trade data from this OCR text:

${text}

${broker ? `Broker: ${broker}` : ''}

Return structured trade data with confidence scores for each field.`;

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
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'extract_trade',
            description: 'Extract structured trade data with confidence scores',
            parameters: {
              type: 'object',
              properties: {
                symbol: { type: 'string', description: 'Trading pair symbol' },
                symbol_confidence: { type: 'number', minimum: 0, maximum: 1 },
                entry_price: { type: 'number', description: 'Entry price' },
                entry_price_confidence: { type: 'number', minimum: 0, maximum: 1 },
                exit_price: { type: 'number', description: 'Exit price' },
                exit_price_confidence: { type: 'number', minimum: 0, maximum: 1 },
                position_size: { type: 'number', description: 'Position size' },
                position_size_confidence: { type: 'number', minimum: 0, maximum: 1 },
                side: { type: 'string', enum: ['long', 'short'], description: 'Trade direction' },
                side_confidence: { type: 'number', minimum: 0, maximum: 1 },
                leverage: { type: 'number', description: 'Leverage used' },
                leverage_confidence: { type: 'number', minimum: 0, maximum: 1 },
                funding_fee: { type: 'number', description: 'Funding fees paid' },
                funding_fee_confidence: { type: 'number', minimum: 0, maximum: 1 },
                trading_fee: { type: 'number', description: 'Trading fees paid' },
                trading_fee_confidence: { type: 'number', minimum: 0, maximum: 1 },
                margin: { type: 'number', description: 'Margin used' },
                margin_confidence: { type: 'number', minimum: 0, maximum: 1 },
                opened_at: { type: 'string', format: 'date-time', description: 'Trade open time' },
                opened_at_confidence: { type: 'number', minimum: 0, maximum: 1 },
                closed_at: { type: 'string', format: 'date-time', description: 'Trade close time' },
                closed_at_confidence: { type: 'number', minimum: 0, maximum: 1 },
                profit_loss: { type: 'number', description: 'P&L amount' },
                profit_loss_confidence: { type: 'number', minimum: 0, maximum: 1 },
                roi: { type: 'number', description: 'Return on investment %' },
                roi_confidence: { type: 'number', minimum: 0, maximum: 1 },
                notes: { type: 'string', description: 'Additional notes or tags' },
                notes_confidence: { type: 'number', minimum: 0, maximum: 1 }
              },
              required: ['symbol', 'entry_price', 'exit_price', 'position_size', 'side'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'extract_trade' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || !toolCall.function?.arguments) {
      console.error('No tool call in AI response:', aiResponse);
      return new Response(
        JSON.stringify({ error: 'Failed to extract trade data' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractedTrade = JSON.parse(toolCall.function.arguments);
    
    const criticalFields = ['symbol', 'entry_price', 'exit_price', 'position_size', 'side'];
    const criticalConfidences = criticalFields.map(field => 
      extractedTrade[`${field}_confidence`] ?? 0
    );
    const avgConfidence = criticalConfidences.reduce((a, b) => a + b, 0) / criticalConfidences.length;

    const duration_hours = extractedTrade.opened_at && extractedTrade.closed_at
      ? Math.abs(new Date(extractedTrade.closed_at).getTime() - new Date(extractedTrade.opened_at).getTime()) / (1000 * 60 * 60)
      : null;

    const duration_days = duration_hours ? Math.floor(duration_hours / 24) : null;
    const duration_minutes = duration_hours ? Math.round((duration_hours % 1) * 60) : null;

    const period_of_day = extractedTrade.opened_at 
      ? (() => {
          const hour = new Date(extractedTrade.opened_at).getHours();
          if (hour >= 5 && hour < 12) return 'morning';
          if (hour >= 12 && hour < 18) return 'afternoon';
          return 'night';
        })()
      : null;

    const structuredTrade = {
      symbol: extractedTrade.symbol || '',
      entry_price: extractedTrade.entry_price ?? null,
      exit_price: extractedTrade.exit_price ?? null,
      position_size: extractedTrade.position_size ?? null,
      side: extractedTrade.side || 'long',
      leverage: extractedTrade.leverage ?? null,
      funding_fee: extractedTrade.funding_fee ?? null,
      trading_fee: extractedTrade.trading_fee ?? null,
      margin: extractedTrade.margin ?? null,
      opened_at: extractedTrade.opened_at ?? null,
      closed_at: extractedTrade.closed_at ?? null,
      profit_loss: extractedTrade.profit_loss ?? null,
      roi: extractedTrade.roi ?? null,
      duration_days,
      duration_hours: duration_hours ? Math.floor(duration_hours) : null,
      duration_minutes,
      period_of_day,
      notes: extractedTrade.notes ?? null,
      broker: broker ?? null,
      confidence: avgConfidence,
      field_confidences: {
        symbol: extractedTrade.symbol_confidence ?? 0,
        entry_price: extractedTrade.entry_price_confidence ?? 0,
        exit_price: extractedTrade.exit_price_confidence ?? 0,
        position_size: extractedTrade.position_size_confidence ?? 0,
        side: extractedTrade.side_confidence ?? 0,
        leverage: extractedTrade.leverage_confidence ?? 0,
        funding_fee: extractedTrade.funding_fee_confidence ?? 0,
        trading_fee: extractedTrade.trading_fee_confidence ?? 0,
        margin: extractedTrade.margin_confidence ?? 0,
        opened_at: extractedTrade.opened_at_confidence ?? 0,
        closed_at: extractedTrade.closed_at_confidence ?? 0,
        profit_loss: extractedTrade.profit_loss_confidence ?? 0,
        roi: extractedTrade.roi_confidence ?? 0,
        notes: extractedTrade.notes_confidence ?? 0,
      }
    };

    return new Response(
      JSON.stringify({ 
        trade: structuredTrade,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Structure trade error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
