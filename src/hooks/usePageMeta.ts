import { useEffect } from 'react';
import { updatePageMeta, PageMeta } from '@/utils/seoHelpers';

/**
 * Hook to manage page meta tags for SEO
 * Automatically updates meta tags when component mounts
 */
export const usePageMeta = (meta: PageMeta) => {
  useEffect(() => {
    updatePageMeta(meta);

    // Cleanup - reset to default on unmount
    return () => {
      updatePageMeta({
        title: 'The Trading Diary - Your Trades. Your Data. Your Edge.',
        description: 'Advanced trading journal for crypto and stock traders. Track performance, analyze trades, and improve your trading strategy with powerful analytics and insights.',
        canonical: 'https://www.thetradingdiary.com/',
      });
    };
  }, [meta.title, meta.description, meta.canonical]);
};

// Re-export PageMeta type for convenience
export type { PageMeta } from '@/utils/seoHelpers';
