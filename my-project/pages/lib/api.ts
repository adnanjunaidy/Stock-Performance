// lib/api.ts

// 1. A mapping of ticker symbols to CoinGecko IDs (for example).
export const cryptoIds = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    BNB: "binancecoin",
    XRP: "ripple",
    USDC: "usd-coin",
    SOL: "solana",
    ADA: "cardano",
    DOGE: "dogecoin",
    TRX: "tron",
    TON: "toncoin",
    DAI: "dai",
    MATIC: "matic-network",
    DOT: "polkadot",
    LTC: "litecoin",
    BCH: "bitcoin-cash",
    SHIB: "shiba-inu",
    AVAX: "avalanche-2",
    LINK: "chainlink",
    XLM: "stellar",
    UNI: "uniswap",
    ATOM: "cosmos",
    XMR: "monero",
    OKB: "okb",
    ETC: "ethereum-classic",
    // ...add more as needed
  };
  
  // 2. Fetch the crypto price from CoinGecko’s "simple price" endpoint.
  export async function getCryptoPrice(coinId: string): Promise<number> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch crypto price");
    }
    const data = await response.json();
    // The shape is { [coinId]: { usd: number } }
    return data[coinId]?.usd ?? 0;
  }
  