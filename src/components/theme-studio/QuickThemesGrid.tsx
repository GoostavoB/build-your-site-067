import { useThemeMode, ColorMode } from '@/hooks/useThemeMode';
import { ThemePreviewCard } from './ThemePreviewCard';
import { UNIFIED_THEMES } from '@/utils/unifiedThemes';
import { useThemeUnlocks } from '@/hooks/useThemeUnlocks';
import { toast } from 'sonner';

export const QuickThemesGrid = () => {
  const { themeMode, setThemeMode } = useThemeMode();
  const { themes, activateTheme } = useThemeUnlocks();

  const handleThemeClick = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    
    if (!theme?.isUnlocked) {
      toast.error('This theme is locked', {
        description: `Unlock requirement: ${theme?.requiredTier}`
      });
      return;
    }
    
    // Apply colors immediately using useThemeMode
    setThemeMode(themeId);
    
    // Save to database using useThemeUnlocks
    await activateTheme(themeId);
    
    console.log('✅ Theme activated:', themeId);
  };

  const allThemes = [...UNIFIED_THEMES];
  const unlockedThemes = allThemes.filter(t => 
    themes.find(ut => ut.id === t.id)?.isUnlocked
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold px-4">Available Themes</h3>
        <div className="grid grid-cols-2 gap-3 px-4">
          {unlockedThemes.map((theme) => (
            <ThemePreviewCard
              key={theme.id}
              theme={theme}
              isActive={themeMode === theme.id}
              onClick={() => handleThemeClick(theme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
