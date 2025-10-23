import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { getLanguageFromPath } from '@/utils/languageRouting';

/**
 * Component to sync i18n language with URL path
 * Ensures that the language state stays in sync with the current route
 */
export const LanguageSync = () => {
  const location = useLocation();
  const { language, changeLanguage } = useTranslation();

  useEffect(() => {
    const pathLanguage = getLanguageFromPath(location.pathname);
    
    // Only change if different from current language
    if (pathLanguage !== language) {
      changeLanguage(pathLanguage);
    }
  }, [location.pathname, language, changeLanguage]);

  return null; // This component doesn't render anything
};
