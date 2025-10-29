import { motion } from 'framer-motion';
import { Check, Lock, Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useThemeUnlocks } from '@/hooks/useThemeUnlocks';
import { toast } from 'sonner';
import { TIER_ICONS } from '@/utils/themePresets';

export const ThemeSelector = () => {
  const { themes, activeTheme, loading, activateTheme } = useThemeUnlocks();

  const handleThemeSelect = (themeId: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      toast.error('Theme locked', {
        description: 'Complete the requirements to unlock this theme'
      });
      return;
    }
    activateTheme(themeId);
    toast.success('Theme activated', {
      description: `Switched to ${themes.find(t => t.id === themeId)?.name}`
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading themes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Dashboard Themes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme, index) => {
          const isActive = theme.id === activeTheme;
          
          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`
                  relative p-4 cursor-pointer transition-all
                  ${isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:scale-[1.02]'}
                  ${!theme.isUnlocked ? 'opacity-60' : ''}
                `}
                onClick={() => handleThemeSelect(theme.id, theme.isUnlocked)}
              >
                {!theme.isUnlocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {theme.isNew && (
                  <Badge className="absolute top-2 left-2 z-20 animate-pulse" variant="default">
                    NEW
                  </Badge>
                )}

                <div className="space-y-3">
                  {/* Color Preview */}
                  <div className="flex gap-2 h-12 rounded-lg overflow-hidden">
                    <div 
                      className="flex-1" 
                      style={{ backgroundColor: `hsl(${theme.primary})` }}
                    />
                    <div 
                      className="flex-1" 
                      style={{ backgroundColor: `hsl(${theme.secondary})` }}
                    />
                    <div 
                      className="flex-1" 
                      style={{ backgroundColor: `hsl(${theme.accent})` }}
                    />
                  </div>

                  {/* Theme Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {theme.icon && <span className="text-lg">{theme.icon}</span>}
                      <h4 className="font-semibold">{theme.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {theme.description || 'Custom theme'}
                    </p>
                    
                    {/* Unlock Requirement */}
                    <Badge variant={theme.isUnlocked ? "default" : "secondary"} className="text-xs">
                      {TIER_ICONS[theme.tier]} {theme.tier.charAt(0).toUpperCase() + theme.tier.slice(1)} - {theme.xpRequired} XP
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
