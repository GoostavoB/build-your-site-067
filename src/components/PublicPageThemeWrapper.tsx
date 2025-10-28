// src/components/PublicPageThemeWrapper.tsx
// REVISED VERSION - Actually applies CSS variables programmatically

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface PublicPageThemeWrapperProps {
  children: React.ReactNode;
}

// Brand default theme (blue/gray)
const DEFAULT_BRAND_THEME = {
  primary: '222 47% 50%',        // Blue
  'primary-hover': '222 47% 45%',
  secondary: '215 16% 47%',      // Gray
  accent: '217 91% 60%',
  profit: '142 76% 36%',
  loss: '0 84% 60%',
  // Hero specific colors if needed
  'hero-bg': '222 47% 11%',
  'hero-text': '210 40% 98%',
};

/**
 * PublicPageThemeWrapper
 * 
 * REVISED: This component now ACTUALLY APPLIES CSS variables programmatically,
 * not just setting data-theme attribute that nothing reads.
 * 
 * Forces brand colors (blue/gray) on all public pages.
 */
export const PublicPageThemeWrapper: React.FC<PublicPageThemeWrapperProps> = ({ children }) => {
  const { setTheme } = useTheme();
  const previousValuesRef = useRef<Record<string, string>>({});
  const isAppliedRef = useRef(false);

  useEffect(() => {
    if (isAppliedRef.current) return;
    
    console.log('[PublicPageThemeWrapper] Applying brand theme');
    
    const root = document.documentElement;
    
    // Force dark mode
    setTheme('dark');
    
    // ===================================================================
    // FIX: Actually apply CSS variables programmatically
    // ===================================================================
    
    // Save current values for restoration
    Object.keys(DEFAULT_BRAND_THEME).forEach((key) => {
      const cssVarName = `--${key}`;
      const currentValue = root.style.getPropertyValue(cssVarName);
      if (currentValue) {
        previousValuesRef.current[cssVarName] = currentValue;
      }
    });
    
    // Apply brand theme variables
    Object.entries(DEFAULT_BRAND_THEME).forEach(([key, value]) => {
      const cssVarName = `--${key}`;
      root.style.setProperty(cssVarName, value);
      console.log(`[PublicPageThemeWrapper] Set ${cssVarName}: ${value}`);
    });
    
    // Set data-theme attribute for any CSS that might use it
    root.setAttribute('data-theme', 'default');
    
    isAppliedRef.current = true;
    console.log('[PublicPageThemeWrapper] ✅ Brand theme applied');

    // ===================================================================
    // Cleanup: Restore previous values on unmount
    // ===================================================================
    return () => {
      if (!isAppliedRef.current) return;
      
      console.log('[PublicPageThemeWrapper] Restoring previous theme');
      
      // Restore previous CSS variable values
      Object.entries(previousValuesRef.current).forEach(([cssVar, value]) => {
        root.style.setProperty(cssVar, value);
      });
      
      // Remove any variables that didn't exist before
      Object.keys(DEFAULT_BRAND_THEME).forEach((key) => {
        const cssVarName = `--${key}`;
        if (!previousValuesRef.current[cssVarName]) {
          root.style.removeProperty(cssVarName);
        }
      });
      
      root.removeAttribute('data-theme');
      isAppliedRef.current = false;
      
      console.log('[PublicPageThemeWrapper] ✅ Theme restored');
    };
  }, [setTheme]);

  return <>{children}</>;
};
