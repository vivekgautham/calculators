export const API_KEY = "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

// In development, we use Vite's proxy (defined in vite.config.ts) to avoid CORS issues.
// In production (GitHub Pages), we use allorigins.win as a CORS proxy because FRED API
// does not support Cross-Origin Resource Sharing for browser requests.
export const FRED_URL = import.meta.env.DEV
  ? `/api/fred/fred/series/observations?api_key=${API_KEY}`
  : `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}`
    )}`;

export const SERIES_NAMES = [
  { id: "DEXINUS", name: "USD/INR" },
  { id: "DEXCHUS", name: "USD/CNY" },
  { id: "DEXJPUS", name: "USD/JPY" },
  { id: "DEXUSUK", name: "GBP/USD" },
  { id: "DEXUSAL", name: "AUD/USD" },
  { id: "DEXCAUS", name: "USD/CAD" },
  { id: "DEXKOUS", name: "USD/KRW" },
  { id: "DEXUSEU", name: "EUR/USD" },
  { id: "DEXSIUS", name: "USD/SGD" },
  { id: "DEXUSNZ", name: "NZD/USD" },
  { id: "DEXTAUS", name: "TWD/USD" },
  { id: "DEXBZUS", name: "BRL/USD" },
];
