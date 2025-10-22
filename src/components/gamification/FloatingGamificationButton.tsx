import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GamificationSidebar } from './GamificationSidebar';
import { AchievementBadges } from '../AchievementBadges';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const FloatingGamificationButton = () => {
  const [showGamification, setShowGamification] = useState(false);

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
  });

  const recentWins = trades.filter(t => (t.pnl || 0) > 0).slice(0, 5);

  return (
    <>
      {/* Floating Lightning Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 md:bottom-8 right-4 z-40"
      >
        <Button
          size="lg"
          onClick={() => setShowGamification(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-110"
        >
          <Zap className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Glassmorphic Overlay */}
      <AnimatePresence>
        {showGamification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-xl"
            onClick={() => setShowGamification(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-auto custom-scrollbar bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGamification(false)}
                className="absolute top-4 right-4 z-10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-6 md:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Performance Overview
                  </h2>
                  <p className="text-muted-foreground">Track your progress and achievements</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="glass-card p-6 rounded-xl border border-border/30">
                      <h3 className="text-xl font-semibold mb-4">XP & Challenges</h3>
                      <GamificationSidebar />
                    </div>

                    <div className="glass-card p-6 rounded-xl border border-border/30">
                      <h3 className="text-xl font-semibold mb-4">Recent Wins 🎉</h3>
                      <div className="space-y-3">
                        {recentWins.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No winning trades yet. Keep trading!
                          </p>
                        ) : (
                          recentWins.map((trade) => (
                            <div
                              key={trade.id}
                              className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">{trade.asset}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(trade.entry_time).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="font-bold text-success">
                                +${trade.pnl?.toFixed(2)}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="glass-card p-6 rounded-xl border border-border/30">
                    <h3 className="text-xl font-semibold mb-4">Achievements</h3>
                    <AchievementBadges trades={trades} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
