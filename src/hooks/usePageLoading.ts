import { useEffect, useState } from 'react';

/**
 * Hook to manage page-level loading states
 * Can be used by individual pages to show skeletons during data fetching
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { isLoading, setLoading } = usePageLoading();
 *   
 *   useEffect(() => {
 *     setLoading(true);
 *     fetchData().finally(() => setLoading(false));
 *   }, []);
 *   
 *   if (isLoading) return <PageSkeleton type="dashboard" />;
 *   
 *   return <div>Content</div>;
 * }
 * ```
 */
export function usePageLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return {
    isLoading,
    setLoading,
    startLoading: () => setLoading(true),
    stopLoading: () => setLoading(false),
  };
}

/**
 * Hook for async operations with automatic loading state
 * 
 * @example
 * ```tsx
 * const { execute, isLoading } = useAsyncLoading(async () => {
 *   const data = await fetchData();
 *   return data;
 * });
 * 
 * if (isLoading) return <PageSkeleton />;
 * ```
 */
export function useAsyncLoading<T>(
  asyncFunction: () => Promise<T>,
  options: { immediate?: boolean } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [options.immediate]);

  return {
    execute,
    isLoading,
    error,
    data,
  };
}
