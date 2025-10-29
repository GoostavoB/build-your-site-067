import { useThemeMode, ColorMode } from '@/hooks/useThemeMode';
import { ThemePreviewCard } from './ThemePreviewCard';
import { useThemeUnlocks } from '@/hooks/useThemeUnlocks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TIER_ICONS, TIER_COLORS } from '@/utils/themePresets';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const QuickThemesGrid = () => {
  const { themeMode, setThemeMode } = useThemeMode();
  const { themes, totalXP } = useThemeUnlocks();

  const handleThemeClick = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme?.isUnlocked) {
      setThemeMode(themeId);
    }
  };

  // Group themes by tier
  const tierGroups = {
    rookie: themes.filter(t => t.tier === 'rookie'),
    trader: themes.filter(t => t.tier === 'trader'),
    pro: themes.filter(t => t.tier === 'pro'),
    expert: themes.filter(t => t.tier === 'expert'),
    master: themes.filter(t => t.tier === 'master'),
  };

  const getTierUnlockProgress = (tierThemes: typeof themes) => {
    const unlocked = tierThemes.filter(t => t.isUnlocked).length;
    return { unlocked, total: tierThemes.length, percentage: (unlocked / tierThemes.length) * 100 };
  };

  return (
    <div className="space-y-4 px-4">
      <h3 className="text-sm font-semibold">Available Themes</h3>
      
      <Accordion type="multiple" defaultValue={['rookie', 'trader']} className="space-y-2">
        {Object.entries(tierGroups).map(([tier, tierThemes]) => {
          if (tierThemes.length === 0) return null;
          
          const progress = getTierUnlockProgress(tierThemes);
          const tierKey = tier as keyof typeof TIER_ICONS;
          
          return (
            <AccordionItem key={tier} value={tier} className="border rounded-lg px-3">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{TIER_ICONS[tierKey]}</span>
                    <span className="font-medium capitalize">{tier}</span>
                    <Badge variant="outline" className="text-xs">
                      {progress.unlocked}/{progress.total}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                <Progress value={progress.percentage} className="h-1 mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  {tierThemes.map((theme) => (
                    <ThemePreviewCard
                      key={theme.id}
                      theme={theme}
                      isActive={themeMode === theme.id}
                      onClick={() => handleThemeClick(theme.id)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
