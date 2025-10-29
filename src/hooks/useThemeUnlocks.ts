import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_THEMES, ThemeDefinition } from '@/utils/themePresets';
import { calculateTier } from '@/utils/xpEngine';
import { toast } from 'sonner';
import { posthog } from '@/lib/posthog';

export interface UnlockableTheme extends ThemeDefinition {
  isUnlocked: boolean;
  isNew?: boolean;
}

export const useThemeUnlocks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pendingUnlocks, setPendingUnlocks] = useState(0);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['theme-unlocks', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Fetch user XP
      const { data: xpData } = await supabase
        .from('user_xp_levels')
        .select('total_xp_earned')
        .eq('user_id', user.id)
        .single();

      const totalXP = xpData?.total_xp_earned || 0;
      const userTier = calculateTier(totalXP);

      // Fetch user preferences
      const { data: preferences } = await supabase
        .from('user_customization_preferences')
        .select('active_theme, unlocked_themes, theme_unlock_dates, last_theme_notification_date, theme_studio_opened_count')
        .eq('user_id', user.id)
        .single();

      const unlockedThemes = preferences?.unlocked_themes || ['default'];
      const themeUnlockDates = (preferences?.theme_unlock_dates as Record<string, string>) || {};
      const activeThemeId = preferences?.active_theme || 'default';

      // Determine which themes should be unlocked based on XP
      const shouldBeUnlocked = ALL_THEMES.filter(theme => totalXP >= theme.xpRequired).map(t => t.id);
      
      // Find newly unlocked themes
      const newlyUnlocked = shouldBeUnlocked.filter(id => !unlockedThemes.includes(id));

      // Auto-unlock new themes
      if (newlyUnlocked.length > 0) {
        const updatedUnlocked = Array.from(new Set([...unlockedThemes, ...newlyUnlocked]));
        const updatedDates = themeUnlockDates ? { ...themeUnlockDates } : {};
        const now = new Date().toISOString();
        
        newlyUnlocked.forEach(themeId => {
          updatedDates[themeId] = now;
        });

        await supabase
          .from('user_customization_preferences')
          .upsert({
            user_id: user.id,
            unlocked_themes: updatedUnlocked,
            theme_unlock_dates: updatedDates,
            last_theme_notification_date: now
          }, {
            onConflict: 'user_id'
          });

        // Track analytics
        newlyUnlocked.forEach(themeId => {
          const theme = ALL_THEMES.find(t => t.id === themeId);
          posthog.capture('theme_unlocked', {
            theme_id: themeId,
            theme_name: theme?.name,
            tier: theme?.tier,
            xp_required: theme?.xpRequired,
            user_xp: totalXP
          });
        });

        // Show notifications
        if (newlyUnlocked.length === 1) {
          const theme = ALL_THEMES.find(t => t.id === newlyUnlocked[0]);
          toast.success(`🎨 New theme unlocked: ${theme?.name}!`, {
            description: theme?.description,
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => {
                window.dispatchEvent(new CustomEvent('open-theme-studio'));
              }
            }
          });
        } else {
          toast.success(`🎨 ${newlyUnlocked.length} new themes unlocked!`, {
            description: 'Check out your new color schemes',
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => {
                window.dispatchEvent(new CustomEvent('open-theme-studio'));
              }
            }
          });
        }

        // Trigger confetti
        window.dispatchEvent(new CustomEvent('trigger-confetti'));

        // Auto-open theme studio on first unlock only
        if (!hasAutoOpened && (preferences?.theme_studio_opened_count || 0) === 0) {
          setHasAutoOpened(true);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-theme-studio'));
          }, 1000);
        }

        setPendingUnlocks(newlyUnlocked.length);
      }

      // Map themes with unlock status
      const themesWithUnlocks: UnlockableTheme[] = ALL_THEMES.map(theme => {
        const isUnlocked = shouldBeUnlocked.includes(theme.id);
        const unlockDate = themeUnlockDates[theme.id];
        const isNew = unlockDate && (Date.now() - new Date(unlockDate).getTime()) < 24 * 60 * 60 * 1000;
        
        return {
          id: theme.id,
          name: theme.name,
          primary: theme.primary,
          secondary: theme.secondary,
          accent: theme.accent,
          profit: theme.profit,
          loss: theme.loss,
          tier: theme.tier,
          xpRequired: theme.xpRequired,
          description: theme.description,
          icon: theme.icon,
          isUnlocked,
          isNew
        };
      });

      return {
        themes: themesWithUnlocks,
        activeTheme: activeThemeId,
        totalXP,
        userTier,
        studioOpenedCount: preferences?.theme_studio_opened_count || 0
      };
    },
    enabled: !!user,
    staleTime: 30000
  });

  const activateTheme = async (themeId: string) => {
    if (!user || !data) return;

    const theme = data.themes.find(t => t.id === themeId);
    if (!theme?.isUnlocked) return;

    try {
      const { error } = await supabase
        .from('user_customization_preferences')
        .upsert({
          user_id: user.id,
          active_theme: themeId
        }, {
          onConflict: 'user_id'
        });

      if (!error) {
        document.documentElement.setAttribute('data-theme', themeId);
        toast.success(`Theme changed to ${theme.name}`);
        
        posthog.capture('theme_activated', {
          theme_id: themeId,
          theme_name: theme.name,
          tier: theme.tier
        });

        queryClient.invalidateQueries({ queryKey: ['theme-unlocks'] });
      }
    } catch (error) {
      console.error('Error activating theme:', error);
    }
  };

  const clearUnlockBadge = async () => {
    if (!user) return;
    
    setPendingUnlocks(0);
    
    await supabase
      .from('user_customization_preferences')
      .upsert({
        user_id: user.id,
        theme_studio_opened_count: (data?.studioOpenedCount || 0) + 1
      }, {
        onConflict: 'user_id'
      });
  };

  return {
    themes: data?.themes || [],
    activeTheme: data?.activeTheme || 'default',
    loading: isLoading,
    activateTheme,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['theme-unlocks'] }),
    pendingUnlocks,
    clearUnlockBadge,
    totalXP: data?.totalXP || 0,
    userTier: data?.userTier || 0
  };
};
