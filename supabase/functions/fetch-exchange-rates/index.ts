import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExchangeRates {
  timestamp: string;
  crypto: {
    bitcoin: { usd: number };
    ethereum: { usd: number };
  };
  fiat: Record<string, number>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we have recent cached data (less than 30 minutes old)
    const { data: cachedData, error: cacheError } = await supabase
      .from('exchange_rates_cache')
      .select('*')
      .eq('id', 'latest')
      .single();

    if (!cacheError && cachedData) {
      const cacheAge = Date.now() - new Date(cachedData.updated_at).getTime();
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

      // If cache is fresh, return it immediately
      if (cacheAge < CACHE_DURATION) {
        console.log(`Using cached data (age: ${Math.round(cacheAge / 1000 / 60)} minutes)`);
        return new Response(
          JSON.stringify({
            success: true,
            data: cachedData.rates,
            cached: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    console.log('Cache miss or stale, fetching fresh exchange rates...');

    // Fetch crypto prices from CoinGecko
    const cryptoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!cryptoResponse.ok) {
      const errorText = await cryptoResponse.text();
      console.error('CoinGecko API error:', errorText);
      
      // If rate limited (429), return cached data if available
      if (cryptoResponse.status === 429 && cachedData) {
        console.log('Rate limited, falling back to cached data');
        return new Response(
          JSON.stringify({
            success: true,
            data: cachedData.rates,
            cached: true,
            rateLimited: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
      
      throw new Error(`CoinGecko API failed: ${cryptoResponse.status}`);
    }

    const cryptoData = await cryptoResponse.json();
    console.log('Crypto prices fetched:', cryptoData);

    // Fetch fiat exchange rates (using exchangerate-api.com - free tier)
    const fiatResponse = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!fiatResponse.ok) {
      console.error('Exchange Rate API error:', await fiatResponse.text());
      throw new Error(`Exchange Rate API failed: ${fiatResponse.status}`);
    }

    const fiatData = await fiatResponse.json();
    console.log('Fiat rates fetched successfully');

    // Prepare the response data
    const exchangeRates: ExchangeRates = {
      timestamp: new Date().toISOString(),
      crypto: cryptoData,
      fiat: fiatData.rates,
    };

    // Store or update exchange rates in cache table
    const { error: upsertError } = await supabase
      .from('exchange_rates_cache')
      .upsert({
        id: 'latest',
        rates: exchangeRates,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error('Error caching rates:', upsertError);
    } else {
      console.log('Exchange rates cached successfully');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: exchangeRates,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Try to return cached data as fallback
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: fallbackData } = await supabase
        .from('exchange_rates_cache')
        .select('*')
        .eq('id', 'latest')
        .single();
      
      if (fallbackData) {
        console.log('Returning cached data as fallback after error');
        return new Response(
          JSON.stringify({
            success: true,
            data: fallbackData.rates,
            cached: true,
            fallback: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
