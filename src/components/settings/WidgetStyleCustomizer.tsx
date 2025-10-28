import { Lock, Check, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWidgetStyles } from '@/hooks/useWidgetStyles';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { posthog } from '@/lib/posthog';

interface WidgetStyleCustomizerProps {
  className?: string;
}

export const WidgetStyleCustomizer = ({ className }: WidgetStyleCustomizerProps) => {
  const { styles, activeStyle, loading, selectStyle } = useWidgetStyles();

  const handleStyleClick = (style: any) => {
    if (!style.is_unlocked) {
      posthog.capture('widget_style_locked_clicked', {
        style_id: style.style_id,
        style_name: style.style_name,
        required_level: style.required_level,
      });
      return;
    }

    selectStyle(style.style_id);
    posthog.capture('widget_style_selected', {
      style_id: style.style_id,
      style_name: style.style_name,
    });
  };

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (styles.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No widget styles available yet</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {styles.map((style, index) => {
        const isActive = activeStyle?.style_id === style.style_id;
        const isLocked = !style.is_unlocked;
        
        // Parse style config from JSONB
        const styleConfig = style.style_config as {
          background?: string;
          border?: string;
          backdropFilter?: string;
          boxShadow?: string;
        };

        return (
          <motion.div
            key={style.style_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleStyleClick(style)}
            className={cn(
              "relative group cursor-pointer rounded-lg p-4 transition-all duration-300",
              "border-2",
              isActive && "border-success shadow-lg shadow-success/20",
              !isActive && !isLocked && "border-border hover:border-primary/50 hover:shadow-md",
              isLocked && "border-border/50 opacity-60 cursor-not-allowed"
            )}
          >
            {/* Active checkmark */}
            {isActive && (
              <div className="absolute top-2 right-2 z-10 bg-success rounded-full p-1">
                <Check className="w-4 h-4 text-success-foreground" />
              </div>
            )}

            {/* Lock icon */}
            {isLocked && (
              <div className="absolute top-2 right-2 z-10 bg-muted rounded-full p-1">
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {/* Style preview */}
            <div className="space-y-3">
              {/* Mini XP Progress Bar Preview */}
              <div
                className={cn(
                  "p-3 rounded-lg transition-all duration-300",
                  isLocked && "grayscale blur-[1px]"
                )}
                style={{
                  background: styleConfig?.background || 'rgba(255, 255, 255, 0.05)',
                  border: styleConfig?.border || '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: styleConfig?.backdropFilter,
                  boxShadow: styleConfig?.boxShadow,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">XP Progress</span>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-1.5" />
              </div>

              {/* Mini Stat Card Preview */}
              <div
                className={cn(
                  "p-3 rounded-lg transition-all duration-300",
                  isLocked && "grayscale blur-[1px]"
                )}
                style={{
                  background: styleConfig?.background || 'rgba(255, 255, 255, 0.05)',
                  border: styleConfig?.border || '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: styleConfig?.backdropFilter,
                  boxShadow: styleConfig?.boxShadow,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Streak</p>
                    <p className="text-lg font-bold">5 days</p>
                  </div>
                  <div className="text-2xl">🔥</div>
                </div>
              </div>

              {/* Style name and info */}
              <div className="text-center pt-2">
                <p className={cn(
                  "font-medium text-sm",
                  isLocked && "text-muted-foreground"
                )}>
                  {style.style_name}
                </p>
                
                {style.required_level && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Level {style.required_level}
                    </span>
                  </div>
                )}

                {isLocked && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {style.unlock_requirement}
                  </p>
                )}
              </div>
            </div>

            {/* Hover effect for unlocked styles */}
            {!isLocked && !isActive && (
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">Apply Style</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
