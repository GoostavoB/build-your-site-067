import { TierLevel } from './xpEngine';

export type ColorType = 'primary' | 'secondary' | 'accent' | 'background' | 'profit' | 'loss';

export interface ColorUnlockMilestone {
  colorType: ColorType;
  xpRequired: number;
  category: string;
  description: string;
  emoji: string;
  tierRequired?: 'master';
}

export const COLOR_UNLOCK_MILESTONES: ColorUnlockMilestone[] = [
  {
    colorType: 'primary',
    xpRequired: 0,
    category: 'Basic',
    description: 'Main theme color',
    emoji: '🎨'
  },
  {
    colorType: 'accent',
    xpRequired: 250,
    category: 'Accent',
    description: 'Highlight color',
    emoji: '✨'
  },
  {
    colorType: 'secondary',
    xpRequired: 500,
    category: 'Secondary',
    description: 'Supporting colors',
    emoji: '🌈'
  },
  {
    colorType: 'profit',
    xpRequired: 750,
    category: 'Trading',
    description: 'Profit indicators',
    emoji: '💚'
  },
  {
    colorType: 'loss',
    xpRequired: 750,
    category: 'Trading',
    description: 'Loss indicators',
    emoji: '❤️'
  },
  {
    colorType: 'background',
    xpRequired: 25000,
    category: 'Elite',
    description: 'Custom background colors & gradients',
    emoji: '👑',
    tierRequired: 'master'
  }
];

export const getUnlockedColors = (totalXP: number, tier: TierLevel): ColorType[] => {
  return COLOR_UNLOCK_MILESTONES
    .filter(m => {
      if (m.tierRequired === 'master' && tier < 4) return false;
      return totalXP >= m.xpRequired;
    })
    .map(m => m.colorType);
};

export const getNextColorUnlock = (totalXP: number, tier: TierLevel): ColorUnlockMilestone | null => {
  const locked = COLOR_UNLOCK_MILESTONES.filter(m => {
    if (m.tierRequired === 'master' && tier < 4) return true;
    return totalXP < m.xpRequired;
  });
  
  return locked.length > 0 ? locked[0] : null;
};
