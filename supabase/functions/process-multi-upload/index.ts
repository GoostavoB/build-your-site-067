import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { trades } = await req.json();

    if (!Array.isArray(trades) || trades.length === 0) {
      throw new Error('No trades provided');
    }

    console.log(`Processing ${trades.length} trades for user ${user.id}`);

    const successfulTrades = [];
    const failures = [];

    for (let i = 0; i < trades.length; i++) {
      try {
        const { data: deductResult, error: deductError } = await supabaseClient.rpc('deduct_upload_credit', {
          p_user_id: user.id,
        });

        if (deductError) {
          console.error(`Credit deduction failed for trade ${i + 1}:`, deductError);
          failures.push({ index: i, error: 'Credit deduction failed', trade: trades[i].symbol });
          break;
        }

        const result = deductResult as { success: boolean; error?: string; message?: string };
        
        if (!result.success) {
          console.warn(`Insufficient credits at trade ${i + 1}`);
          failures.push({ index: i, error: result.message || 'Insufficient credits', trade: trades[i].symbol });
          break;
        }

        const { data: insertedTrade, error: insertError } = await supabaseClient
          .from('trades')
          .insert({
            ...trades[i],
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Insert failed for trade ${i + 1}:`, insertError);
          failures.push({ index: i, error: insertError.message, trade: trades[i].symbol });
        } else {
          successfulTrades.push(insertedTrade);
          console.log(`Trade ${i + 1}/${trades.length} inserted successfully`);
        }
      } catch (err) {
        console.error(`Unexpected error processing trade ${i + 1}:`, err);
        failures.push({ 
          index: i, 
          error: err instanceof Error ? err.message : 'Unknown error',
          trade: trades[i].symbol 
        });
      }
    }

    console.log(`Batch complete: ${successfulTrades.length} inserted, ${failures.length} failed`);

    return new Response(
      JSON.stringify({ 
        success: successfulTrades.length > 0,
        trades: successfulTrades,
        tradesInserted: successfulTrades.length,
        failures: failures.length > 0 ? failures : undefined,
        partialSuccess: successfulTrades.length > 0 && failures.length > 0
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Multi-upload processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
