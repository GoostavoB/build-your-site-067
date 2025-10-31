/**
 * Shared utilities for exchange integrations
 */

/**
 * Derives a CryptoKey from the encryption key environment variable
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = Deno.env.get('EXCHANGE_CREDENTIALS_ENCRYPTION_KEY');
  
  if (!keyString) {
    throw new Error('EXCHANGE_CREDENTIALS_ENCRYPTION_KEY environment variable not set');
  }
  
  // Convert hex string to ArrayBuffer
  const keyData = new Uint8Array(keyString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts text using AES-256-GCM
 */
export async function encrypt(text: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  
  // Return JSON with IV and encrypted data
  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  });
}

/**
 * Decrypts text using AES-256-GCM
 */
export async function decrypt(text: string): Promise<string> {
  const key = await getEncryptionKey();
  const { iv, data } = JSON.parse(text);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  
  return new TextDecoder().decode(decrypted);
}

/**
 * Supported exchanges list
 */
export const SUPPORTED_EXCHANGES = [
  'binance',
  'bybit',
  'coinbase',
  'kraken',
  'bitfinex',
  'bingx',
  'mexc',
  'kucoin',
  'okx',
  'gateio',
  'bitstamp',
] as const;

export type SupportedExchange = typeof SUPPORTED_EXCHANGES[number];

/**
 * Exchanges that require API passphrase
 */
export const EXCHANGES_REQUIRING_PASSPHRASE: SupportedExchange[] = ['kucoin', 'okx', 'bitstamp'];

/**
 * Check if exchange requires passphrase
 */
export function requiresPassphrase(exchange: string): boolean {
  return EXCHANGES_REQUIRING_PASSPHRASE.includes(exchange as SupportedExchange);
}

/**
 * Validate exchange name
 */
export function isSupportedExchange(exchange: string): boolean {
  return SUPPORTED_EXCHANGES.includes(exchange.toLowerCase() as SupportedExchange);
}
