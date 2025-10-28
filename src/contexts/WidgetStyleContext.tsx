import { createContext, useContext, ReactNode } from 'react';
import { useWidgetStyles } from '@/hooks/useWidgetStyles';

interface WidgetStyle {
  id: string;
  style_id: string;
  style_name: string;
  style_config: any;
}

interface WidgetStyleContextType {
  activeStyle: WidgetStyle | null;
  loading: boolean;
}

const WidgetStyleContext = createContext<WidgetStyleContextType | undefined>(undefined);

interface WidgetStyleProviderProps {
  children: ReactNode;
}

export const WidgetStyleProvider = ({ children }: WidgetStyleProviderProps) => {
  const { activeStyle, loading } = useWidgetStyles();

  return (
    <WidgetStyleContext.Provider value={{ activeStyle, loading }}>
      {children}
    </WidgetStyleContext.Provider>
  );
};

export const useWidgetStyleContext = () => {
  const context = useContext(WidgetStyleContext);
  if (context === undefined) {
    throw new Error('useWidgetStyleContext must be used within a WidgetStyleProvider');
  }
  return context;
};

/**
 * Hook to generate CSS classes from active widget style config
 */
export const useWidgetStyleClasses = () => {
  const { activeStyle } = useWidgetStyleContext();

  if (!activeStyle?.style_config) {
    return {
      cardClasses: 'glass',
      applyStyle: (baseClasses: string) => baseClasses || 'glass',
      inlineStyles: {},
    };
  }

  const config = activeStyle.style_config as {
    background?: string;
    border?: string;
    backdropFilter?: string;
    boxShadow?: string;
  };

  // Generate inline styles from config
  const inlineStyles: React.CSSProperties = {};
  if (config.background) inlineStyles.background = config.background;
  if (config.border) inlineStyles.border = config.border;
  if (config.backdropFilter) inlineStyles.backdropFilter = config.backdropFilter;
  if (config.boxShadow) inlineStyles.boxShadow = config.boxShadow;

  return {
    cardClasses: 'rounded-lg', // Base classes only
    inlineStyles,
    applyStyle: (baseClasses: string = '') => {
      // Remove 'glass' classes if they exist and replace with base
      return baseClasses.replace(/glass(-\w+)?/g, 'rounded-lg');
    },
  };
};
