import { Lock, Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileFrames } from '@/hooks/useProfileFrames';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { posthog } from '@/lib/posthog';

interface ProfileFrameSelectorProps {
  className?: string;
}

export const ProfileFrameSelector = ({ className }: ProfileFrameSelectorProps) => {
  const { frames, activeFrame, loading, selectFrame } = useProfileFrames();
  const { user } = useAuth();

  const handleFrameClick = (frame: any) => {
    if (!frame.is_unlocked) {
      posthog.capture('profile_frame_locked_clicked', {
        frame_id: frame.frame_id,
        frame_name: frame.frame_name,
        required_level: frame.required_level,
      });
      return;
    }

    selectFrame(frame.frame_id);
    posthog.capture('profile_frame_selected', {
      frame_id: frame.frame_id,
      frame_name: frame.frame_name,
    });
  };

  if (loading) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (frames.length === 0) {
    return (
      <div className="text-center py-12">
        <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No profile frames available yet</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {frames.map((frame, index) => {
        const isActive = activeFrame?.frame_id === frame.frame_id;
        const isLocked = !frame.is_unlocked;
        
        // Parse frame style from JSONB
        const frameStyle = frame.frame_style as { border?: string; glow?: string };

        return (
          <motion.div
            key={frame.frame_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleFrameClick(frame)}
            className={cn(
              "relative group cursor-pointer rounded-lg p-4 transition-all duration-300",
              "border-2 bg-card/50 backdrop-blur-sm",
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

            {/* Frame preview with avatar */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className={cn(
                  "relative rounded-full p-1 transition-all duration-300",
                  isLocked && "grayscale blur-[2px]"
                )}
                style={{
                  border: frameStyle?.border || '2px solid transparent',
                  boxShadow: frameStyle?.glow || 'none',
                }}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center">
                <p className={cn(
                  "font-medium text-sm",
                  isLocked && "text-muted-foreground"
                )}>
                  {frame.frame_name}
                </p>
                
                {frame.required_level && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Level {frame.required_level}
                    </span>
                  </div>
                )}

                {isLocked && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {frame.unlock_requirement}
                  </p>
                )}
              </div>
            </div>

            {/* Hover effect for unlocked frames */}
            {!isLocked && !isActive && (
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
