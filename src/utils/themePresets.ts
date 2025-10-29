import { ColorMode } from '@/hooks/useThemeMode';

export type TierName = 'rookie' | 'trader' | 'pro' | 'expert' | 'master';

export interface ThemeDefinition extends ColorMode {
  tier: TierName;
  xpRequired: number;
  description?: string;
  icon?: string;
}

export const TIER_ICONS: Record<TierName, string> = {
  rookie: '🆓',
  trader: '📊',
  pro: '💼',
  expert: '🎯',
  master: '👑'
};

export const TIER_COLORS: Record<TierName, string> = {
  rookie: 'hsl(210 90% 58%)',
  trader: 'hsl(30 60% 45%)',
  pro: 'hsl(0 0% 75%)',
  expert: 'hsl(45 93% 47%)',
  master: 'hsl(0 0% 90%)'
};

export const PRESET_THEMES: ColorMode[] = [
  {
    id: 'default',
    name: 'Default Theme',
    primary: '210 90% 58%', // Blue
    secondary: '215 16% 47%', // Gray
    accent: '210 90% 58%',
    profit: '210 90% 58%',
    loss: '215 16% 47%',
  },
  {
    id: 'purple',
    name: 'Purple Haze',
    primary: '270 67% 62%', // Purple
    secondary: '239 84% 67%', // Indigo
    accent: '270 67% 62%',
    profit: '270 67% 62%',
    loss: '239 84% 67%',
  },
  {
    id: 'classic',
    name: 'Classic Trader',
    primary: '142 76% 58%', // Green
    secondary: '0 91% 61%', // Red
    accent: '142 76% 58%',
    profit: '142 76% 58%',
    loss: '0 91% 61%',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '217 91% 60%', // Blue
    secondary: '215 16% 47%', // Gray
    accent: '217 91% 60%',
    profit: '217 91% 60%',
    loss: '215 16% 47%',
  },
];

export const getThemeColors = (theme: ColorMode) => {
  return [
    `hsl(${theme.primary})`,
    `hsl(${theme.secondary})`,
    `hsl(${theme.accent})`,
  ];
};

export const ALL_THEMES: ThemeDefinition[] = [
  // ROOKIE (0 XP) - 1 theme
  { ...PRESET_THEMES[0], tier: 'rookie', xpRequired: 0, icon: '🆓', description: 'Clean professional theme' },
  
  // TRADER (1,000 XP) - 2 themes
  { ...PRESET_THEMES[2], tier: 'trader', xpRequired: 1000, icon: '📊', description: 'Traditional trading colors' },
  { ...PRESET_THEMES[1], tier: 'trader', xpRequired: 1000, icon: '💜', description: 'Elegant purple tones' },
  
  // PRO (4,000 XP) - 3 themes
  { ...PRESET_THEMES[3], tier: 'pro', xpRequired: 4000, icon: '🌙', description: 'Dark and focused' },
  { id: 'wall-street', name: 'Wall Street', tier: 'pro', xpRequired: 4000, icon: '💼', description: 'Professional trader', primary: '217 91% 60%', secondary: '142 76% 36%', accent: '217 91% 60%', profit: '142 76% 36%', loss: '0 72% 51%' },
  { id: 'focus', name: 'Focus', tier: 'pro', xpRequired: 4000, icon: '🎯', description: 'Distraction-free', primary: '215 16% 47%', secondary: '215 28% 17%', accent: '215 16% 47%', profit: '215 16% 47%', loss: '215 28% 17%' },
  
  // EXPERT (10,000 XP) - 4 themes
  { id: 'neon', name: 'Neon', tier: 'expert', xpRequired: 10000, icon: '🌃', description: 'Cyberpunk vibes', primary: '280 91% 60%', secondary: '330 91% 60%', accent: '180 91% 60%', profit: '280 91% 60%', loss: '330 91% 60%' },
  { id: 'forest', name: 'Forest', tier: 'expert', xpRequired: 10000, icon: '🌲', description: 'Natural greens', primary: '142 76% 36%', secondary: '142 76% 58%', accent: '142 76% 36%', profit: '142 76% 36%', loss: '142 76% 58%' },
  { id: 'vietnam', name: 'Vietnam', tier: 'expert', xpRequired: 10000, icon: '🇻🇳', description: 'Red and gold', primary: '0 91% 61%', secondary: '45 93% 47%', accent: '0 91% 61%', profit: '0 91% 61%', loss: '45 93% 47%' },
  { id: 'sunset', name: 'Sunset', tier: 'expert', xpRequired: 10000, icon: '🌅', description: 'Warm glow', primary: '30 97% 56%', secondary: '340 82% 52%', accent: '30 97% 56%', profit: '30 97% 56%', loss: '340 82% 52%' },
  
  // MASTER (25,000 XP) - 6 themes
  { id: 'arctic', name: 'Arctic', tier: 'master', xpRequired: 25000, icon: '❄️', description: 'Icy blues', primary: '190 91% 60%', secondary: '200 91% 60%', accent: '190 91% 60%', profit: '190 91% 60%', loss: '200 91% 60%' },
  { id: 'matrix', name: 'Matrix', tier: 'master', xpRequired: 25000, icon: '💻', description: 'Digital green', primary: '120 100% 25%', secondary: '120 100% 15%', accent: '120 100% 25%', profit: '120 100% 25%', loss: '120 100% 15%' },
  { id: 'fire', name: 'Fire', tier: 'master', xpRequired: 25000, icon: '🔥', description: 'Blazing hot', primary: '0 91% 61%', secondary: '30 97% 56%', accent: '0 91% 61%', profit: '0 91% 61%', loss: '30 97% 56%' },
  { id: 'galaxy', name: 'Galaxy', tier: 'master', xpRequired: 25000, icon: '🌌', description: 'Cosmic purple', primary: '270 67% 62%', secondary: '280 91% 60%', accent: '270 67% 62%', profit: '270 67% 62%', loss: '280 91% 60%' },
  { id: 'gold-rush', name: 'Gold Rush', tier: 'master', xpRequired: 25000, icon: '⚜️', description: 'Luxurious gold', primary: '45 93% 47%', secondary: '38 92% 50%', accent: '45 93% 47%', profit: '45 93% 47%', loss: '38 92% 50%' },
  { id: 'synthwave', name: 'Synthwave', tier: 'master', xpRequired: 25000, icon: '🎵', description: 'Retro futuristic', primary: '310 91% 60%', secondary: '180 91% 60%', accent: '310 91% 60%', profit: '310 91% 60%', loss: '180 91% 60%' },
];
