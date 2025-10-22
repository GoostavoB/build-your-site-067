import { ReactNode, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { UserMenu } from './UserMenu';
import { useReminderNotifications } from '@/hooks/useReminderNotifications';
import { useSidebarState } from '@/hooks/useSidebarState';
import { LanguageToggle } from '@/components/LanguageToggle';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { ThemeStudio } from '@/components/theme-studio/ThemeStudio';
import { ThemeUnlockNotification } from '@/components/theme-studio/ThemeUnlockNotification';
import { MobileNav } from '@/components/mobile/MobileNav';
import { QuickAddTrade } from '@/components/mobile/QuickAddTrade';
import { InstallPrompt } from '@/components/mobile/InstallPrompt';
import { GamificationSidebar } from '@/components/gamification/GamificationSidebar';
import { Button } from '@/components/ui/button';
import { Zap, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  useReminderNotifications();
  const { isCollapsed, setIsCollapsed } = useSidebarState();
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={!isCollapsed} onOpenChange={setIsCollapsed}>
      <ThemeUnlockNotification />
      <div className="min-h-screen flex w-full mobile-safe overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col mobile-safe overflow-hidden h-screen relative">
          {/* Desktop Header */}
          <header className="hidden md:flex h-16 border-b border-border/50 backdrop-blur-xl glass-subtle items-center justify-between gap-4 px-6 sticky top-0 z-30">
            {/* Left: Sidebar trigger */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hover:bg-muted/50 rounded-lg p-2 transition-colors" />
            </div>

            {/* Right: Icon Buttons */}
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp />
              <LanguageToggle />
              <ThemeStudio />
              <UserMenu />
            </div>
          </header>

          {/* Mobile Header (Simplified) */}
          <header className="md:hidden h-14 border-b border-border/50 backdrop-blur-xl glass-subtle flex items-center justify-between gap-2 px-3 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hover:bg-muted/50 rounded-lg p-2 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp />
              <LanguageToggle />
              <ThemeStudio />
              <UserMenu />
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 p-3 md:p-6 overflow-auto pb-20 md:pb-6 custom-scrollbar mobile-safe">
              {children}
            </main>
            
            {/* Collapsible Right Sidebar - Gamification */}
            <AnimatePresence>
              {isGamificationOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="hidden xl:block border-l border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm"
                >
                  <div className="w-80 p-4 overflow-auto custom-scrollbar h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">Progress</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsGamificationOpen(false)}
                        className="h-7 w-7"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <GamificationSidebar />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Lightning Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="hidden xl:block fixed bottom-8 right-8 z-40"
          >
            <Button
              size="icon"
              onClick={() => setIsGamificationOpen(!isGamificationOpen)}
              className={cn(
                "rounded-full w-10 h-10 shadow-lg transition-all duration-300 hover:scale-110",
                isGamificationOpen 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              )}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <MobileNav />
          <QuickAddTrade />
          <InstallPrompt />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
