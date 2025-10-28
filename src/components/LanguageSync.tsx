// src/components/LanguageSync.tsx
// REVISED VERSION - Only handles RTL direction, NO language changes

import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * LanguageSync Component
 * 
 * REVISED: This component ONLY handles document direction (RTL for Arabic).
 * It does NOT call changeLanguage() - that's handled by LanguageProvider only.
 * 
 * This eliminates duplicate language synchronization and race conditions.
 */
export const LanguageSync = () => {
  const { language } = useLanguage();

  // ===================================================================
  // ONLY responsibility: Set document direction
  // ===================================================================
  useEffect(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    console.log(`[LanguageSync] Set direction: ${direction} for language: ${language}`);
  }, [language]);

  return null;
};
