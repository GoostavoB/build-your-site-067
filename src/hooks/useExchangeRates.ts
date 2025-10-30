import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRates {
  timestamp: string;
  crypto: {
    bitcoin: { usd: number };
    ethereum: { usd: number };
  };
  fiat: Record<string, number>;
}

interface CachedRates {
  id: string;
  rates: ExchangeRates;
  updated_at: string;
}

/**
 * Hook to fetch real-time exchange rates
 * Updates every 5 minutes from cache, cache refreshes every 10 minutes
 */
export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<ExchangeRates> => {
      // First try to get cached rates
      const { data: cached, error } = await supabase
        .from('exchange_rates_cache')
        .select('*')
        .eq('id', 'latest')
        .maybeSingle();

      // If cache exists and is less than 15 minutes old, use it
      if (cached && !error) {
        const cacheAge = Date.now() - new Date(cached.updated_at).getTime();
        const fifteenMinutes = 15 * 60 * 1000;
        
        if (cacheAge < fifteenMinutes) {
          console.log('Using cached exchange rates');
          return cached.rates as unknown as ExchangeRates;
        }
      }

      // Cache is stale or doesn't exist, try to fetch fresh data
      // But if we have stale cache and get rate limited, use stale cache
      console.log('Fetching fresh exchange rates...');
      const { data, error: fetchError } = await supabase.functions.invoke<{ success: boolean; data: ExchangeRates }>('fetch-exchange-rates');

      if (fetchError) {
        console.error('Error fetching exchange rates:', fetchError);
        
        // If we have cached data (even if stale), use it instead of throwing
        if (cached) {
          const cacheAge = Date.now() - new Date(cached.updated_at).getTime();
          const oneHour = 60 * 60 * 1000;
          
          // Use cache if it's less than 1 hour old, even if stale
          if (cacheAge < oneHour) {
            console.log('Using stale cache due to fetch error (cache age:', Math.round(cacheAge / 60000), 'minutes)');
            return cached.rates as unknown as ExchangeRates;
          }
        }
        
        throw fetchError;
      }

      if (!data?.data) {
        throw new Error('Invalid response from exchange rates API');
      }

      return data.data;
    },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    refetchOnWindowFocus: false, // Reduce API calls on window focus
    retry: 1, // Only retry once on failure
  });
}
