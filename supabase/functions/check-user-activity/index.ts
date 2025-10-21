import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all users
    const { data: users } = await supabase
      .from("profiles")
      .select("id, email");

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const notifications = [];

    for (const user of users) {
      // Check last activity
      const { data: progression } = await supabase
        .from("user_progression")
        .select("last_active_date, daily_streak")
        .eq("user_id", user.id)
        .single();

      if (!progression) continue;

      const lastActive = new Date(progression.last_active_date);
      const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      // Streak warning (1 day away from losing streak)
      if (progression.daily_streak > 0 && daysSinceActive === 1) {
        notifications.push({
          user_id: user.id,
          type: 'streak_warning',
          message: `You're 1 day away from losing your ${progression.daily_streak}-day streak!`,
          priority: 'high'
        });
      }

      // Comeback bonus (inactive for 7+ days)
      if (daysSinceActive >= 7 && daysSinceActive < 30) {
        notifications.push({
          user_id: user.id,
          type: 'comeback_bonus',
          message: 'Welcome back! Here\'s 50 XP to get started again.',
          priority: 'medium'
        });
      }

      // Badge graying warning (inactive for 25+ days)
      if (daysSinceActive >= 25 && daysSinceActive < 30) {
        notifications.push({
          user_id: user.id,
          type: 'badge_warning',
          message: `Your badges will gray out in ${30 - daysSinceActive} days. Stay active!`,
          priority: 'low'
        });
      }
    }

    // Store notifications (you would implement a notifications table)
    console.log(`Generated ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ 
        message: `Checked activity for ${users.length} users`,
        notifications: notifications.length
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
