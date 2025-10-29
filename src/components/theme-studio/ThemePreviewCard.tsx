import { ColorMode } from '@/hooks/useThemeMode';
import { Check, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnlockableTheme } from '@/hooks/useThemeUnlocks';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TIER_COLORS } from '@/utils/themePresets';
import { toast } from 'sonner';

interface ThemePreviewCardProps {
  theme: UnlockableTheme;
  isActive: boolean;
  onHover?: () => void;
  onClick: () => void;
}

export const ThemePreviewCard = ({ theme, isActive, onHover, onClick }: ThemePreviewCardProps) => {
  const handleClick = () => {
    if (!theme.isUnlocked) {
      toast.error('Theme Locked', {
        description: `Reach ${theme.xpRequired} XP to unlock ${theme.name}`,
        duration: 4000
      });
      return;
    }
    onClick();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onMouseEnter={onHover}
            onClick={handleClick}
            className={cn(
              "relative group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
              "hover:scale-105 hover:shadow-lg cursor-pointer",
              isActive 
                ? "border-primary bg-primary/10 shadow-md" 
                : theme.isUnlocked
                  ? "border-border/20 hover:border-border/50"
                  : "border-border/10 opacity-60"
            )}
            style={!theme.isUnlocked ? {
              boxShadow: `0 0 20px -5px ${TIER_COLORS[theme.tier]}40`
            } : undefined}
          >
            {/* Lock Overlay */}
            {!theme.isUnlocked && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            {/* Color Preview Dots */}
            <div className="flex gap-1.5">
              <div 
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: `hsl(${theme.primary})` }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: `hsl(${theme.accent})` }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: `hsl(${theme.secondary})` }}
              />
            </div>

            {/* Theme Name */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {theme.icon && <span className="text-xs">{theme.icon}</span>}
                <p className="text-xs font-medium">{theme.name}</p>
              </div>
              {!theme.isUnlocked && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {theme.xpRequired} XP
                </p>
              )}
            </div>

            {/* Active Indicator */}
            {isActive && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}

            {/* NEW Badge */}
            {theme.isNew && theme.isUnlocked && (
              <Badge className="absolute top-2 left-2 text-[10px] py-0 px-1.5 animate-pulse">
                <Sparkles className="h-2 w-2 mr-0.5" />
                NEW
              </Badge>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-semibold">{theme.name}</p>
            <p className="text-muted-foreground">{theme.description}</p>
            {!theme.isUnlocked && (
              <p className="text-primary mt-1">Unlock at {theme.xpRequired} XP</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
