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
        title: 'The #1 Crypto Trading Journal | Track & Analyze Every Trade',
        description: 'Track, analyze, and review every crypto trade with AI. Built exclusively for crypto traders. Advanced analytics, automated insights, and performance tracking.',
        canonical: 'https://www.thetradingdiary.com/',
      });
    };
  }, [meta.title, meta.description, meta.canonical]);
};

// Re-export PageMeta type for convenience
export type { PageMeta } from '@/utils/seoHelpers';
