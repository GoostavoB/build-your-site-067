import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import dashboardBlue from "@/assets/showcase/dashboard-blue.png";
import dashboardPurple from "@/assets/showcase/dashboard-purple.png";
import dashboardTeal from "@/assets/showcase/dashboard-teal.png";
import dashboardOrange from "@/assets/showcase/dashboard-orange.png";
import dashboardLight from "@/assets/showcase/dashboard-light.png";

const SHOWCASE_THEMES = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '217 91% 60%',
    secondary: '262 83% 58%',
    accent: '189 94% 43%',
    screenshot: dashboardBlue,
    emoji: '🌊'
  },
  {
    id: 'purple',
    name: 'Purple Haze',
    primary: '270 67% 62%',
    secondary: '330 81% 60%',
    accent: '38 92% 50%',
    screenshot: dashboardPurple,
    emoji: '🌸'
  },
  {
    id: 'teal',
    name: 'Emerald Trader',
    primary: '160 84% 39%',
    secondary: '173 80% 40%',
    accent: '82 70% 55%',
    screenshot: dashboardTeal,
    emoji: '💚'
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '24 95% 53%',
    secondary: '0 84% 60%',
    accent: '43 96% 56%',
    screenshot: dashboardOrange,
    emoji: '🌅'
  },
  {
    id: 'light',
    name: 'Mint Light',
    primary: '189 94% 43%',
    secondary: '160 84% 39%',
    accent: '173 80% 40%',
    screenshot: dashboardLight,
    emoji: '🍃'
  }
];

const screenshotVariants = {
  enter: { opacity: 0, scale: 0.98, y: 10 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -10 }
};

export const InteractiveThemePreview = () => {
  const [activeTheme, setActiveTheme] = useState(SHOWCASE_THEMES[0]);

  return (
    <div className="space-y-8">
      {/* Color Theme Switcher */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Palette className="h-4 w-4" />
          <span>Choose a theme or create your own</span>
        </div>
        
        <div 
          className="flex flex-wrap justify-center gap-3"
          role="tablist"
          aria-label="Color theme selector"
        >
          {SHOWCASE_THEMES.map((theme) => (
            <button
              key={theme.id}
              role="tab"
              aria-selected={activeTheme.id === theme.id}
              aria-label={`${theme.name} theme`}
              onClick={() => setActiveTheme(theme)}
              className="group relative"
            >
              <motion.div
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300"
                style={{
                  borderColor: activeTheme.id === theme.id 
                    ? `hsl(${theme.primary})` 
                    : 'hsl(var(--border))',
                  backgroundColor: activeTheme.id === theme.id 
                    ? `hsl(${theme.primary} / 0.1)` 
                    : 'transparent'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex gap-1.5">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.primary})` }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.secondary})` }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: `hsl(${theme.accent})` }}
                  />
                </div>
                <span className="text-xs font-medium flex items-center gap-1">
                  <span>{theme.emoji}</span>
                  <span>{theme.name}</span>
                </span>
              </motion.div>
              
              {activeTheme.id === theme.id && (
                <motion.div
                  layoutId="activeThemeGlow"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{
                    boxShadow: `0 0 30px hsl(${theme.primary} / 0.4)`
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center max-w-md">
          Or go fully custom. Change any color, any time. <span className="text-primary font-medium">No limits.</span>
        </p>
      </div>

      {/* Dashboard Screenshot with Animation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            variants={screenshotVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative rounded-2xl overflow-hidden border border-border/20 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: `0 25px 50px -12px hsl(${activeTheme.primary} / 0.25)`
            }}
          >
            <img 
              src={activeTheme.screenshot}
              alt={`Trading dashboard in ${activeTheme.name} theme showing portfolio overview, ROI analytics, win rates, and customizable widgets`}
              className="w-full h-auto"
              loading="lazy"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none" 
            />
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-6 right-6 px-4 py-2 rounded-full text-xs font-medium glass-strong"
              style={{
                backgroundColor: `hsl(${activeTheme.primary} / 0.2)`,
                color: `hsl(${activeTheme.primary})`,
                border: `1px solid hsl(${activeTheme.primary} / 0.3)`
              }}
            >
              ✨ Fully Customizable
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
