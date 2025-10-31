-- Update widget unlock thresholds for gradual progression

-- Early Achievement Tier (50-550 XP)
UPDATE widget_tier_requirements 
SET xp_to_unlock = 50, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'leverageCalculator';

UPDATE widget_tier_requirements 
SET xp_to_unlock = 150, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'heatmap';

UPDATE widget_tier_requirements 
SET xp_to_unlock = 250, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'tradingQuality';

UPDATE widget_tier_requirements 
SET xp_to_unlock = 350, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'weekPerformance';

UPDATE widget_tier_requirements 
SET xp_to_unlock = 450, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'capitalGrowth';

UPDATE widget_tier_requirements 
SET xp_to_unlock = 550, tier_required = 0, tier_name = 'Starter'
WHERE widget_id = 'weeklyPnLChart';

-- Keep starter widgets at 0 XP
UPDATE widget_tier_requirements 
SET xp_to_unlock = 0, tier_required = 0, tier_name = 'Starter'
WHERE widget_id IN ('winRate', 'currentROI', 'totalTrades', 'avgPnLPerDay');