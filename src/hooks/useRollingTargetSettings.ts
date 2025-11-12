import { useUserSettings } from './useUserSettings';
import { toast } from 'sonner';

export type TrackingMode = 'rolling' | 'per-day';
export type SuggestionMethod = 'median' | 'risk-aware';

export interface RollingTargetSettings {
  targetPercent: number;
  mode: TrackingMode;
  carryOverCap: number;
  suggestionMethod: SuggestionMethod;
  suggestionsEnabled: boolean;
  rolloverWeekends: boolean;
  lastSuggestionDate: string | null;
  dismissedSuggestion: boolean;
}

export const useRollingTargetSettings = () => {
  const { settings, loading, updateSetting } = useUserSettings();

  const rollingTargetSettings: RollingTargetSettings = {
    targetPercent: settings.rolling_target_percent,
    mode: settings.rolling_target_mode,
    carryOverCap: settings.rolling_target_carryover_cap,
    suggestionMethod: settings.rolling_target_suggestion_method,
    suggestionsEnabled: settings.rolling_target_suggestions_enabled,
    rolloverWeekends: settings.rolling_target_rollover_weekends,
    lastSuggestionDate: settings.rolling_target_last_suggestion_date,
    dismissedSuggestion: settings.rolling_target_dismissed_suggestion,
  };

  const updateRollingTargetSetting = async <K extends keyof RollingTargetSettings>(
    key: K,
    value: RollingTargetSettings[K]
  ) => {
    try {
      // Map UI keys to database keys
      const dbKey = `rolling_target_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}` as any;
      await updateSetting(dbKey, value);
    } catch (error) {
      console.error('Error updating rolling target setting:', error);
      toast.error('Failed to save setting');
      throw error;
    }
  };

  const applySuggestion = async (suggestedPercent: number) => {
    try {
      await updateSetting('rolling_target_percent', suggestedPercent);
      await updateSetting('rolling_target_carryover_cap', suggestedPercent * 2);
      await updateSetting('rolling_target_last_suggestion_date', new Date().toISOString());
      await updateSetting('rolling_target_dismissed_suggestion', false);
      toast.success(`Target updated to ${suggestedPercent.toFixed(2)}%`);
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast.error('Failed to apply suggestion');
    }
  };

  const dismissSuggestion = async () => {
    try {
      await updateSetting('rolling_target_dismissed_suggestion', true);
      toast.info('Suggestion dismissed');
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
      toast.error('Failed to dismiss suggestion');
    }
  };

  return {
    settings: rollingTargetSettings,
    loading,
    updateSetting: updateRollingTargetSetting,
    applySuggestion,
    dismissSuggestion,
  };
};
