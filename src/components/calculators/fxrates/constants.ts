export const API_KEY = "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

// Using Vite proxy to avoid CORS issues in development
export const FRED_URL = `/api/fred/fred/series/observations?api_key=${API_KEY}`;

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
];
