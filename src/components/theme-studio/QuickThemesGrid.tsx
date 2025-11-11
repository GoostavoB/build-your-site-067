import { useState, useRef, useEffect } from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { ThemePreviewCard } from './ThemePreviewCard';
import { UNIFIED_THEMES } from '@/utils/unifiedThemes';
import { useThemeUnlocks } from '@/hooks/useThemeUnlocks';
import { useThemeGating } from '@/hooks/useThemeGating';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const QuickThemesGrid = () => {
  const { 
    themeMode, 
    setThemeMode, 
    startPreview, 
    previewMode 
  } = useThemeMode();
  const { themes, activateTheme } = useThemeUnlocks();
  const { canAccessTheme, handleLockedTheme } = useThemeGating();
  const [previewingTheme, setPreviewingTheme] = useState<string | null>(null);
  const [previewTimer, setPreviewTimer] = useState<NodeJS.Timeout | null>(null);
  const previousThemeRef = useRef<string>(themeMode);

  useEffect(() => {
    return () => {
      if (previewTimer) {
        clearTimeout(previewTimer);
      }
    };
  }, [previewTimer]);

  const handleThemeClick = async (themeId: string, isPreview: boolean = false) => {
    const theme = UNIFIED_THEMES.find(t => t.id === themeId);
    if (!theme) return;

    // Preview mode (all themes)
    if (isPreview) {
      startPreview(themeId, theme.name);
      return;
    }

    // Check if theme is accessible for direct apply
    if (!canAccessTheme(themeId)) {
      // Start 5-second locked preview
      previousThemeRef.current = themeMode;
      setPreviewingTheme(themeId);
      setThemeMode(themeId);
      
      toast.info('Preview mode', {
        description: '5 seconds remaining...',
        duration: 5000,
      });

      const timer = setTimeout(() => {
        setThemeMode(previousThemeRef.current);
        setPreviewingTheme(null);
        handleLockedTheme(themeId);
      }, 5000);

      setPreviewTimer(timer);
      return;
    }

    // Clear any active preview
    if (previewTimer) {
      clearTimeout(previewTimer);
      setPreviewTimer(null);
    }
    setPreviewingTheme(null);
    
    // Apply theme permanently
    setThemeMode(themeId);
    await activateTheme(themeId);
    
    console.log('✅ Theme activated:', themeId);
  };

  // Show ALL themes to all users
  const allThemes = UNIFIED_THEMES;
  
  // Map themes with unlock status
  const themesWithStatus = allThemes.map(theme => {
    const unlockStatus = themes.find(t => t.id === theme.id);
    return {
      ...theme,
      isLocked: !unlockStatus?.isUnlocked,
      isPreviewing: previewingTheme === theme.id || previewMode?.themeId === theme.id,
    };
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold px-4">Available Themes</h3>
        <div className="grid grid-cols-2 gap-3 px-4">
          {themesWithStatus.map((theme) => (
            <div key={theme.id} className="space-y-2">
              <ThemePreviewCard
                theme={theme}
                isActive={themeMode === theme.id && !theme.isPreviewing}
                isLocked={theme.isLocked}
                isPreviewing={theme.isPreviewing}
                requiredTier={theme.requiredTier}
                onClick={() => handleThemeClick(theme.id, false)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 gap-1.5 text-xs"
                onClick={() => handleThemeClick(theme.id, true)}
              >
                <Eye className="h-3 w-3" />
                Preview
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
