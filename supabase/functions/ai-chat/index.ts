import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkBudget, logCost } from '../_shared/budgetChecker.ts';
import { classifyComplexity, selectRoute } from '../_shared/aiRouter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

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

    const budget = await checkBudget(supabaseClient, user.id);
    if (budget.blocked) {
      return new Response(
        JSON.stringify({ error: budget.message }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, context } = await req.json();

    // Rolling window: keep only last 20 messages to reduce token usage
    const recentMessages = messages.slice(-20);

    // Classify complexity
    const lastMessage = recentMessages[recentMessages.length - 1];
    const complexity = classifyComplexity({
      promptLength: lastMessage.content.length,
      hasImages: false,
      tradesCount: 0,
      keywords: lastMessage.content.split(' ')
    });

    const route = selectRoute(complexity, budget.forceLite);
    const modelUsed = route.model;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a trading coach and analyst. Keep responses concise, actionable, and under 500 tokens. Focus on practical trading insights, risk management, and psychology. Be encouraging but honest.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages
        ],
        max_tokens: route.maxTokens
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error('AI chat error:', response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content;
    const tokensIn = result.usage?.prompt_tokens || 0;
    const tokensOut = result.usage?.completion_tokens || 0;

    // Log cost (lite = 1 cent, deep = 3 cents)
    const costCents = complexity === 'simple' ? 1 : 3;
    const latency = Date.now() - startTime;
    await logCost(supabaseClient, user.id, 'ai-chat', 
      complexity === 'simple' ? 'lite' : 'deep', 
      modelUsed, tokensIn, tokensOut, costCents, latency, { complexity });

    console.log(`✅ Chat completed via ${complexity} route in ${latency}ms`);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in ai-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Chat failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
