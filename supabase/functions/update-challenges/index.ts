import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHALLENGE_TEMPLATES = [
  {
    challenge_type: 'trade_count',
    title: 'Log 3 Trades',
    description: 'Execute at least 3 trades today',
    target_value: 3,
    xp_reward: 15
  },
  {
    challenge_type: 'winning_trade',
    title: 'Get a Win',
    description: 'Achieve at least 1 winning trade',
    target_value: 1,
    xp_reward: 20
  },
  {
    challenge_type: 'customize_dashboard',
    title: 'Customize Dashboard',
    description: 'Make changes to your dashboard layout',
    target_value: 1,
    xp_reward: 10
  },
  {
    challenge_type: 'check_analytics',
    title: 'Check Analytics',
    description: 'Visit your analytics page',
    target_value: 1,
    xp_reward: 5
  },
  {
    challenge_type: 'export_history',
    title: 'Export Trades',
    description: 'Export your trade history',
    target_value: 1,
    xp_reward: 15
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const today = new Date().toISOString().split('T')[0];

    // Get all active users
    const { data: users } = await supabase
      .from("profiles")
      .select("id");

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let createdCount = 0;

    for (const user of users) {
      // Check if user already has challenges for today
      const { data: existing } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_date", today);

      if (existing && existing.length > 0) continue;

      // Create daily challenges for this user
      const challenges = CHALLENGE_TEMPLATES.map(template => ({
        user_id: user.id,
        challenge_date: today,
        ...template,
        current_progress: 0,
        is_completed: false
      }));

      // Randomly add one "Mystery Challenge" (1 in 7 chance)
      if (Math.random() < 1/7) {
        challenges.push({
          user_id: user.id,
          challenge_date: today,
          challenge_type: 'mystery_challenge',
          title: '🎁 Mystery Challenge',
          description: 'Complete any challenge to unlock this bonus!',
          target_value: 1,
          xp_reward: 30, // Double XP
          current_progress: 0,
          is_completed: false
        });
      }

      const { error } = await supabase
        .from("daily_challenges")
        .insert(challenges);

      if (!error) createdCount++;
    }

    return new Response(
      JSON.stringify({ 
        message: `Daily challenges created for ${createdCount} users`,
        date: today 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
