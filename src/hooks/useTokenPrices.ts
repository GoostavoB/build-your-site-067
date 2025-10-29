import { useState, useEffect } from 'react';

export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChange7d?: number;
  priceChangePercentage7d?: number;
  priceChange30d?: number;
  priceChangePercentage30d?: number;
  marketCap?: number;
  volume24h?: number;
  icon?: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Map common symbols to CoinGecko IDs
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  SHIB: 'shiba-inu',
  LTC: 'litecoin',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
};

export const useTokenPrices = (symbols: string[], currency: string = 'usd') => {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbols.length) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000);

    const fetchWithCoingecko = async () => {
      const ids = symbols
        .map(symbol => SYMBOL_TO_ID[symbol.toUpperCase()] || symbol.toLowerCase())
        .join(',');

      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d,30d`,
        { signal: abortController.signal }
      );

      if (!response.ok) throw new Error('Failed to fetch token prices');

      const data = await response.json();
      const priceMap: Record<string, TokenPrice> = {};

      data.forEach((token: any) => {
        const symbol = token.symbol.toUpperCase();
        priceMap[symbol] = {
          symbol,
          name: token.name,
          price: token.current_price,
          priceChange24h: token.price_change_24h || 0,
          priceChangePercentage24h: token.price_change_percentage_24h || 0,
          priceChangePercentage7d: token.price_change_percentage_7d_in_currency || 0,
          priceChangePercentage30d: token.price_change_percentage_30d_in_currency || 0,
          marketCap: token.market_cap,
          volume24h: token.total_volume,
          icon: token.image,
        };
      });

      return priceMap;
    };

    const fetchWithBinanceFallback = async () => {
      const entries = await Promise.all(
        symbols.map(async (sym) => {
          const pair = sym.toUpperCase().endsWith('USDT') ? sym.toUpperCase() : `${sym.toUpperCase()}USDT`;
          try {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
            if (!res.ok) throw new Error('binance not ok');
            const d = await res.json();
            const symbol = d.symbol.replace('USDT','');
            const price: TokenPrice = {
              symbol,
              name: symbol,
              price: parseFloat(d.lastPrice),
              priceChange24h: parseFloat(d.priceChange || '0'),
              priceChangePercentage24h: parseFloat(d.priceChangePercent || '0'),
              marketCap: undefined,
              volume24h: parseFloat(d.quoteVolume || '0'),
            } as TokenPrice;
            return [symbol, price] as const;
          } catch {
            return null;
          }
        })
      );
      const map: Record<string, TokenPrice> = {};
      entries.forEach((e) => { if (e) map[e[0]] = e[1]; });
      return map;
    };

    const fetchPrices = async () => {
      try {
        setLoading(true);
        let priceMap = {} as Record<string, TokenPrice>;
        try {
          priceMap = await fetchWithCoingecko();
        } catch (err) {
          console.warn('CoinGecko failed, falling back to Binance:', err);
          priceMap = await fetchWithBinanceFallback();
        }
        setPrices(priceMap);
        setError(null);
      } catch (err) {
        console.error('Token price fetch error:', err);
        setError('Failed to fetch token prices');
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => { clearInterval(interval); clearTimeout(timeoutId); abortController.abort(); };
  }, [symbols.join(','), currency]);

  return { prices, loading, error };
};
